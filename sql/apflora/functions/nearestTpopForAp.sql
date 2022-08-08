DROP TYPE IF EXISTS apflora.nearest_tpop_for_ap_resp CASCADE;

CREATE TYPE apflora.nearest_tpop_for_ap_resp AS (
  id uuid,
  pop_id uuid
);

DROP FUNCTION IF EXISTS apflora.nearest_tpop_for_ap_function;

-- point example: 'SRID=4326;POINT(8.69036818701797 47.55424277257365)'
-- GraphQL name: nearestTpopForApFunction
CREATE OR REPLACE FUNCTION apflora.nearest_tpop_for_ap_function (ap_id uuid, point text)
  RETURNS SETOF apflora.tpop
  AS $$
  SELECT
    tpop.*
  FROM
    apflora.tpop tpop
    INNER JOIN apflora.pop ON pop.id = tpop.pop_id
  WHERE
    pop.ap_id = ap_id
  ORDER BY
    tpop.geom_point <-> point::geometry
  LIMIT 1
$$
LANGUAGE sql
STABLE;

ALTER FUNCTION apflora.nearest_tpop_for_ap_function (ap_id uuid, point text) OWNER TO postgres;

-- call it with:
-- SELECT
--   *
-- FROM
--   apflora.nearest_tpop_for_ap_function ('6c52d173-4f62-11e7-aebe-2bd3a2ea4576', 'SRID=4326;POINT(8.69036818701797 47.55424277257365)')
--> 76b716f8-4f62-11e7-aebe-4f638aa25b01
-- with 99999999-9999-9999-9999-999999999999: null in sql, 76b716f8-4f62-11e7-aebe-4f638aa25b01 in graphiQl!!!!
-- with 6c52d126-4f62-11e7-aebe-cbb8319e1712: ede0e882-38a0-11eb-aea7-dbff9ac7ac7b in sql, 76b716f8-4f62-11e7-aebe-4f638aa25b01 in graphiQl!!!
-- WTF: graphql is re-using previous values!!! need to use fetchPolicy: 'no-cache'
