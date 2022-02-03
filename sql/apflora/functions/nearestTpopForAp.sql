DROP TYPE IF EXISTS apflora.nearest_tpop_for_ap_resp CASCADE;

CREATE TYPE apflora.nearest_tpop_for_ap_resp AS (
  id uuid,
  pop_id uuid
);

DROP FUNCTION IF EXISTS apflora.nearest_tpop_for_ap_function;

-- point example: 'SRID=4326;POINT(8.69036818701797 47.55424277257365)'
CREATE OR REPLACE FUNCTION apflora.nearest_tpop_for_ap_function (ap_id uuid, point text)
  RETURNS SETOF apflora.nearest_tpop_for_ap_resp
  AS $$
  WITH nearest AS (
    SELECT
      tpop.id,
      tpop.pop_id,
      tpop.geom_point <-> point::geometry AS dist
    FROM
      apflora.tpop tpop
      INNER JOIN apflora.pop ON pop.id = tpop.pop_id
    WHERE
      pop.ap_id = ap_id
    ORDER BY
      dist
    LIMIT 1)
  -- only pass the necessary fields over the wire
  SELECT
    id,
    pop_id
  FROM
    nearest
$$
LANGUAGE sql
STABLE;

ALTER FUNCTION apflora.nearest_tpop_for_ap_function (ap_id uuid, point text) OWNER TO postgres;

-- call it with:
-- SELECT
--   *
-- FROM
--   apflora.nearest_tpop_for_ap_function ('6c52d173-4f62-11e7-aebe-2bd3a2ea4576', 'SRID=4326;POINT(8.69036818701797 47.55424277257365)')
