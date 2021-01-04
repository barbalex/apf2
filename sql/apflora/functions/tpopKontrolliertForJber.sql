DROP FUNCTION IF EXISTS apflora.tpop_kontrolliert(apid uuid);
CREATE OR REPLACE FUNCTION apflora.tpop_kontrolliert(apid uuid)
  RETURNS setof apflora.tpop_kontrolliert AS
  $$
  SELECT 
    tpopber.*
  FROM
    apflora.tpopber tpopber
    INNER JOIN apflora.tpop_history tpop
      inner join apflora.pop_history pop
      on tpop.pop_id = pop.id and tpop.year = pop.year
    ON tpopber.tpop_id = tpop.id and tpopber.jahr = tpop.year
  WHERE
    pop.ap_id = $1
    and pop.status < 300
    and tpop.apber_relevant = true
  ORDER BY tpopber.jahr
  $$
  LANGUAGE sql STABLE;
ALTER FUNCTION apflora.tpop_kontrolliert(apid uuid)
  OWNER TO postgres;
