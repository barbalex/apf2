DROP FUNCTION IF EXISTS apflora.jber_abc(jahr int);
CREATE OR REPLACE FUNCTION apflora.jber_abc(jahr int)
  RETURNS setof apflora.jber_abc AS
  $$
  with a_3_l_pop as (
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
  ), a_3_l_tpop as (
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
  ), a_4_l_pop as (
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
  ), a_4_l_tpop as (
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
  ), a_5_l_pop as (
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
  ), a_5_l_tpop as (
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
  ), a_7_l_pop as (
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
  ), a_7_l_tpop as (
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
  ), a_8_l_pop as (
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
  ), a_8_l_tpop as (
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
  ), a_9_l_pop as (
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
  ), a_9_l_tpop as (
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
  ), a_10_l_pop as (
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
  ), a_10_l_tpop as (
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
  ), b_1_l_pop as (
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
  ), b_1_l_tpop as (
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
  ), b_1_r_pop as (
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
  ), b_1_r_tpop as (
    select
      pop.ap_id,
      min(tpopber.jahr) as first_year,
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
  ), c_1_l_pop as (
    select
      pop.ap_id,
      count(distinct pop.id) as count
    from apflora.ap ap
      inner join apflora.pop pop
        inner join apflora.tpop tpop
          inner join apflora.tpopmassn massn
          on tpop.id = massn.tpop_id and massn.jahr = 2020
        on pop.id = tpop.pop_id
      on pop.ap_id = ap.id
    where
      pop.status < 300
      and pop.bekannt_seit <= 2020
      and tpop.status < 300
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= 2020
      and massn.typ is not null
    group by
      pop.ap_id
  ), c_1_l_tpop as (
    select
      pop.ap_id,
      count(distinct tpop.id) as count
    from apflora.ap ap
      inner join apflora.pop pop
        inner join apflora.tpop tpop
          inner join apflora.tpopmassn massn
          on tpop.id = massn.tpop_id and massn.jahr = 2020
        on pop.id = tpop.pop_id
      on pop.ap_id = ap.id
    where
      pop.status < 300
      and pop.bekannt_seit <= 2020
      and tpop.status < 300
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= 2020
      and massn.typ is not null
    group by
      pop.ap_id
  ), c_1_r_pop as (
    select
      pop.ap_id,
      count(distinct pop.id) as count
    from apflora.ap ap
      inner join apflora.pop pop
        inner join apflora.tpop tpop
          inner join apflora.tpopmassn massn
          on tpop.id = massn.tpop_id
        on pop.id = tpop.pop_id
      on pop.ap_id = ap.id
    where
      pop.status < 300
      and pop.bekannt_seit <= 2020
      and tpop.status < 300
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= 2020
      and massn.typ is not null
    group by
      pop.ap_id
  ), c_1_r_tpop as (
    select
      pop.ap_id,
      min(massn.jahr) as first_year,
      count(distinct tpop.id) as count
    from apflora.ap ap
      inner join apflora.pop pop
        inner join apflora.tpop tpop
          inner join apflora.tpopmassn massn
          on tpop.id = massn.tpop_id
        on pop.id = tpop.pop_id
      on pop.ap_id = ap.id
    where
      pop.status < 300
      and pop.bekannt_seit <= 2020
      and tpop.status < 300
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= 2020
      and massn.jahr is not null
      and massn.jahr <= 2020
      and massn.typ is not null
    group by
      pop.ap_id
  ), c_2_r_pop as (
    select
      pop.ap_id,
      count(distinct pop.id) as count
    from apflora.ap ap
      inner join apflora.pop pop
        inner join apflora.popmassnber massnber
        on pop.id = massnber.pop_id
        inner join apflora.tpop tpop
        on pop.id = tpop.pop_id
      on pop.ap_id = ap.id
    where
      pop.status < 300
      and pop.bekannt_seit <= 2020
      and tpop.status < 300
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= 2020
      and massnber.beurteilung between 1 and 5
    group by
      pop.ap_id
  ), c_2_r_tpop as (
    select
      pop.ap_id,
      count(distinct tpop.id) as count
    from apflora.ap ap
      inner join apflora.pop pop
        inner join apflora.tpop tpop
          inner join apflora.tpopmassnber massnber
          on tpop.id = massnber.tpop_id
        on pop.id = tpop.pop_id
      on pop.ap_id = ap.id
    where
      pop.status < 300
      and pop.bekannt_seit <= 2020
      and tpop.status < 300
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= 2020
      and massnber.jahr is not null
      and massnber.jahr <= 2020
      and massnber.beurteilung between 1 and 5
    group by
      pop.ap_id
  ), c3RPopLastBer as (
    select distinct on (pop.ap_id, pop.id)
      pop.ap_id,
      pop.id as pop_id,
      massnber.beurteilung
    from apflora.ap ap
      inner join apflora.pop pop
        inner join apflora.popmassnber massnber
        on pop.id = massnber.pop_id
        inner join apflora.tpop tpop
        on pop.id = tpop.pop_id
      on pop.ap_id = ap.id
    where
      pop.status < 300
      and pop.bekannt_seit <= 2020
      and tpop.status < 300
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= 2020
      and massnber.jahr is not null
      and massnber.jahr <= 2020
      and massnber.beurteilung between 1 and 5
    order by
      pop.ap_id,
      pop.id,
      massnber.jahr desc
  ), c3RTpopLastBer as (
    select distinct on (pop.ap_id, tpop.id)
      pop.ap_id,
      tpop.id as tpop_id,
      massnber.beurteilung
    from apflora.ap ap
      inner join apflora.pop pop
        inner join apflora.tpop tpop
          inner join apflora.tpopmassnber massnber
          on tpop.id = massnber.tpop_id
        on pop.id = tpop.pop_id
      on pop.ap_id = ap.id
    where
      pop.status < 300
      and pop.bekannt_seit <= 2020
      and tpop.status < 300
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= 2020
      and massnber.jahr is not null
      and massnber.jahr <= 2020
      and massnber.beurteilung between 1 and 5
    order by
      pop.ap_id,
      tpop.id,
      massnber.jahr desc
  ), c_3_r_pop as (
    select
      ap_id,
      count(pop_id)
    from c3RPopLastBer
    where beurteilung = 1
    group by ap_id
  ), c_3_r_tpop as (
    select
      ap_id,
      count(tpop_id)
    from c3RTpopLastBer
    where beurteilung = 1
    group by ap_id
  ), c_4_r_pop as (
    select
      ap_id,
      count(pop_id)
    from c3RPopLastBer
    where beurteilung = 2
    group by ap_id
  ), c_4_r_tpop as (
    select
      ap_id,
      count(tpop_id)
    from c3RTpopLastBer
    where beurteilung = 2
    group by ap_id
  ), c_5_r_pop as (
    select
      ap_id,
      count(pop_id)
    from c3RPopLastBer
    where beurteilung = 3
    group by ap_id
  ), c_5_r_tpop as (
    select
      ap_id,
      count(tpop_id)
    from c3RTpopLastBer
    where beurteilung = 3
    group by ap_id
  ), c_6_r_pop as (
    select
      ap_id,
      count(pop_id)
    from c3RPopLastBer
    where beurteilung = 4
    group by ap_id
  ), c_6_r_tpop as (
    select
      ap_id,
      count(tpop_id)
    from c3RTpopLastBer
    where beurteilung = 4
    group by ap_id
  ), c_7_r_pop as (
    select
      ap_id,
      count(pop_id)
    from c3RPopLastBer
    where beurteilung = 5
    group by ap_id
  ), c_7_r_tpop as (
    select
      ap_id,
      count(tpop_id)
    from c3RTpopLastBer
    where beurteilung = 5
    group by ap_id
  ), first_massn as (
    select distinct on (pop.ap_id)
      pop.ap_id,
      massn.jahr
    from apflora.ap ap
      inner join apflora.pop pop
        inner join apflora.tpop tpop
          inner join apflora.tpopmassn massn
          on tpop.id = massn.tpop_id
        on pop.id = tpop.pop_id
      on pop.ap_id = ap.id
    where
      pop.status < 300
      and pop.bekannt_seit <= 2020
      and tpop.status < 300
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= 2020
      and massn.jahr is not null
      and massn.jahr <= 2020
    order by
      pop.ap_id,
      massn.jahr asc
  )
  select
    tax.artname,
    -- need this to be id, not ap_id, for apollo:
    ap.id,
    ap.start_jahr::int,
    coalesce(a_3_l_pop.count, 0)::int as a_3_l_pop,
    coalesce(a_3_l_tpop.count, 0)::int as a_3_l_tpop,
    coalesce(a_4_l_pop.count, 0)::int as a_4_l_pop,
    coalesce(a_4_l_tpop.count, 0)::int as a_4_l_tpop,
    coalesce(a_5_l_pop.count, 0)::int as a_5_l_pop,
    coalesce(a_5_l_tpop.count, 0)::int as a_5_l_tpop,
    coalesce(a_7_l_pop.count, 0)::int as a_7_l_pop,
    coalesce(a_7_l_tpop.count, 0)::int as a_7_l_tpop,
    coalesce(a_8_l_pop.count, 0)::int as a_8_l_pop,
    coalesce(a_8_l_tpop.count, 0)::int as a_8_l_tpop,
    coalesce(a_9_l_pop.count, 0)::int as a_9_l_pop,
    coalesce(a_9_l_tpop.count, 0)::int as a_9_l_tpop,
    coalesce(a_10_l_pop.count, 0)::int as a_10_l_pop,
    coalesce(a_10_l_tpop.count, 0)::int as a_10_l_tpop,
    coalesce(b_1_l_pop.count, 0)::int as b_1_l_pop,
    coalesce(b_1_l_tpop.count, 0)::int as b_1_l_tpop,
    b_1_r_tpop.first_year::int as b_1_first_year,
    coalesce(b_1_r_pop.count, 0)::int as b_1_r_pop,
    coalesce(b_1_r_tpop.count, 0)::int as b_1_r_tpop,
    coalesce(c_1_l_pop.count, 0)::int as c_1_l_pop,
    coalesce(c_1_l_tpop.count, 0)::int as c_1_l_tpop,
    coalesce(c_1_r_pop.count, 0)::int as c_1_r_pop,
    coalesce(c_1_r_tpop.count, 0)::int as c_1_r_tpop,
    c_1_r_tpop.first_year::int as c_1_first_year,
    first_massn.jahr::int as first_massn,
    coalesce(c_2_r_pop.count, 0)::int as c_2_r_pop,
    coalesce(c_2_r_tpop.count, 0)::int as c_2_r_tpop,
    coalesce(c_3_r_pop.count, 0)::int as c_3_r_pop,
    coalesce(c_3_r_tpop.count, 0)::int as c_3_r_tpop,
    coalesce(c_4_r_pop.count, 0)::int as c_4_r_pop,
    coalesce(c_4_r_tpop.count, 0)::int as c_4_r_tpop,
    coalesce(c_5_r_pop.count, 0)::int as c_5_r_pop,
    coalesce(c_5_r_tpop.count, 0)::int as c_5_r_tpop,
    coalesce(c_6_r_pop.count, 0)::int as c_6_r_pop,
    coalesce(c_6_r_tpop.count, 0)::int as c_6_r_tpop,
    coalesce(c_7_r_pop.count, 0)::int as c_7_r_pop,
    coalesce(c_7_r_tpop.count, 0)::int as c_7_r_tpop
  from apflora.ap
    left join a_3_l_pop on
    a_3_l_pop.ap_id = ap.id
    left join a_3_l_tpop on
    a_3_l_tpop.ap_id = ap.id
    left join a_4_l_pop on
    a_4_l_pop.ap_id = ap.id
    left join a_4_l_tpop on
    a_4_l_tpop.ap_id = ap.id
    left join a_5_l_pop on
    a_5_l_pop.ap_id = ap.id
    left join a_5_l_tpop on
    a_5_l_tpop.ap_id = ap.id
    left join a_7_l_pop on
    a_7_l_pop.ap_id = ap.id
    left join a_7_l_tpop on
    a_7_l_tpop.ap_id = ap.id
    left join a_8_l_pop on
    a_8_l_pop.ap_id = ap.id
    left join a_8_l_tpop on
    a_8_l_tpop.ap_id = ap.id
    left join a_9_l_pop on
    a_9_l_pop.ap_id = ap.id
    left join a_9_l_tpop on
    a_9_l_tpop.ap_id = ap.id
    left join a_10_l_pop on
    a_10_l_pop.ap_id = ap.id
    left join a_10_l_tpop on
    a_10_l_tpop.ap_id = ap.id
    left join b_1_l_pop on
    b_1_l_pop.ap_id = ap.id
    left join b_1_l_tpop on
    b_1_l_tpop.ap_id = ap.id
    left join b_1_r_pop on
    b_1_r_pop.ap_id = ap.id
    left join b_1_r_tpop on
    b_1_r_tpop.ap_id = ap.id
    left join c_1_l_pop on
    c_1_l_pop.ap_id = ap.id
    left join c_1_l_tpop on
    c_1_l_tpop.ap_id = ap.id
    left join c_1_r_pop on
    c_1_r_pop.ap_id = ap.id
    left join c_1_r_tpop on
    c_1_r_tpop.ap_id = ap.id
    left join c_2_r_pop on
    c_2_r_pop.ap_id = ap.id
    left join c_2_r_tpop on
    c_2_r_tpop.ap_id = ap.id
    left join c_3_r_pop on
    c_3_r_pop.ap_id = ap.id
    left join c_3_r_tpop on
    c_3_r_tpop.ap_id = ap.id
    left join c_4_r_pop on
    c_4_r_pop.ap_id = ap.id
    left join c_4_r_tpop on
    c_4_r_tpop.ap_id = ap.id
    left join c_5_r_pop on
    c_5_r_pop.ap_id = ap.id
    left join c_5_r_tpop on
    c_5_r_tpop.ap_id = ap.id
    left join c_6_r_pop on
    c_6_r_pop.ap_id = ap.id
    left join c_6_r_tpop on
    c_6_r_tpop.ap_id = ap.id
    left join c_7_r_pop on
    c_7_r_pop.ap_id = ap.id
    left join c_7_r_tpop on
    c_7_r_tpop.ap_id = ap.id
    left join first_massn on
    first_massn.ap_id = ap.id
    inner join apflora.ae_taxonomies tax
    on tax.id = ap.art_id
  where
    ap.bearbeitung between 1 and 3
  order by
    tax.artname
  $$
  LANGUAGE sql STABLE;
ALTER FUNCTION apflora.jber_abc(jahr int)
  OWNER TO postgres;
