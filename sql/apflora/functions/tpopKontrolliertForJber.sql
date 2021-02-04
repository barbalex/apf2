DROP FUNCTION IF EXISTS apflora.tpop_kontrolliert_for_jber(apid uuid);
CREATE OR REPLACE FUNCTION apflora.tpop_kontrolliert_for_jber(apid uuid)
  RETURNS setof apflora.tpop_kontrolliert_for_jber AS
  $$
  SELECT distinct
    pop.year,
    count(tpop.id) as anz_tpop,
    count(tpopber.id) as anz_tpopber
  FROM
    apflora.pop_history pop
    inner join apflora.tpop_history tpop
      left join apflora.tpopber tpopber
      on tpopber.tpop_id = tpop.id and tpopber.jahr = tpop.year
    on tpop.pop_id = pop.id and tpop.year = pop.year
  WHERE
    pop.ap_id = $1
    and pop.status < 300
    and (
      pop.bekannt_seit <= pop.year
      or pop.bekannt_seit is null
    )
    and tpop.status < 300
    and (
      tpop.bekannt_seit <= tpop.year
      or tpop.bekannt_seit is null
    )
    and tpop.apber_relevant = true
  group BY pop.year
  order by pop.year
  $$
  LANGUAGE sql STABLE;
ALTER FUNCTION apflora.tpop_kontrolliert_for_jber(apid uuid)
  OWNER TO postgres;
