-- 1. update app side code
-- 2. update version
-- 3. run these queries:

drop type apflora.jber_abc cascade;
create type apflora.jber_abc as (
  artname text,
  id uuid,
  start_jahr integer,
  bearbeiter text,
  bearbeitung integer,
  a_3_l_pop integer,
  a_3_l_tpop integer,
  a_4_l_pop integer,
  a_4_l_tpop integer,
  a_5_l_pop integer,
  a_5_l_tpop integer,
  a_7_l_pop integer,
  a_7_l_tpop integer,
  a_8_l_pop integer,
  a_8_l_tpop integer,
  a_9_l_pop integer,
  a_9_l_tpop integer,
  b_1_l_pop integer,
  b_1_l_tpop integer,
  b_1_first_year integer,
  b_1_r_pop integer,
  b_1_r_tpop integer,
  c_1_l_pop integer,
  c_1_l_tpop integer,
  c_1_r_pop integer,
  c_1_r_tpop integer,
  c_1_first_year integer,
  first_massn integer,
  c_2_r_pop integer,
  c_2_r_tpop integer,
  c_3_r_pop integer,
  c_3_r_tpop integer,
  c_4_r_pop integer,
  c_4_r_tpop integer,
  c_5_r_pop integer,
  c_5_r_tpop integer,
  c_6_r_pop integer,
  c_6_r_tpop integer,
  c_7_r_pop integer,
  c_7_r_tpop integer,
  erfolg integer,
  erfolg_vorjahr integer
);

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
      and pop.bekannt_seit <= $1
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
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
      and pop.bekannt_seit <= $1
      and tpop.status = 100
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
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
      and pop.bekannt_seit <= $1
      and pop.bekannt_seit < ap.start_jahr
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
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
      and pop.bekannt_seit <= $1
      and tpop.status = 200
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
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
      and pop.bekannt_seit <= $1
      and pop.bekannt_seit >= ap.start_jahr
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
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
      and pop.bekannt_seit <= $1
      and tpop.status = 200
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
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
      and pop.bekannt_seit <= $1
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
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
      and pop.bekannt_seit <= $1
      and (
        tpop.status = 101
        or (
          tpop.status = 202
          and tpop.bekannt_seit < ap.start_jahr
        )
      )
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
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
      and pop.bekannt_seit <= $1
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
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
      and pop.bekannt_seit <= $1
      and tpop.status = 202
      and tpop.bekannt_seit >= ap.start_jahr
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
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
      and pop.bekannt_seit <= $1
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
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
      pop.bekannt_seit <= $1
      and tpop.status = 201
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
    group by
      pop.ap_id
  ), b_1_l_pop as (
    select
      pop.ap_id,
      count(distinct popber.id) as count
    from apflora.ap ap
      inner join apflora.pop pop
        inner join apflora.popber popber
        on pop.id = popber.pop_id and popber.jahr = $1
        inner join apflora.tpop tpop
        on pop.id = tpop.pop_id
      on pop.ap_id = ap.id
    where
      pop.status < 300
      and pop.bekannt_seit <= $1
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
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
          on tpop.id = tpopber.tpop_id and tpopber.jahr = $1
        on pop.id = tpop.pop_id
      on pop.ap_id = ap.id
    where
      pop.status < 300
      and pop.bekannt_seit <= $1
      and tpop.status < 300
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
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
      and pop.bekannt_seit <= $1
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
      and popber.jahr is not null
      and popber.jahr <= $1
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
      and pop.bekannt_seit <= $1
      and tpop.status < 300
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
      and tpopber.jahr is not null
      and tpopber.jahr <= $1
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
          on tpop.id = massn.tpop_id and massn.jahr = $1
        on pop.id = tpop.pop_id
      on pop.ap_id = ap.id
    where
      pop.status < 300
      and pop.bekannt_seit <= $1
      and tpop.status < 300
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
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
          on tpop.id = massn.tpop_id and massn.jahr = $1
        on pop.id = tpop.pop_id
      on pop.ap_id = ap.id
    where
      pop.status < 300
      and pop.bekannt_seit <= $1
      and tpop.status < 300
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
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
      and pop.bekannt_seit <= $1
      and tpop.status < 300
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
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
      and pop.bekannt_seit <= $1
      and tpop.status < 300
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
      and massn.jahr is not null
      and massn.jahr <= $1
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
      and pop.bekannt_seit <= $1
      and tpop.status < 300
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
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
      and pop.bekannt_seit <= $1
      and tpop.status < 300
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
      and massnber.jahr is not null
      and massnber.jahr <= $1
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
      and pop.bekannt_seit <= $1
      and tpop.status < 300
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
      and massnber.jahr is not null
      and massnber.jahr <= $1
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
      and pop.bekannt_seit <= $1
      and tpop.status < 300
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
      and massnber.jahr is not null
      and massnber.jahr <= $1
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
      and pop.bekannt_seit <= $1
      and tpop.status < 300
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
      and massn.jahr is not null
      and massn.jahr <= $1
    order by
      pop.ap_id,
      massn.jahr asc
  ), erfolg as (
    select distinct on (ap.id)
      ap.id,
      apber.beurteilung
    from apflora.ap ap
      inner join apflora.apber apber
      on ap.id = apber.ap_id
      inner join apflora.pop pop
        inner join apflora.tpop tpop
        on pop.id = tpop.pop_id
      on pop.ap_id = ap.id
    where
      pop.status < 300
      and pop.bekannt_seit <= $1
      and tpop.status < 300
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
      and apber.jahr = $1
      and apber.beurteilung is not null
    order by
      ap.id
  ), erfolg_vorjahr as (
    select distinct on (ap.id)
      ap.id,
      apber.beurteilung
    from apflora.ap ap
      inner join apflora.apber apber
      on ap.id = apber.ap_id
      inner join apflora.pop pop
        inner join apflora.tpop tpop
        on pop.id = tpop.pop_id
      on pop.ap_id = ap.id
    where
      pop.status < 300
      and pop.bekannt_seit <= $1
      and tpop.status < 300
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
      and apber.jahr = $1 - 1
      and apber.beurteilung is not null
    order by
      ap.id
  )
  select
    tax.artname,
    -- need this to be id, not ap_id, for apollo:
    ap.id,
    ap.start_jahr::int,
    adresse.name as bearbeiter,
    coalesce(ap.bearbeitung, 0)::int as bearbeitung,
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
    coalesce(c_7_r_tpop.count, 0)::int as c_7_r_tpop,
    erfolg.beurteilung::int as erfolg,
    erfolg_vorjahr.beurteilung::int as erfolg_vorjahr
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
    left join erfolg
    on erfolg.id = ap.id
    left join erfolg_vorjahr
    on erfolg_vorjahr.id = ap.id
    left join apflora.adresse adresse
    on ap.bearbeiter = adresse.id
  where
    ap.bearbeitung between 1 and 3
  order by
    tax.artname
  $$
  LANGUAGE sql STABLE;
