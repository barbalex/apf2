drop function if exists apflora.pop_nach_status_for_jber(apid uuid);
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
  ), a10lpop as (
    select
      pop.year,
      count(distinct pop.id) as a10lpop
    from apflora.pop_history pop
      inner join apflora.tpop_history tpop
      on tpop.pop_id = pop.id and tpop.year = pop.year
    where
      pop.ap_id = $1
      and pop.year <= $2
      and pop.bekannt_seit <= pop.year
      and pop.status = 300
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
    a9lpop.a9lpop::int,
    a10lpop.a10lpop::int
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
    left join a10lpop
    on a10lpop.year = years.year
  where years.year <= $2
  order by years.year
  $$
  language sql stable;
alter function apflora.pop_nach_status_for_jber(apid uuid, year int)
  owner to postgres;
