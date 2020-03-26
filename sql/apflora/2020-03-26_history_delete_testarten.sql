with pop_to_delete as (
  select pop.id
  from
    apflora.pop_history pop
    inner join apflora.ap ap
      inner join apflora.ae_taxonomies tax
      on tax.id = ap.art_id
    on ap.id = pop.ap_id
  where
    tax.taxid < 200
)
delete from apflora.pop_history
where id in (select id from pop_to_delete);

with tpop_to_delete as (
  select tpop.id
  from
    apflora.tpop_history tpop
    inner join apflora.pop_history pop
      inner join apflora.ap ap
        inner join apflora.ae_taxonomies tax
        on tax.id = ap.art_id
      on ap.id = pop.ap_id
    on tpop.pop_id = pop.id
  where
    tax.taxid < 200
)
delete from apflora.tpop_history
where id in (select id from tpop_to_delete);

with tpop_to_delete as (
  select tpop.id
  from
    apflora.tpop_history tpop
  where
    tpop.pop_id not in (select id from apflora.pop_history)
)
delete from apflora.tpop_history
where id in (select id from tpop_to_delete);

with ap_to_delete as (
  select ap.id
  from
    apflora.ap_history ap
    inner join apflora.ae_taxonomies tax
    on tax.id = ap.art_id
  where
    tax.taxid < 200
)
delete from apflora.ap_history
where id in (select id from ap_to_delete);