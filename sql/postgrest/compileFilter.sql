-- compile_filter: compiles the jsonb filter objects the frontend filter atoms
-- (src/store/index.ts, tree*GqlFilterAtom / src/store/DataFilter) currently
-- emit for PostGraphile's connection-filter plugin into a SQL boolean
-- expression. Spike for the PostgREST migration, see tasks.md phase 0.
--
-- Supported (everything the atoms emit today):
--   {"and": [filter, ...]} / {"or": [filter, ...]}        — arbitrary nesting
--   {"flurname": {"includes" | "includesInsensitive": "x"}}
--   {"nr": {"equalTo" | "notEqualTo" |
--           "greaterThanOrEqualTo" | "lessThanOrEqualTo": 100}}
--   {"id": {"in": ["uuid", ...]}}
--   {"apberRelevant": {"isNull": true | false}}
--   {"geomPoint": {"coveredBy": <GeoJSON>}}                — st_coveredby
--   {"label": {"includesInsensitive": "x"}}               — apflora.<table>_label(row)
--   {"popByPopId": {<filter on apflora.pop>}}              — forward relation,
--     compiles to an exists-subquery and recurses (tpopmassn→tpop→pop→ap …)
--
-- Not supported (not used by the atoms): "not", reverse relations
-- ("tpopsByPopId"), other postgis operators (contains/within/intersects —
-- same pattern as coveredBy when needed).
--
-- Injection safety: identifiers are never taken from the filter — column and
-- relation names are validated against the catalog before use; values are
-- always bound via format('%L'); order directions are whitelisted.
--
-- SECURITY DEFINER because it only reads catalogs to build a string; the
-- string is executed later by the *invoker* of the query_<table> function,
-- so RLS applies there.
--
-- Apply:
--   docker exec -i apf_db psql -U postgres -d apflora -v ON_ERROR_STOP=1 \
--     < sql/postgrest/compileFilter.sql

BEGIN;

-- "apId" -> "ap_id", "statusUnklar" -> "status_unklar", "PopId" -> "pop_id"
-- (leading uppercase would otherwise produce a leading underscore)
CREATE OR REPLACE FUNCTION apflora.camel_to_snake(p_name text)
RETURNS text
LANGUAGE sql
IMMUTABLE
STRICT
AS $$
  SELECT ltrim(lower(regexp_replace(p_name, '([A-Z])', '_\1', 'g')), '_')
$$;

