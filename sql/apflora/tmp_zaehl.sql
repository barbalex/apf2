select
  apflora.tpopkontrzaehl.anzahl
from
  apflora.tpopkontrzaehl
  inner join apflora.tpopkontr
    inner join apflora.tpop
      inner join apflora.pop
        inner join apflora.ap
          inner join apflora.ekzaehleinheit
          on apflora.ap.id = apflora.ekzaehleinheit.ap_id and apflora.ekzaehleinheit.zielrelevant = true
        on apflora.ap.id = apflora.pop.ap_id
      on apflora.pop.id = apflora.tpop.pop_id
    on apflora.tpop.id = apflora.tpopkontr.tpop_id
  on apflora.tpopkontrzaehl.tpopkontr_id = apflora.tpopkontr.id
where
  apflora.tpopkontr.tpop_id = tpop.id
  and apflora.tpopkontr.jahr is not null
  and apflora.tpopkontrzaehl.einheit = (select code from apflora.tpopkontrzaehl_einheit_werte where id = apflora.ekzaehleinheit.zaehleinheit_id)
order by
  jahr desc,
  datum desc
limit 1