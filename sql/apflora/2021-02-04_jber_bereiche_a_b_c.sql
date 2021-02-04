-- this will be a function with berichtjahr = $1 = 2020
with a3LPop as (
  select
    pop.ap_id,
    count(distinct pop.id) as count
  from apflora.pop pop
    inner join apflora.tpop tpop
    on pop.id = tpop.pop_id
  where
    pop.status = 100
    and pop.bekannt_seit <= 2020
    and tpop.apber_relevant = true
    and tpop.bekannt_seit <= 2020
  group by
    pop.ap_id
), a3LTpop as (
  select
    pop.ap_id,
    count(distinct tpop.id) as count
  from apflora.pop pop
    inner join apflora.tpop tpop
    on pop.id = tpop.pop_id
  where
    pop.status < 300
    and pop.bekannt_seit <= 2020
    and tpop.status = 100
    and tpop.apber_relevant = true
    and tpop.bekannt_seit <= 2020
  group by
    pop.ap_id
), a4LPop as (
  select
    pop.ap_id,
    count(distinct pop.id) as count
  from apflora.ap ap
    inner join apflora.pop pop
      inner join apflora.tpop tpop
      on pop.id = tpop.pop_id
    on pop.ap_id = ap.id
  where
    pop.status = 200
    and pop.bekannt_seit <= 2020
    and pop.bekannt_seit < ap.start_jahr
    and tpop.apber_relevant = true
    and tpop.bekannt_seit <= 2020
    and tpop.bekannt_seit < ap.start_jahr
  group by
    pop.ap_id
)
select
  tax.artname,
  ap.id,
  a3LPop.count as a_3_l_pop,
  a3LTpop.count as a_3_l_tpop,
  a4LPop.count as a_4_l_pop
from apflora.ap
  inner join a3LPop on
  a3LPop.ap_id = ap.id
  inner join a3LTpop on
  a3LTpop.ap_id = ap.id
  inner join a4LPop on
  a4LPop.ap_id = ap.id
  inner join apflora.ae_taxonomies tax
  on tax.id = ap.art_id
where
  ap.bearbeitung between 1 and 3
order by
  tax.artname;