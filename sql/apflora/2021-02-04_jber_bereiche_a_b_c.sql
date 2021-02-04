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
), a4LTPop as (
  select
    pop.ap_id,
    count(distinct tpop.id) as count
  from apflora.ap ap
    inner join apflora.pop pop
      inner join apflora.tpop tpop
      on pop.id = tpop.pop_id
    on pop.ap_id = ap.id
  where
    pop.status < 300
    and pop.bekannt_seit <= 2020
    and tpop.status = 200
    and tpop.apber_relevant = true
    and tpop.bekannt_seit <= 2020
    and tpop.bekannt_seit < ap.start_jahr
  group by
    pop.ap_id
), a5LPop as (
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
    and pop.bekannt_seit >= ap.start_jahr
    and tpop.apber_relevant = true
    and tpop.bekannt_seit <= 2020
    and tpop.bekannt_seit >= ap.start_jahr
  group by
    pop.ap_id
), a5LTpop as (
  select
    pop.ap_id,
    count(distinct tpop.id) as count
  from apflora.ap ap
    inner join apflora.pop pop
      inner join apflora.tpop tpop
      on pop.id = tpop.pop_id
    on pop.ap_id = ap.id
  where
    pop.status < 300
    and pop.bekannt_seit <= 2020
    and tpop.status = 200
    and tpop.apber_relevant = true
    and tpop.bekannt_seit <= 2020
    and tpop.bekannt_seit >= ap.start_jahr
  group by
    pop.ap_id
), a7LPop as (
  select
    pop.ap_id,
    count(distinct pop.id) as count
  from apflora.ap ap
    inner join apflora.pop pop
      inner join apflora.tpop tpop
      on pop.id = tpop.pop_id
    on pop.ap_id = ap.id
  where
    (
      pop.status = 101
      or (
        pop.status = 202
        and pop.bekannt_seit < ap.start_jahr
      )
    )
    and pop.bekannt_seit <= 2020
    and tpop.apber_relevant = true
    and tpop.bekannt_seit <= 2020
  group by
    pop.ap_id
), a7LTpop as (
  select
    pop.ap_id,
    count(distinct tpop.id) as count
  from apflora.ap ap
    inner join apflora.pop pop
      inner join apflora.tpop tpop
      on pop.id = tpop.pop_id
    on pop.ap_id = ap.id
  where
    pop.status < 300
    and pop.bekannt_seit <= 2020
    and (
      tpop.status = 101
      or (
        tpop.status = 202
        and tpop.bekannt_seit < ap.start_jahr
      )
    )
    and tpop.apber_relevant = true
    and tpop.bekannt_seit <= 2020
  group by
    pop.ap_id
), a8LPop as (
  select
    pop.ap_id,
    count(distinct pop.id) as count
  from apflora.ap ap
    inner join apflora.pop pop
      inner join apflora.tpop tpop
      on pop.id = tpop.pop_id
    on pop.ap_id = ap.id
  where
    pop.status = 202
    and pop.bekannt_seit >= ap.start_jahr
    and pop.bekannt_seit <= 2020
    and tpop.apber_relevant = true
    and tpop.bekannt_seit <= 2020
  group by
    pop.ap_id
), a8LTpop as (
  select
    pop.ap_id,
    count(distinct tpop.id) as count
  from apflora.ap ap
    inner join apflora.pop pop
      inner join apflora.tpop tpop
      on pop.id = tpop.pop_id
    on pop.ap_id = ap.id
  where
    pop.status < 300
    and pop.bekannt_seit <= 2020
    and tpop.status = 202
    and tpop.bekannt_seit >= ap.start_jahr
    and tpop.apber_relevant = true
    and tpop.bekannt_seit <= 2020
  group by
    pop.ap_id
), a9LPop as (
  select
    pop.ap_id,
    count(distinct pop.id) as count
  from apflora.ap ap
    inner join apflora.pop pop
      inner join apflora.tpop tpop
      on pop.id = tpop.pop_id
    on pop.ap_id = ap.id
  where
    pop.status = 201
    and pop.bekannt_seit <= 2020
    and tpop.apber_relevant = true
    and tpop.bekannt_seit <= 2020
  group by
    pop.ap_id
), a9LTpop as (
  select
    pop.ap_id,
    count(distinct tpop.id) as count
  from apflora.ap ap
    inner join apflora.pop pop
      inner join apflora.tpop tpop
      on pop.id = tpop.pop_id
    on pop.ap_id = ap.id
  where
    pop.bekannt_seit <= 2020
    and tpop.status = 201
    and tpop.apber_relevant = true
    and tpop.bekannt_seit <= 2020
  group by
    pop.ap_id
), a10LPop as (
  select
    pop.ap_id,
    count(distinct pop.id) as count
  from apflora.ap ap
    inner join apflora.pop pop
      inner join apflora.tpop tpop
      on pop.id = tpop.pop_id
    on pop.ap_id = ap.id
  where
    pop.status = 300
    and pop.bekannt_seit <= 2020
    --and tpop.status = 300
    --and tpop.apber_relevant = true
    --and tpop.bekannt_seit <= 2020
  group by
    pop.ap_id
), a10LTpop as (
  select
    pop.ap_id,
    count(distinct tpop.id) as count
  from apflora.ap ap
    inner join apflora.pop pop
      inner join apflora.tpop tpop
      on pop.id = tpop.pop_id
    on pop.ap_id = ap.id
  where
    --pop.bekannt_seit <= 2020
    tpop.status = 300
    and tpop.apber_relevant = true
    and tpop.bekannt_seit <= 2020
  group by
    pop.ap_id
), b1LPop as (
  select
    pop.ap_id,
    count(distinct popber.id) as count
  from apflora.ap ap
    inner join apflora.pop pop
      inner join apflora.popber popber
      on pop.id = popber.pop_id and popber.jahr = 2020
      inner join apflora.tpop tpop
      on pop.id = tpop.pop_id
    on pop.ap_id = ap.id
  where
    pop.status < 300
    and pop.bekannt_seit <= 2020
    and tpop.apber_relevant = true
    and tpop.bekannt_seit <= 2020
  group by
    pop.ap_id
), b1LTpop as (
  select
    pop.ap_id,
    count(distinct tpopber.id) as count
  from apflora.ap ap
    inner join apflora.pop pop
      inner join apflora.tpop tpop
        inner join apflora.tpopber tpopber
        on tpop.id = tpopber.tpop_id and tpopber.jahr = 2020
      on pop.id = tpop.pop_id
    on pop.ap_id = ap.id
  where
    pop.status < 300
    and pop.bekannt_seit <= 2020
    and tpop.status < 300
    and tpop.apber_relevant = true
    and tpop.bekannt_seit <= 2020
  group by
    pop.ap_id
), b1LFirstYear as (
  select
    pop.ap_id,
    min(tpopber.jahr) as jahr
  from apflora.ap ap
    inner join apflora.pop pop
      inner join apflora.tpop tpop
        inner join apflora.tpopber tpopber
        on tpop.id = tpopber.tpop_id
      on pop.id = tpop.pop_id
    on pop.ap_id = ap.id
  where
    pop.status < 300
    and pop.bekannt_seit <= 2020
    and tpop.status < 300
    and tpop.apber_relevant = true
    and tpop.bekannt_seit <= 2020
  group by
    pop.ap_id
), b1RPop as (
  select
    pop.ap_id,
    count(distinct pop.id) as count
  from apflora.ap ap
    inner join apflora.pop pop
      inner join apflora.popber popber
      on pop.id = popber.pop_id
      inner join apflora.tpop tpop
      on pop.id = tpop.pop_id
    on pop.ap_id = ap.id
  where
    pop.status < 300
    and pop.bekannt_seit <= 2020
    and tpop.apber_relevant = true
    and tpop.bekannt_seit <= 2020
    and popber.jahr is not null
    and popber.jahr <= 2020
    and popber.entwicklung is not null
  group by
    pop.ap_id
), b1RTpop as (
  select
    pop.ap_id,
    count(distinct tpop.id) as count
  from apflora.ap ap
    inner join apflora.pop pop
      inner join apflora.tpop tpop
        inner join apflora.tpopber tpopber
        on tpop.id = tpopber.tpop_id
      on pop.id = tpop.pop_id
    on pop.ap_id = ap.id
  where
    pop.status < 300
    and pop.bekannt_seit <= 2020
    and tpop.status < 300
    and tpop.apber_relevant = true
    and tpop.bekannt_seit <= 2020
    and tpopber.jahr is not null
    and tpopber.jahr <= 2020
    and tpopber.entwicklung is not null
  group by
    pop.ap_id
)
select
  tax.artname,
  ap.id,
  coalesce(a3LPop.count, 0) as a_3_l_pop,
  coalesce(a3LTpop.count, 0) as a_3_l_tpop,
  coalesce(a4LPop.count, 0) as a_4_l_pop,
  coalesce(a4LTpop.count, 0) as a_4_l_tpop,
  coalesce(a5LPop.count, 0) as a_5_l_pop,
  coalesce(a5LTpop.count, 0) as a_5_l_tpop,
  coalesce(a7LPop.count, 0) as a_7_l_pop,
  coalesce(a7LTpop.count, 0) as a_7_l_tpop,
  coalesce(a8LPop.count, 0) as a_8_l_pop,
  coalesce(a8LTpop.count, 0) as a_8_l_tpop,
  coalesce(a9LPop.count, 0) as a_9_l_pop,
  coalesce(a9LTpop.count, 0) as a_9_l_tpop,
  coalesce(a10LPop.count, 0) as a_10_l_pop,
  coalesce(a10LTpop.count, 0) as a_10_l_tpop,
  coalesce(b1LPop.count, 0) as b_1_l_pop,
  coalesce(b1LTpop.count, 0) as b_1_l_tpop,
  coalesce(b1LFirstYear.jahr, 0) as b_1_first_year,
  coalesce(b1RPop.count, 0) as b_1_r_pop,
  coalesce(b1RTpop.count, 0) as b_1_r_tpop
