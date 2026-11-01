-- Equivalence tests for the PostgREST spike (tasks.md phase 0).
-- Every test compiles a filter exactly like the frontend atoms build it,
-- runs it through apflora.query_tpop and compares the resulting rows with
-- hand-written SQL. Fails loudly (ON_ERROR_STOP) on any mismatch.
--
-- Run:
--   docker exec -i apf_db psql -U postgres -d apflora -v ON_ERROR_STOP=1 \
--     < sql/postgrest/testCompileFilter.sql

BEGIN;

-- T0: empty filter compiles to true
DO $$
BEGIN
  IF apflora.compile_filter('apflora.tpop', 'tpop', '{}'::jsonb) <> 'true' THEN
    RAISE EXCEPTION 'T0 failed: empty filter must compile to true';
  END IF;
  RAISE NOTICE 'T0 ok';
END
$$;

-- T1: hierarchy filter {popByPopId: {apId: {equalTo: <uuid>}}}
DO $$
DECLARE
  v_ap_id uuid;
  v_rpc text[];
  v_sql text[];
BEGIN
  SELECT ap.id INTO v_ap_id
  FROM apflora.ap ap
  WHERE EXISTS (SELECT 1 FROM apflora.pop p JOIN apflora.tpop t ON t.pop_id = p.id WHERE p.ap_id = ap.id)
  LIMIT 1;

  SELECT array_agg(id::text ORDER BY id) INTO v_rpc
  FROM apflora.query_tpop(jsonb_build_object(
    'popByPopId', jsonb_build_object('apId', jsonb_build_object('equalTo', v_ap_id))
  ), null);

  SELECT array_agg(t.id::text ORDER BY t.id) INTO v_sql
  FROM apflora.tpop t
  WHERE EXISTS (
    SELECT 1 FROM apflora.pop p WHERE p.id = t.pop_id AND p.ap_id = v_ap_id
  );

  IF v_rpc IS DISTINCT FROM v_sql THEN
    RAISE EXCEPTION 'T1 failed: % rows via rpc, % via sql', coalesce(array_length(v_rpc, 1), 0), coalesce(array_length(v_sql, 1), 0);
  END IF;
  RAISE NOTICE 'T1 ok: % tpops', coalesce(array_length(v_rpc, 1), 0);
END
$$;

-- T2: OR-tabs with column + relation filters, like the DataFilter tabs
DO $$
DECLARE
  v_ap_id uuid;
  v_flur_part text;
  v_gemeinde text;
  v_filter jsonb;
  v_rpc text[];
  v_sql text[];
BEGIN
  SELECT p.ap_id INTO v_ap_id
  FROM apflora.pop p JOIN apflora.tpop t ON t.pop_id = p.id
  WHERE t.flurname IS NOT NULL
  LIMIT 1;
  SELECT split_part(t.flurname, ' ', 1) INTO v_flur_part
  FROM apflora.tpop t
  WHERE t.flurname IS NOT NULL
  LIMIT 1;
  SELECT t.gemeinde INTO v_gemeinde
  FROM apflora.tpop t
  WHERE t.gemeinde IS NOT NULL
  LIMIT 1;

  v_filter := jsonb_build_object('or', jsonb_build_array(
    jsonb_build_object(
      'popByPopId', jsonb_build_object('apId', jsonb_build_object('equalTo', v_ap_id)),
      'flurname', jsonb_build_object('includes', v_flur_part)
    ),
    jsonb_build_object('gemeinde', jsonb_build_object('equalTo', v_gemeinde))
  ));

  SELECT array_agg(id::text ORDER BY id) INTO v_rpc
  FROM apflora.query_tpop(v_filter, null);

  SELECT array_agg(t.id::text ORDER BY t.id) INTO v_sql
  FROM apflora.tpop t
  WHERE (
    (
      EXISTS (SELECT 1 FROM apflora.pop p WHERE p.id = t.pop_id AND p.ap_id = v_ap_id)
      AND t.flurname LIKE '%' || v_flur_part || '%'
    )
    OR t.gemeinde = v_gemeinde
  );

  IF v_rpc IS DISTINCT FROM v_sql THEN
    RAISE EXCEPTION 'T2 failed: % rows via rpc, % via sql', coalesce(array_length(v_rpc, 1), 0), coalesce(array_length(v_sql, 1), 0);
  END IF;
  RAISE NOTICE 'T2 ok: % tpops', coalesce(array_length(v_rpc, 1), 0);
