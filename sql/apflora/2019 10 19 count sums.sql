select tpop.nr, tpop.flurname, einheit.text, sum(tpopkontrzaehl.anzahl)
from apflora.tpop tpop
inner join apflora.tpopkontr
  inner join apflora.tpopkontrzaehl
    inner join apflora.tpopkontrzaehl_einheit_werte einheit
    on einheit.code = tpopkontrzaehl.einheit
  on tpopkontrzaehl.tpopkontr_id = tpopkontr.id
on tpopkontr.tpop_id = tpop.id
group by
  tpop.id,
  einheit.text
order by tpop.id;