-- Resolves a PostGraphile-style forward relation key of p_table
-- ("popByPopId" = referenced table + local fk column pop_id) against the
-- catalog. Returns no row when the key is not a forward relation.
CREATE OR REPLACE FUNCTION apflora.resolve_forward_relation(
  p_table text,
  p_relation_key text
)
RETURNS TABLE (
  parent_table text,
  parent_col text,
  child_col text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
  SELECT
    fk.confrelid::regclass::text,
    pa.attname::text,
    ca.attname::text
  FROM pg_constraint fk
  JOIN pg_constraint pk
    ON pk.conrelid = fk.confrelid
   AND (pk.contype = 'p' OR (pk.contype = 'u' AND fk.confkey = pk.conkey))
  JOIN pg_attribute ca
    ON ca.attrelid = fk.conrelid AND ca.attnum = ANY (fk.conkey)
  JOIN pg_attribute pa
    ON pa.attrelid = fk.confrelid AND pa.attnum = ANY (pk.conkey)
  WHERE fk.contype = 'f'
    AND fk.conrelid = p_table::regclass
    AND ca.attname = apflora.camel_to_snake(
      substring(p_relation_key FROM 'By([A-Z][a-zA-Z0-9]*)$')
    )
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION apflora.compile_filter(
  p_table text,  -- schema-qualified, e.g. 'apflora.tpop'
  p_alias text,  -- alias the expression will be evaluated against
  p_filter jsonb
)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog
AS $func$
DECLARE
  v_parts text[] := ARRAY[]::text[];
  v_key text;
  v_value jsonb;
  v_op text;
  v_op_value jsonb;
  v_col text;
  v_col_type text;
  v_is_geometry boolean;
  v_lit text;
  v_lits text[];
  v_sub text;
  v_sub_parts text[] := ARRAY[]::text[];
  v_item jsonb;
  v_rel record;
  v_label_fn text;
  v_expr text;
BEGIN
  IF p_filter IS NULL OR p_filter IN ('{}', 'null') THEN
    RETURN 'true';
  END IF;

  FOR v_key, v_value IN SELECT * FROM jsonb_each(p_filter) LOOP

    -- logical combinators; an empty array compiles to "true", mirroring the
    -- atoms which emit {or: []} to express "no restriction"
    IF v_key IN ('and', 'or') THEN
      IF jsonb_typeof(v_value) <> 'array' THEN
        RAISE EXCEPTION 'compile_filter: "%" expects an array, got %',
          v_key, jsonb_typeof(v_value);
      END IF;
      v_sub_parts := ARRAY[]::text[];
      FOR v_item IN SELECT * FROM jsonb_array_elements(v_value) LOOP
        v_sub_parts := v_sub_parts
          || apflora.compile_filter(p_table, p_alias, v_item);
      END LOOP;
      IF array_length(v_sub_parts, 1) > 0 THEN
        v_parts := v_parts || ARRAY[
          '(' || array_to_string(
            v_sub_parts,
            CASE WHEN v_key = 'and' THEN ' AND ' ELSE ' OR ' END
          ) || ')'
        ];
      END IF;

    -- computed label column, e.g. apflora.tpop_label(tpop);
    -- variants labelEk/labelEkf map to e.g. tpopkontr_label_ek(tpopkontr)
    ELSIF v_key IN ('label', 'labelEk', 'labelEkf') THEN
      v_label_fn :=
        split_part(p_table, '.', 2) || '_' || apflora.camel_to_snake(v_key);
      IF NOT EXISTS (
        SELECT 1
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname = 'apflora'
          AND p.proname = v_label_fn
          AND p.pronargs = 1
      ) THEN
        RAISE EXCEPTION 'compile_filter: apflora.% does not exist', v_label_fn;
      END IF;
      FOR v_op, v_op_value IN SELECT * FROM jsonb_each(v_value) LOOP
        v_lit := v_op_value #>> '{}';
        CASE v_op
          WHEN 'includes' THEN
            v_parts := v_parts || ARRAY[format(
              'apflora.%s(%s) LIKE %L', v_label_fn, p_alias, '%' || v_lit || '%'
            )];
          WHEN 'includesInsensitive' THEN
            v_parts := v_parts || ARRAY[format(
              'apflora.%s(%s) ILIKE %L', v_label_fn, p_alias, '%' || v_lit || '%'
            )];
          WHEN 'equalTo' THEN
            v_parts := v_parts || ARRAY[format(
              'apflora.%s(%s) = %L', v_label_fn, p_alias, v_lit
            )];
          WHEN 'distinctFrom' THEN
            v_parts := v_parts || ARRAY[format(
              'apflora.%s(%s) IS DISTINCT FROM %L', v_label_fn, p_alias, v_lit
            )];
          WHEN 'notDistinctFrom' THEN
            v_parts := v_parts || ARRAY[format(
              'apflora.%s(%s) IS NOT DISTINCT FROM %L', v_label_fn, p_alias, v_lit
            )];
          ELSE
            RAISE EXCEPTION
              'compile_filter: unsupported operator "%" on label (supported: includes, includesInsensitive, equalTo, distinctFrom, notDistinctFrom)',
              v_op;
        END CASE;
      END LOOP;

    ELSE
      SELECT * INTO v_rel
      FROM apflora.resolve_forward_relation(p_table, v_key);

      IF FOUND THEN
        -- forward relation: exists-subquery, recursing into the parent filter
        v_sub := apflora.compile_filter(
          v_rel.parent_table,
          p_alias || '__' || v_rel.child_col,
          v_value
        );
        v_parts := v_parts || ARRAY[format(
          'exists (select 1 from %s %I where %I.%I = %I.%I and (%s))',
          v_rel.parent_table,
          p_alias || '__' || v_rel.child_col,
          p_alias || '__' || v_rel.child_col,
          v_rel.parent_col,
          p_alias,
          v_rel.child_col,
          v_sub
        )];
      ELSE
        -- plain column
        v_col := apflora.camel_to_snake(v_key);
        SELECT format_type(a.atttypid, a.atttypmod),
               (t.typname = 'geometry')
          INTO v_col_type, v_is_geometry
          FROM pg_attribute a
          JOIN pg_type t ON t.oid = a.atttypid
         WHERE a.attrelid = p_table::regclass
           AND a.attname = v_col
           AND a.attnum > 0
           AND NOT a.attisdropped;
        IF v_col_type IS NULL THEN
          -- computed column? PostGraphile exposes 1-arg row functions as
          -- fields, snake-cased (labelEk -> tpopkontr_label_ek) or with the
          -- bare lowercased key (wgs84Lat -> beob_wgs84lat)
          SELECT p2.proname, format_type(p2.prorettype, NULL)
            INTO v_label_fn, v_col_type
            FROM pg_proc p2
            JOIN pg_namespace n2 ON n2.oid = p2.pronamespace
           WHERE n2.nspname = 'apflora'
             AND p2.proname IN (
               split_part(p_table, '.', 2) || '_' ||
                 apflora.camel_to_snake(v_key),
               split_part(p_table, '.', 2) || '_' || lower(v_key)
             )
             AND p2.pronargs = 1
             AND p2.proargtypes[0] = (
               SELECT c.reltype FROM pg_class c WHERE c.oid = p_table::regclass
             );
          IF v_label_fn IS NULL THEN
            RAISE EXCEPTION 'compile_filter: % has no column % (key: %)',
              p_table, v_col, v_key;
          END IF;
          v_expr := format('apflora.%s(%s)', v_label_fn, p_alias);
          v_is_geometry := false;
        ELSE
          v_expr := format('%I.%I', p_alias, v_col);
        END IF;

        FOR v_op, v_op_value IN SELECT * FROM jsonb_each(v_value) LOOP
          v_lit := v_op_value #>> '{}';
          CASE v_op
            WHEN 'equalTo' THEN
              v_parts := v_parts || ARRAY[format(
                '%s = %L::%s', v_expr, v_lit, v_col_type
              )];
            WHEN 'notEqualTo' THEN
              v_parts := v_parts || ARRAY[format(
                '%s <> %L::%s', v_expr, v_lit, v_col_type
              )];
            WHEN 'greaterThanOrEqualTo' THEN
              v_parts := v_parts || ARRAY[format(
                '%s >= %L::%s', v_expr, v_lit, v_col_type
              )];
            WHEN 'lessThanOrEqualTo' THEN
              v_parts := v_parts || ARRAY[format(
                '%s <= %L::%s', v_expr, v_lit, v_col_type
              )];
            WHEN 'in' THEN
              IF jsonb_typeof(v_op_value) <> 'array' THEN
                RAISE EXCEPTION 'compile_filter: "in" expects an array';
              END IF;
              v_lits := ARRAY(
                SELECT format('%L', x)
                FROM jsonb_array_elements_text(v_op_value) AS x
              );
              v_parts := v_parts || ARRAY[format(
                '%s = ANY (array[%s]::%s[])',
                v_expr, array_to_string(v_lits, ', '), v_col_type
              )];
            WHEN 'isNull' THEN
              IF v_lit = 'true' THEN
                v_parts := v_parts || ARRAY[
                  format('%s IS NULL', v_expr)
                ];
              ELSE
                v_parts := v_parts || ARRAY[
                  format('%s IS NOT NULL', v_expr)
                ];
              END IF;
            WHEN 'distinctFrom' THEN
              v_parts := v_parts || ARRAY[format(
                '%s IS DISTINCT FROM %L::%s', v_expr, v_lit, v_col_type
              )];
            WHEN 'notDistinctFrom' THEN
              v_parts := v_parts || ARRAY[format(
                '%s IS NOT DISTINCT FROM %L::%s', v_expr, v_lit, v_col_type
              )];
            WHEN 'includes' THEN
              v_parts := v_parts || ARRAY[format(
                '%s LIKE %L', v_expr, '%' || v_lit || '%'
              )];
            WHEN 'includesInsensitive' THEN
              v_parts := v_parts || ARRAY[format(
                '%s ILIKE %L', v_expr, '%' || v_lit || '%'
              )];
            WHEN 'coveredBy' THEN
              IF NOT v_is_geometry THEN
                RAISE EXCEPTION
                  'compile_filter: coveredBy needs a geometry column, %.% is %',
                  p_table, v_col, v_col_type;
              END IF;
              v_parts := v_parts || ARRAY[format(
                'public.st_coveredby(%s, public.st_geomfromgeojson(%L::jsonb))',
                v_expr, v_op_value::text
              )];
            ELSE
              RAISE EXCEPTION
                'compile_filter: unsupported operator "%" on %.% (supported: equalTo, notEqualTo, greaterThanOrEqualTo, lessThanOrEqualTo, in, isNull, distinctFrom, notDistinctFrom, includes, includesInsensitive, coveredBy)',
                v_op, p_table, v_col;
          END CASE;
        END LOOP;
      END IF;
    END IF;
  END LOOP;

  IF array_length(v_parts, 1) IS NULL THEN
    RETURN 'true';
  END IF;
  RETURN array_to_string(v_parts, ' AND ');
END
$func$;

-- helpers are internal (string builders + catalog reads, nothing sensitive),
-- but query_tpop runs with invoker rights and calls them directly, so the
-- calling roles need EXECUTE on them too
REVOKE EXECUTE ON FUNCTION apflora.camel_to_snake(text) FROM public;
REVOKE EXECUTE ON FUNCTION apflora.resolve_forward_relation(text, text) FROM public;
REVOKE EXECUTE ON FUNCTION apflora.compile_filter(text, text, jsonb) FROM public;
GRANT EXECUTE ON FUNCTION apflora.camel_to_snake(text) TO
  apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;
GRANT EXECUTE ON FUNCTION apflora.resolve_forward_relation(text, text) TO
  apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;
GRANT EXECUTE ON FUNCTION apflora.compile_filter(text, text, jsonb) TO
  apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

COMMIT;