END
$$;

-- T3: label filter (computed column) — apflora.tpop_label
DO $$
DECLARE
  v_label_part text;
  v_rpc text[];
  v_sql text[];
BEGIN
  SELECT substring(apflora.tpop_label(t) FROM 4 FOR 6) INTO v_label_part
  FROM apflora.tpop t
  WHERE length(apflora.tpop_label(t)) > 10
    AND substring(apflora.tpop_label(t) FROM 4 FOR 6) NOT LIKE '%\%%';
  IF v_label_part IS NULL OR v_label_part = '' THEN
    RAISE NOTICE 'T3 skipped: no usable label substring';
    RETURN;
  END IF;

  SELECT array_agg(id::text ORDER BY id) INTO v_rpc
  FROM apflora.query_tpop(
    jsonb_build_object('label', jsonb_build_object('includesInsensitive', v_label_part)),
    null
  );

  SELECT array_agg(t.id::text ORDER BY t.id) INTO v_sql
  FROM apflora.tpop t
  WHERE apflora.tpop_label(t) ILIKE '%' || v_label_part || '%';

  IF v_rpc IS DISTINCT FROM v_sql THEN
    RAISE EXCEPTION 'T3 failed: % rows via rpc, % via sql', coalesce(array_length(v_rpc, 1), 0), coalesce(array_length(v_sql, 1), 0);
  END IF;
  RAISE NOTICE 'T3 ok: label part "%", % tpops', v_label_part, coalesce(array_length(v_rpc, 1), 0);
END
$$;

-- T4: map polygon filter — geomPoint coveredBy (GeoJSON bbox around a real point)
DO $$
DECLARE
  v_cx double precision;
  v_cy double precision;
  v_geojson jsonb;
  v_rpc text[];
  v_sql text[];
BEGIN
  SELECT st_x(t.geom_point), st_y(t.geom_point) INTO v_cx, v_cy
  FROM apflora.tpop t
  WHERE t.geom_point IS NOT NULL
  LIMIT 1;

  v_geojson := jsonb_build_object(
    'type', 'Polygon',
    'coordinates', jsonb_build_array(jsonb_build_array(
      jsonb_build_array(v_cx - 0.05, v_cy - 0.05),
      jsonb_build_array(v_cx + 0.05, v_cy - 0.05),
      jsonb_build_array(v_cx + 0.05, v_cy + 0.05),
      jsonb_build_array(v_cx - 0.05, v_cy + 0.05),
      jsonb_build_array(v_cx - 0.05, v_cy - 0.05)
    ))
  );

  SELECT array_agg(id::text ORDER BY id) INTO v_rpc
  FROM apflora.query_tpop(
    jsonb_build_object('geomPoint', jsonb_build_object('coveredBy', v_geojson)),
    null
  );

  SELECT array_agg(t.id::text ORDER BY t.id) INTO v_sql
  FROM apflora.tpop t
  WHERE st_coveredby(t.geom_point, st_geomfromgeojson(v_geojson::text));

  IF v_rpc IS DISTINCT FROM v_sql THEN
    RAISE EXCEPTION 'T4 failed: % rows via rpc, % via sql', coalesce(array_length(v_rpc, 1), 0), coalesce(array_length(v_sql, 1), 0);
  END IF;
  RAISE NOTICE 'T4 ok: % tpops in bbox', coalesce(array_length(v_rpc, 1), 0);
END
$$;

-- T5: and + in + isNull + notEqualTo
DO $$
DECLARE
  v_ids uuid[];
  v_gemeinde text;
  v_rpc text[];
  v_sql text[];
BEGIN
  SELECT array_agg(id ORDER BY id) INTO v_ids
  FROM (SELECT id FROM apflora.tpop WHERE bemerkungen IS NOT NULL ORDER BY id LIMIT 200) s;
  SELECT gemeinde INTO v_gemeinde
  FROM apflora.tpop
  WHERE gemeinde IS NOT NULL
  LIMIT 1;

  SELECT array_agg(id::text ORDER BY id) INTO v_rpc
  FROM apflora.query_tpop(jsonb_build_object('and', jsonb_build_array(
    jsonb_build_object('id', jsonb_build_object('in', to_jsonb(v_ids))),
    jsonb_build_object('bemerkungen', jsonb_build_object('isNull', false)),
    jsonb_build_object('gemeinde', jsonb_build_object('notEqualTo', v_gemeinde))
  )), null);

  SELECT array_agg(id::text ORDER BY id) INTO v_sql
  FROM apflora.tpop
  WHERE id = ANY (v_ids)
    AND bemerkungen IS NOT NULL
    AND gemeinde <> v_gemeinde;

  IF v_rpc IS DISTINCT FROM v_sql THEN
    RAISE EXCEPTION 'T5 failed: % rows via rpc, % via sql', coalesce(array_length(v_rpc, 1), 0), coalesce(array_length(v_sql, 1), 0);
  END IF;
  RAISE NOTICE 'T5 ok: % tpops', coalesce(array_length(v_rpc, 1), 0);
