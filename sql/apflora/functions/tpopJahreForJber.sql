DROP FUNCTION IF EXISTS apflora.tpop_jahre(apid uuid);
CREATE OR REPLACE FUNCTION apflora.tpop_jahre(apid uuid)
  RETURNS setof apflora.tpop_jahre AS
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
ALTER FUNCTION apflora.tpop_jahre(apid uuid)
  OWNER TO postgres;
