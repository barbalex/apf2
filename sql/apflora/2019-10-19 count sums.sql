select tpop.nr, tpop.flurname, einheit.text, sum(tpopkontrzaehl.anzahl)
from apflora.ap ap
  inner join apflora.ae_taxonomien tax
  on tax.id = ap.art_id
  inner join apflora.pop pop
    inner join apflora.tpop tpop
      inner join apflora.tpopkontr
        inner join apflora.tpopkontrzaehl
          inner join apflora.tpopkontrzaehl_einheit_werte einheit
          on einheit.code = tpopkontrzaehl.einheit
        on tpopkontrzaehl.tpopkontr_id = tpopkontr.id
      on tpopkontr.tpop_id = tpop.id
    on tpop.pop_id = pop.id
  on pop.ap_id = ap.id
group by
  tpop.id,
  einheit.text
order by tpop.id;