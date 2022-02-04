DROP TYPE IF EXISTS apflora.tpop_outside_zh_for_ap CASCADE;

CREATE TYPE apflora.tpop_outside_zh_for_ap AS (
  proj_id uuid,
  ap_id uuid,
  pop_id uuid,
  pop_nr integer,
  id uuid,
  nr integer
);

DROP FUNCTION IF EXISTS apflora.tpop_outside_zh_for_ap_function;

-- point example: 'SRID=4326;POINT(8.69036818701797 47.55424277257365)'
CREATE OR REPLACE FUNCTION apflora.tpop_outside_zh_for_ap_function (ap_id uuid, proj_id uuid)
  RETURNS SETOF apflora.tpop_outside_zh_for_ap
  AS $$
  WITH ktzh AS (
    SELECT
      geom
    FROM
      apflora.ch_administrative_unit
    WHERE
      id = 315
)
  SELECT
    proj.id AS proj_id,
    ap.id AS ap_id,
    pop.id AS pop_id,
    pop.nr AS pop_nr,
    tpop.id,
    tpop.nr
  FROM
    apflora.tpop tpop
    INNER JOIN apflora.pop pop ON pop.id = tpop.pop_id
    INNER JOIN apflora.ap ap ON ap.id = pop.ap_id
    INNER JOIN apflora.projekt proj ON proj.id = ap.proj_id,
    ktzh
  WHERE
    ap.id = $1
    AND proj.id = $2
    AND tpop.apber_relevant IS TRUE
    AND tpop.geom_point IS NOT NULL
    AND NOT ST_CoveredBy (tpop.geom_point, ktzh.geom)
  ORDER BY
    pop.nr,
    tpop.nr
$$
LANGUAGE sql
STABLE;

ALTER FUNCTION apflora.tpop_outside_zh_for_ap_function (ap_id uuid, proj_id uuid) OWNER TO postgres;

-- test it with:
WITH ktzh AS (
  SELECT
    geom
  FROM
    apflora.ch_administrative_unit
  WHERE
    id = 315
)
SELECT
  proj.id AS proj_id,
  ap.id AS ap_id,
  pop.id AS pop_id,
  pop.nr AS pop_nr,
  tpop.id,
  tpop.nr
FROM
  apflora.tpop tpop
  INNER JOIN apflora.pop pop ON pop.id = tpop.pop_id
  INNER JOIN apflora.ap ap ON ap.id = pop.ap_id
  INNER JOIN apflora.projekt proj ON proj.id = ap.proj_id,
  ktzh
WHERE
  ap.id = '6c52d174-4f62-11e7-aebe-67a303eb0640'
  AND proj.id = 'e57f56f4-4376-11e8-ab21-4314b6749d13'
  AND tpop.apber_relevant IS TRUE
  AND tpop.geom_point IS NOT NULL
  AND NOT ST_CoveredBy (tpop.geom_point, ktzh.geom)
ORDER BY
  pop.nr,
  tpop.nr
  -- test function:
  SELECT
    *
  FROM
    apflora.tpop_outside_zh_for_ap_function ('6c52d174-4f62-11e7-aebe-67a303eb0640', 'e57f56f4-4376-11e8-ab21-4314b6749d13')