ALTER FUNCTION apflora.jber_abc(jahr int)
  OWNER TO postgres;

drop type apflora.pop_nach_status_for_jber cascade;
create type apflora.pop_nach_status_for_jber as (
  year integer,
  a3lpop integer,
  a4lpop integer,
  a5lpop integer,
  a7lpop integer,
  a8lpop integer,
  a9lpop integer
);

drop function if exists apflora.pop_nach_status_for_jber(apid uuid, year int);
create or replace function apflora.pop_nach_status_for_jber(apid uuid, year int)
  returns setof apflora.pop_nach_status_for_jber as
  $$
  with years as (
    select distinct pop.year
    from apflora.pop_history pop
      inner join apflora.tpop_history tpop
      on tpop.pop_id = pop.id and tpop.year = pop.year
    where
      pop.ap_id = $1
      and pop.year <= $2
      and pop.bekannt_seit <= pop.year
      and tpop.year <= $2
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= tpop.year
    order by pop.year
  ), a3lpop as (
    select
      pop.year,
      count(distinct pop.id) as a3lpop
    from apflora.pop_history pop
      inner join apflora.tpop_history tpop
      on tpop.pop_id = pop.id and tpop.year = pop.year
    where
      pop.ap_id = $1
      and pop.year <= $2
      and pop.bekannt_seit <= pop.year
      and pop.status = 100
      and tpop.year <= $2
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= tpop.year
    group by pop.year
  ), a4lpop as (
    select
      pop.year,
      count(distinct pop.id) as a4lpop
    from apflora.pop_history pop
      inner join apflora.tpop_history tpop
      on tpop.pop_id = pop.id and tpop.year = pop.year
      inner join apflora.ap_history ap
      on ap.id = pop.ap_id and ap.year = pop.year
    where
      pop.ap_id = $1
      and pop.year <= $2
      and pop.bekannt_seit <= pop.year
      and pop.status = 200
      and ap.start_jahr is not null
      and pop.bekannt_seit < ap.start_jahr
      and tpop.year <= $2
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= tpop.year
    group by pop.year
  ), a5lpop as (
    select
      pop.year,
      count(distinct pop.id) as a5lpop
    from apflora.pop_history pop
      inner join apflora.tpop_history tpop
      on tpop.pop_id = pop.id and tpop.year = pop.year
      inner join apflora.ap_history ap
      on ap.id = pop.ap_id and ap.year = pop.year
    where
      pop.ap_id = $1
      and pop.year <= $2
      and pop.bekannt_seit <= pop.year
      and pop.status = 200
      and ap.start_jahr is not null
      and pop.bekannt_seit >= ap.start_jahr
      and tpop.year <= $2
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= tpop.year
    group by pop.year
  ), a7lpop as (
    select
      pop.year,
      count(distinct pop.id) as a7lpop
    from apflora.pop_history pop
      inner join apflora.tpop_history tpop
      on tpop.pop_id = pop.id and tpop.year = pop.year
      inner join apflora.ap_history ap
      on ap.id = pop.ap_id and ap.year = pop.year
    where
      pop.ap_id = $1
      and pop.year <= $2
      and pop.bekannt_seit <= pop.year
      and tpop.year <= $2
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= tpop.year
      and (
        pop.status = 101
        or (
          pop.status = 202
          and ap.start_jahr is not null
          and (
            pop.bekannt_seit is null
            or pop.bekannt_seit < ap.start_jahr
          )
        )
      )
    group by pop.year
  ), a8lpop as (
    select
      pop.year,
      count(distinct pop.id) as a8lpop
    from apflora.pop_history pop
      inner join apflora.tpop_history tpop
      on tpop.pop_id = pop.id and tpop.year = pop.year
      inner join apflora.ap_history ap
      on ap.id = pop.ap_id and ap.year = pop.year
    where
      pop.ap_id = $1
      and pop.year <= $2
      and pop.bekannt_seit <= pop.year
      and pop.status = 202
      and ap.start_jahr is not null
      and pop.bekannt_seit >= ap.start_jahr
      and tpop.year <= $2
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= tpop.year
    group by pop.year
  ), a9lpop as (
    select
      pop.year,
      count(distinct pop.id) as a9lpop
    from apflora.pop_history pop
      inner join apflora.tpop_history tpop
      on tpop.pop_id = pop.id and tpop.year = pop.year
    where
      pop.ap_id = $1
      and pop.year <= $2
      and pop.bekannt_seit <= pop.year
      and pop.status = 201
      and tpop.year <= $2
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= tpop.year
    group by pop.year
  )
  select
    years.year::int,
    a3lpop.a3lpop::int,
    a4lpop.a4lpop::int,
    a5lpop.a5lpop::int,
    a7lpop.a7lpop::int,
    a8lpop.a8lpop::int,
    a9lpop.a9lpop::int
  from
    years
    left join a3lpop
    on a3lpop.year = years.year
    left join a4lpop
    on a4lpop.year = years.year
    left join a5lpop
    on a5lpop.year = years.year
    left join a7lpop
    on a7lpop.year = years.year
    left join a8lpop
    on a8lpop.year = years.year
    left join a9lpop
    on a9lpop.year = years.year
  where years.year <= $2
  order by years.year
  $$
  language sql stable;
alter function apflora.pop_nach_status_for_jber(apid uuid, year int)
  owner to postgres;
