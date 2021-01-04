DROP FUNCTION IF EXISTS apflora.pop_nach_status_for_jber(apid uuid);
CREATE OR REPLACE FUNCTION apflora.pop_nach_status_for_jber(apid uuid)
  RETURNS setof apflora.pop_nach_status_for_jber AS
  $$
  with years as (
    select distinct pop.year
    from apflora.pop_history pop
      inner join apflora.tpop_history tpop
      on tpop.pop_id = pop.id and tpop.year = pop.year
    WHERE
      pop.ap_id = $1
      and tpop.apber_relevant = true
    order by pop.year
  ), a3lpop as (
    select
      pop.year,
      count(distinct pop.id) as a3lpop
    from apflora.pop_history pop
      inner join apflora.tpop_history tpop
      on tpop.pop_id = pop.id and tpop.year = pop.year
    WHERE
      pop.ap_id = $1
      and pop.status = 100
      and tpop.apber_relevant = true
    group by pop.year
  ), a4LPop as (
    select
      pop.year,
      count(distinct pop.id) as a4LPop
    from apflora.pop_history pop
      inner join apflora.tpop_history tpop
      on tpop.pop_id = pop.id and tpop.year = pop.year
      inner join apflora.ap_history ap
      on ap.id = pop.ap_id and ap.year = pop.year
    WHERE
      pop.ap_id = $1
      and pop.status = 200
      and ap.start_jahr is not null
      and pop.bekannt_seit < ap.start_jahr
      and tpop.apber_relevant = true
    group by pop.year
  ), a5LPop as (
    select
      pop.year,
      count(distinct pop.id) as a5LPop
    from apflora.pop_history pop
      inner join apflora.tpop_history tpop
      on tpop.pop_id = pop.id and tpop.year = pop.year
      inner join apflora.ap_history ap
      on ap.id = pop.ap_id and ap.year = pop.year
    WHERE
      pop.ap_id = $1
      and pop.status = 200
      and ap.start_jahr is not null
      and pop.bekannt_seit >= ap.start_jahr
      and tpop.apber_relevant = true
    group by pop.year
  )
  SELECT
    years.year,
    a3lpop.a3lpop,
    a4LPop.a4LPop,
    a5LPop.a5LPop
  FROM
    years
    left join a3lpop
    on a3lpop.year = years.year
    left join a4LPop
    on a4LPop.year = years.year
    left join a5LPop
    on a5LPop.year = years.year
  order by years.year
  $$
  LANGUAGE sql STABLE;
ALTER FUNCTION apflora.pop_nach_status_for_jber(apid uuid)
  OWNER TO postgres;
