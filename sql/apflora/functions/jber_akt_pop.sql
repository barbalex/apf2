DROP FUNCTION IF EXISTS apflora.jber_akt_pop(jahr int);
CREATE OR REPLACE FUNCTION apflora.jber_akt_pop(jahr int)
  RETURNS setof apflora.jber_akt_pop AS
  $$
  with pop_100 as (
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
  ), pop_200 as (
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
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
    group by
      pop.ap_id
  ), pop_total as (
    select
      pop.ap_id,
      count(distinct pop.id) as count
    from apflora.ap ap
      inner join apflora.pop pop
        inner join apflora.tpop tpop
        on pop.id = tpop.pop_id
      on pop.ap_id = ap.id
    where
      pop.status in (100, 200)
      and pop.bekannt_seit <= $1
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
    group by
      pop.ap_id
  ), pop_100_previous as (
    select
      pop.ap_id,
      count(distinct pop.id) as count
    from apflora.pop_history pop
      inner join apflora.tpop_history tpop
      on pop.id = tpop.pop_id
    where
      pop.year = $1 - 1
      and pop.status = 100
      and pop.bekannt_seit <= $1
      and tpop.year = $1 - 1
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
    group by
      pop.ap_id
  ), pop_200_previous as (
    select
      pop.ap_id,
      count(distinct pop.id) as count
    from apflora.pop_history pop
      inner join apflora.tpop_history tpop
      on pop.id = tpop.pop_id
    where
      pop.year = $1 - 1
      and pop.status = 200
      and pop.bekannt_seit <= $1
      and tpop.year = $1 - 1
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
    group by
      pop.ap_id
  ), pop_previous_total as (
    select
      pop.ap_id,
      count(distinct pop.id) as count
    from apflora.pop_history pop
      inner join apflora.tpop_history tpop
      on pop.id = tpop.pop_id
    where
      pop.year = $1 - 1
      and pop.status in (100, 200)
      and pop.bekannt_seit <= $1
      and tpop.year = $1 - 1
      and tpop.apber_relevant = true
      and tpop.bekannt_seit <= $1
    group by
      pop.ap_id
  )
  select
    tax.artname,
    -- need this to be id, not ap_id, for apollo:
    ap.id,
    coalesce(pop_100.count, 0)::int as pop_100,
    coalesce(pop_200.count, 0)::int as pop_200,
    coalesce(pop_total.count, 0)::int as pop_total,
    --coalesce(pop_100_previous.count, 0)::int as pop_100_previous,
    --coalesce(pop_200_previous.count, 0)::int as pop_200_previous,
    --coalesce(pop_previous_total.count, 0)::int as pop_previous_total,
    coalesce(pop_100.count, 0)::int - coalesce(pop_100_previous.count, 0)::int as pop_100_diff,
    coalesce(pop_200.count, 0)::int - coalesce(pop_200_previous.count, 0)::int as pop_200_diff,
    coalesce(pop_total.count, 0)::int - coalesce(pop_previous_total.count, 0)::int as pop_total_diff
  from apflora.ap
    left join pop_100 on
    pop_100.ap_id = ap.id
    left join pop_200 on
    pop_200.ap_id = ap.id
    left join pop_total on
    pop_total.ap_id = ap.id
    left join pop_previous_total on
    pop_previous_total.ap_id = ap.id
    left join pop_100_previous on
    pop_100_previous.ap_id = ap.id
    left join pop_200_previous on
    pop_200_previous.ap_id = ap.id
    inner join apflora.ae_taxonomies tax
    on tax.id = ap.art_id
  where
    ap.bearbeitung between 1 and 3
  order by
    tax.artname
  $$
  LANGUAGE sql STABLE;
ALTER FUNCTION apflora.jber_akt_pop(jahr int)
  OWNER TO postgres;