from apflora.ap
  left join a3LPop on
  a3LPop.ap_id = ap.id
  left join a3LTpop on
  a3LTpop.ap_id = ap.id
  left join a4LPop on
  a4LPop.ap_id = ap.id
  left join a4LTpop on
  a4LTpop.ap_id = ap.id
  left join a5LPop on
  a5LPop.ap_id = ap.id
  left join a5LTpop on
  a5LTpop.ap_id = ap.id
  left join a7LPop on
  a7LPop.ap_id = ap.id
  left join a7LTpop on
  a7LTpop.ap_id = ap.id
  left join a8LPop on
  a8LPop.ap_id = ap.id
  left join a8LTpop on
  a8LTpop.ap_id = ap.id
  left join a9LPop on
  a9LPop.ap_id = ap.id
  left join a9LTpop on
  a9LTpop.ap_id = ap.id
  left join a10LPop on
  a10LPop.ap_id = ap.id
  left join a10LTpop on
  a10LTpop.ap_id = ap.id
  left join b1LPop on
  b1LPop.ap_id = ap.id
  left join b1LTpop on
  b1LTpop.ap_id = ap.id
  left join b1LFirstYear on
  b1LFirstYear.ap_id = ap.id
  left join b1RPop on
  b1RPop.ap_id = ap.id
  left join b1RTpop on
  b1RTpop.ap_id = ap.id
  inner join apflora.ae_taxonomies tax
  on tax.id = ap.art_id
where
  ap.bearbeitung between 1 and 3
order by
  tax.artname;