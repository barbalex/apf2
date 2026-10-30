-- query_tpop: PostgREST-callable replacement for the filtered allTpops
-- GraphQL query. Accepts exactly the jsonb that treeTpopGqlFilterAtom
-- (src/store/index.ts) emits today and returns the matching tpop rows.
-- Spike for the PostgREST migration, see tasks.md phase 0.
--
-- INVOKER rights on purpose: the dynamic SQL runs as the caller, so the
-- tpop RLS policies apply. PostgREST calls this as the JWT role.
--
-- Example:
--   POST /rpc/query_tpop?select=id,nr,flurname
--   {"p_filter": {"or": [
--     {"popByPopId": {"apId": {"equalTo": "<uuid>"}},
--      "flurname": {"includes": "Wiese"}}]}}
--
--   p_order: [{"field": "popByPopId.nr", "dir": "asc", "nulls": "last"},
--             {"field": "nr", "dir": "asc"}]
--   (replaces pg-order-by-related enums like POP_BY_POP_ID__NR_ASC;
--    "label" orders via apflora.tpop_label)
--
-- Apply:
--   docker exec -i apf_db psql -U postgres -d apflora -v ON_ERROR_STOP=1 \
--     < sql/postgrest/queryTpop.sql

BEGIN;

CREATE OR REPLACE FUNCTION apflora.query_tpop(
  p_filter jsonb DEFAULT null,
  p_order jsonb DEFAULT null,
  p_limit integer DEFAULT null,
  p_offset integer DEFAULT null
)
RETURNS SETOF apflora.tpop
LANGUAGE plpgsql
STABLE
AS $func$
DECLARE
  v_where text;
  v_order_parts text[] := ARRAY[]::text[];
  v_item jsonb;
  v_field text;
  v_dir text;
  v_nulls text;
  v_col text;
  v_col_type text;
  v_rel record;
  v_expr text;
BEGIN
  IF p_limit IS NOT NULL AND p_limit < 0 THEN
    RAISE EXCEPTION 'query_tpop: p_limit must be >= 0';
  END IF;
  IF p_offset IS NOT NULL AND p_offset < 0 THEN
    RAISE EXCEPTION 'query_tpop: p_offset must be >= 0';
  END IF;

  v_where := apflora.compile_filter('apflora.tpop', 'tpop', p_filter);

  IF p_order IS NOT NULL THEN
    IF jsonb_typeof(p_order) <> 'array' THEN
      RAISE EXCEPTION
        'query_tpop: p_order must be an array of {"field": ..., "dir": "asc"|"desc", "nulls": "first"|"last"}';
    END IF;
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_order) LOOP
      v_field := v_item->>'field';
      v_dir := lower(coalesce(v_item->>'dir', 'asc'));
      v_nulls := lower(coalesce(v_item->>'nulls', ''));
      IF v_dir NOT IN ('asc', 'desc') THEN
        RAISE EXCEPTION 'query_tpop: bad dir "%"', v_dir;
      END IF;
      IF v_nulls NOT IN ('', 'first', 'last') THEN
        RAISE EXCEPTION 'query_tpop: bad nulls "%"', v_nulls;
      END IF;

      IF v_field = 'label' THEN
        v_expr := 'apflora.tpop_label(tpop)';
      ELSIF position('.' in v_field) > 0 THEN
        -- order by a parent column: {"field": "popByPopId.nr"}
        SELECT * INTO v_rel FROM apflora.resolve_forward_relation(
          'apflora.tpop', split_part(v_field, '.', 1)
        );
        IF NOT FOUND THEN
          RAISE EXCEPTION 'query_tpop: % is not a relation of apflora.tpop',
            split_part(v_field, '.', 1);
        END IF;
        v_col := apflora.camel_to_snake(split_part(v_field, '.', 2));
        SELECT format_type(a.atttypid, a.atttypmod) INTO v_col_type
          FROM pg_attribute a
         WHERE a.attrelid = v_rel.parent_table::regclass
           AND a.attname = v_col
           AND a.attnum > 0
           AND NOT a.attisdropped;
        IF v_col_type IS NULL THEN
          RAISE EXCEPTION 'query_tpop: % has no column %',
            v_rel.parent_table, v_col;
        END IF;
        v_expr := format(
          '(select r.%I from %s r where r.%I = tpop.%I)',
          v_col, v_rel.parent_table, v_rel.parent_col, v_rel.child_col
        );
      ELSE
        v_col := apflora.camel_to_snake(v_field);
        SELECT format_type(a.atttypid, a.atttypmod) INTO v_col_type
          FROM pg_attribute a
         WHERE a.attrelid = 'apflora.tpop'::regclass
           AND a.attname = v_col
           AND a.attnum > 0
           AND NOT a.attisdropped;
        IF v_col_type IS NULL THEN
          RAISE EXCEPTION 'query_tpop: apflora.tpop has no column %', v_col;
        END IF;
        v_expr := format('%I.%I', 'tpop', v_col);
      END IF;

      v_order_parts := v_order_parts || ARRAY[
        v_expr || ' ' || v_dir
          || CASE WHEN v_nulls <> '' THEN ' nulls ' || v_nulls ELSE '' END
      ];
    END LOOP;
  END IF;

  RETURN QUERY EXECUTE format(
    'select tpop.* from apflora.tpop tpop where (%s) order by %s%s%s',
    v_where,
    CASE
      WHEN array_length(v_order_parts, 1) > 0
        THEN array_to_string(v_order_parts, ', ')
      ELSE 'tpop.nr asc, tpop.flurname asc'  -- the tree's default order
    END,
    CASE WHEN p_limit IS NOT NULL THEN format(' limit %s', p_limit) ELSE '' END,
    CASE WHEN p_offset IS NOT NULL THEN format(' offset %s', p_offset) ELSE '' END
  );
END
$func$;

-- the roles that may SELECT apflora.tpop today; RLS decides the rows.
-- anon is deliberately not granted (same as today: no table access).
REVOKE EXECUTE ON FUNCTION apflora.query_tpop(jsonb, jsonb, integer, integer)
  FROM public;
GRANT EXECUTE ON FUNCTION apflora.query_tpop(jsonb, jsonb, integer, integer) TO
  apflora_reader,
  apflora_ap_reader,
  apflora_ap_writer,
  apflora_manager,
  apflora_freiwillig;

COMMIT;
