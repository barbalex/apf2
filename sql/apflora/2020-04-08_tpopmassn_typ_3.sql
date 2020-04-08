select
  apflora.ae_taxonomies.artname,
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.pop.name as pop_name,
  apflora.tpop.nr,
  apflora.tpop.flurname,
  apflora.tpopmassn.jahr
from
  apflora.ae_taxonomies
  inner join apflora.ap
    inner join apflora.pop
      inner join apflora.tpop
        inner join apflora.tpopmassn
        on apflora.tpopmassn.tpop_id = apflora.tpop.id
      on apflora.pop.id = apflora.tpop.pop_id
    on apflora.ap.id = apflora.pop.ap_id
  on apflora.ae_taxonomies.id = apflora.ap.art_id
where
  apflora.tpopmassn.typ = 3
  and apflora.ae_taxonomies.taxid > 150
order by
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr,
  apflora.tpopmassn.jahr;