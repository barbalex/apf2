DROP FUNCTION IF EXISTS apflora.tpop_histories(apid uuid);
CREATE OR REPLACE FUNCTION apflora.tpop_histories(apid uuid)
  RETURNS setof apflora.tpop_histories AS
  $$
  SELECT
    *
  FROM
    apflora.tpop_history tpop
    INNER JOIN
      apflora.pop_history pop
      ON tpop.pop_id = pop.id
  WHERE
    pop.ap_id = $1
    ORDER BY apflora.pop.nr
  $$
  LANGUAGE sql STABLE;
ALTER FUNCTION apflora.tpop_histories(apid uuid)
  OWNER TO postgres;
