DROP VIEW IF EXISTS apflora.v_ap_ausw_pop_zielrelev_einheit CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_ausw_pop_zielrelev_einheit AS
with pop_data as (
  select
    ap.id as ap_id,
    ew.text as zaehleinheit,
    pop.year,
    pop.id as pop_id,
    count(tpop.id) as anzahl
    from
      apflora.pop_history pop
      inner join apflora.ap_history ap
        inner join apflora.ekzaehleinheit ekze
          inner join apflora.tpopkontrzaehl_einheit_werte ew
          on ekze.zaehleinheit_id = ew.id
        on ap.id = ekze.ap_id and ekze.zielrelevant = true
      on ap.id = pop.ap_id
      inner join apflora.tpop_history tpop
      on pop.id = tpop.pop_id
    where 
      pop.status in (100, 200, 201)
      and tpop.status in (100, 200, 201)
      and tpop.apber_relevant = true
    group by
      ap.id,
      ew.text,
      pop.year,
      pop.id
    order by
      ap.id,
      pop.year
)
select
  ap_id,
  zaehleinheit,
  year as jahr,
  json_object_agg(pop_id, anzahl) as values
from pop_data
group by ap_id, zaehleinheit, year
order by ap_id, year;