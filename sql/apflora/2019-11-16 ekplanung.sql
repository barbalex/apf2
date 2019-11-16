-- tpop of ap without ekfrequenz
select
  tax.artname,
  pop.nr,
  tpop.nr
from apflora.tpop tpop
  inner join apflora.pop pop
    inner join apflora.ap ap
      inner join apflora.ae_taxonomies tax
      on ap.art_id = tax.id
    on ap.id = pop.ap_id
  on pop.id = tpop.pop_id
where
  tpop.ekfrequenz is null
  and ap.bearbeitung < 4
  and tpop.status not in (101, 202)
  and tpop.apber_relevant = true
  and tax.taxid > 150
order by
  tax.artname,
  pop.nr,
  tpop.nr;
-- tpop of ap without ekplan
-- set missing ekfrequenz