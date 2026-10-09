DROP FUNCTION IF EXISTS apflora.tpop_kontrolliert_for_jber(apid uuid);
CREATE OR REPLACE FUNCTION apflora.tpop_kontrolliert_for_jber(apid uuid)
  RETURNS setof apflora.tpop_kontrolliert_for_jber AS
  $$
  SELECT distinct
    pop.year,
    -- exclude tpops with status 101 or 202 if they already had that same status
    -- in the previous year's history (i.e. unchanged for more than one year)
    count(CASE
      WHEN NOT (tpop.status IN (101, 202) AND prev_tpop.id IS NOT NULL)
      THEN tpop.id
    END) as anz_tpop,
    count(tpopber.id) as anz_tpopber
  FROM
    apflora.pop_history pop
    inner join apflora.tpop_history tpop
      left join apflora.tpopber tpopber
        on tpopber.tpop_id = tpop.id and tpopber.jahr = tpop.year
      left join apflora.tpop_history prev_tpop
        on prev_tpop.id = tpop.id
        and prev_tpop.year = tpop.year - 1
        and prev_tpop.status = tpop.status
        and tpop.status in (101, 202)
    on tpop.pop_id = pop.id and tpop.year = pop.year
  WHERE
    pop.ap_id = $1
    -- remove erloschen?
    -- see: https://github.com/barbalex/apf2/issues/796
    and pop.status < 300
    and pop.bekannt_seit <= pop.year
    and tpop.status < 300
    and tpop.bekannt_seit <= tpop.year
    and tpop.apber_relevant = true
  group BY pop.year
  order by pop.year
  $$
  LANGUAGE sql STABLE;
ALTER FUNCTION apflora.tpop_kontrolliert_for_jber(apid uuid)
  OWNER TO postgres;
