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
  )
  SELECT
    years.year,
    a3lpop.a3lpop
  FROM
    years
    left join a3lpop
    on a3lpop.year = years.year
  order by years.year
  $$
  LANGUAGE sql STABLE;
ALTER FUNCTION apflora.pop_nach_status_for_jber(apid uuid)
  OWNER TO postgres;
