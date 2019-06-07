DROP FUNCTION IF EXISTS apflora.q_tpop_counted_einheit_multiple_times_in_year(projid uuid, apid uuid, berichtjahr integer);
CREATE OR REPLACE FUNCTION apflora.q_tpop_counted_einheit_multiple_times_in_year(projid uuid, apid uuid, berichtjahr integer)
  RETURNS setof apflora.q_tpop_counted_einheit_multiple_times_in_year AS
  $$
  select 
    ap.proj_id as proj_id,
    ap.id as ap_id,
    pop.id as pop_id,
    pop.nr as pop_nr,
    tpop.id as id,
    tpop.nr as nr,
    einheiten.text as einheit,
    count(zaehl.id) as anzahl
  from apflora.tpopkontrzaehl zaehl
  inner join apflora.tpopkontr kontr on kontr.id = zaehl.tpopkontr_id
  inner join apflora.tpop tpop on tpop.id = kontr.tpop_id
  inner join apflora.pop pop on pop.id = tpop.pop_id
  inner join apflora.ap ap on ap.id = pop.ap_id
  inner join apflora.tpopkontrzaehl_einheit_werte einheiten ON zaehl.einheit = einheiten.code
  where
    kontr.apber_nicht_relevant is not true
  group by
    ap.proj_id,
    ap.id,
    pop.id,
    pop.nr,
    tpop.id,
    tpop.nr,
    kontr.jahr,
    einheiten.text
  having
    ap.proj_id = $1
    and ap.id = $2
    and kontr.jahr = $3
    and count(zaehl.id) > 1
  order by
    pop.nr,
    tpop.nr
  $$
  LANGUAGE sql STABLE;
ALTER FUNCTION apflora.q_tpop_counted_einheit_multiple_times_in_year(projid uuid, apid uuid, berichtjahr integer)
  OWNER TO postgres;