END
$$;

-- T6: order by parent column (popByPopId.nr) with limit, replacing
-- POP_BY_POP_ID__NR_ASC; checks window multiset + non-decreasing order
DO $$
DECLARE
  v_order jsonb := '[{"field": "popByPopId.nr", "dir": "asc", "nulls": "last"}, {"field": "nr", "dir": "asc"}]'::jsonb;
  v_rpc text[];
  v_sql text[];
  v_violations int;
BEGIN
  SELECT array_agg(id::text ORDER BY id) INTO v_rpc
  FROM apflora.query_tpop(null, v_order, 100);

  SELECT array_agg(id::text ORDER BY id) INTO v_sql
  FROM (
    SELECT t.id
    FROM apflora.tpop t
    ORDER BY (SELECT p.nr FROM apflora.pop p WHERE p.id = t.pop_id) ASC NULLS LAST, t.nr ASC
    LIMIT 100
  ) s;

  IF v_rpc IS DISTINCT FROM v_sql THEN
    RAISE EXCEPTION 'T6 failed: window mismatch, % vs % rows', coalesce(array_length(v_rpc, 1), 0), coalesce(array_length(v_sql, 1), 0);
  END IF;

  SELECT count(*) INTO v_violations
  FROM (
    SELECT
      coalesce(pnr, 2147483647) AS key,
      lag(coalesce(pnr, 2147483647)) OVER () AS prev_key
    FROM (
      SELECT (SELECT p.nr FROM apflora.pop p WHERE p.id = t.pop_id) AS pnr
      FROM apflora.query_tpop(null, v_order, 100) t
    ) x
  ) y
  WHERE prev_key > key;

  IF v_violations > 0 THEN
    RAISE EXCEPTION 'T6 failed: % order violations', v_violations;
  END IF;
  RAISE NOTICE 'T6 ok: ordered window of % matches', coalesce(array_length(v_rpc, 1), 0);
END
$$;

-- T7: RLS applies through the RPC — as apflora_ap_reader only tpops of
-- assigned aps are visible. Uses the PostGraphile-style GUC the current
-- policies read; PostgREST's request.jwt.claims GUC is the phase 1 port
-- (ae3 diary).
DO $$
DECLARE
  v_user text;
  v_expected int;
  v_rpc_count int;
  v_full_count int;
BEGIN
  SELECT au.user_name INTO v_user
  FROM apflora.ap_user au
  WHERE EXISTS (
    SELECT 1
    FROM apflora.tpop t
    JOIN apflora.pop p ON p.id = t.pop_id
    WHERE p.ap_id = au.ap_id
  )
  LIMIT 1;

  SELECT count(*) INTO v_expected
  FROM apflora.tpop t
  WHERE t.pop_id IN (
    SELECT p.id FROM apflora.pop p
    WHERE p.ap_id IN (SELECT au.ap_id FROM apflora.ap_user au WHERE au.user_name = v_user)
  );

  SELECT count(*) INTO v_full_count FROM apflora.tpop;

  SET LOCAL ROLE apflora_ap_reader;
  PERFORM set_config('jwt.claims.username', v_user, true);
  SELECT count(*) INTO v_rpc_count FROM apflora.query_tpop(null, null);
  RESET ROLE;

  IF v_rpc_count <> v_expected THEN
    RAISE EXCEPTION 'T7 failed: % rows through rpc as ap_reader, expected % (full table: %)', v_rpc_count, v_expected, v_full_count;
  END IF;
  IF v_rpc_count >= v_full_count THEN
    RAISE EXCEPTION 'T7 failed: rpc returned the whole table (%), RLS not applied?', v_rpc_count;
  END IF;
  RAISE NOTICE 'T7 ok: % of % tpops visible for user % via ap_reader', v_rpc_count, v_full_count, v_user;
END
$$;

ROLLBACK;
