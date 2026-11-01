-- One RPC delivering the three per-ap jber chart datasets for EVERY ap of a
-- projekt. Replaces the per-ap fan-out (5 requests x ~92 aps = ~460 requests)
-- that overwhelmed PostgREST's db pool on the "Jahresbericht aller Arten"
-- print (queue > pool timeout -> 504 -> tanstack retries -> spiral).
-- PostGraphile resolved these fields server-side inside a single request;
-- this restores that shape. Rows are tagged with ap_id; empty aps are
-- included with '[]' so client lookups never miss.
-- p_ap_ids optionally restricts to the report's aps (jber_abc's list) -
-- a projekt carries ~600 ap rows while a yearly report covers ~92.
BEGIN;

DROP FUNCTION IF EXISTS apflora.apber_charts_bulk(uuid, integer);
DROP FUNCTION IF EXISTS apflora.apber_charts_bulk(uuid, integer, uuid[]);
CREATE OR REPLACE FUNCTION apflora.apber_charts_bulk(
  p_projekt_id uuid,
  p_jahr integer,
  p_ap_ids uuid[] DEFAULT NULL
)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = apflora, public
AS $fn$
  WITH aps AS (
    SELECT a.id
    FROM apflora.ap a
    WHERE a.proj_id = p_projekt_id
      AND (p_ap_ids IS NULL OR a.id = ANY (p_ap_ids))
  )
  SELECT jsonb_build_object(
    'popStatus', (
      SELECT coalesce(jsonb_agg(jsonb_build_object(
        'apId', a.id,
        'year', r.year,
        'a3Lpop', r.a3lpop,
        'a4Lpop', r.a4lpop,
        'a5Lpop', r.a5lpop,
        'a7Lpop', r.a7lpop,
        'a8Lpop', r.a8lpop,
        'a9Lpop', r.a9lpop
      ) order by a.id, r.year), '[]'::jsonb)
      FROM aps a
      CROSS JOIN LATERAL apflora.pop_nach_status_for_jber(a.id, p_jahr) r
    ),
    'tpopKontrolliert', (
      SELECT coalesce(jsonb_agg(jsonb_build_object(
        'apId', a.id,
        'year', r.year,
        'anzTpop', r.anz_tpop,
        'anzTpopber', r.anz_tpopber
      ) order by a.id, r.year), '[]'::jsonb)
      FROM aps a
      CROSS JOIN LATERAL apflora.tpop_kontrolliert_for_jber(a.id) r
    ),
    'popMenge', (
      SELECT coalesce(jsonb_agg(jsonb_build_object(
        'apId', a.id,
        'jahr', r.jahr,
        'values', to_jsonb(r.values)
      ) order by a.id, r.jahr), '[]'::jsonb)
      FROM aps a
      CROSS JOIN LATERAL apflora.ap_ausw_pop_menge(a.id, p_jahr) r
    )
  )
$fn$;

revoke execute on function apflora.apber_charts_bulk(uuid, integer, uuid[]) from public;
grant execute on function apflora.apber_charts_bulk(uuid, integer, uuid[]) to
  apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

COMMIT;
