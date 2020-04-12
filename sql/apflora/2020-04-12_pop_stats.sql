DROP VIEW IF EXISTS apflora.v_ap_pop_prio CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_pop_prio AS
with last_year as (
  select distinct year
  from apflora.ap_history
  order by year desc
  limit 1
), previous_year as (
  select distinct year
  from apflora.ap_history
  order by year desc
  limit 1
  offset 1
),
count_urspr_last as (
  select
    apflora.pop_history.ap_id,
    count(apflora.pop_history.*) as anzahl
  from
    apflora.pop_history
    inner join last_year
    on last_year.year = apflora.pop_history.year
  where
    apflora.pop_history.status = 100
  group by
    apflora.pop_history.ap_id
),
count_anges_last as (
  select
    apflora.pop_history.ap_id,
    count(apflora.pop_history.*) as anzahl
  from
    apflora.pop_history
    inner join last_year
    on last_year.year = apflora.pop_history.year
  where
    apflora.pop_history.status = 200
  group by
    apflora.pop_history.ap_id
),
count_total_last as (
  select
    apflora.pop_history.ap_id,
    count(apflora.pop_history.*) as anzahl
  from
    apflora.pop_history
    inner join last_year
    on last_year.year = apflora.pop_history.year
  where
    apflora.pop_history.status in (100, 200)
  group by
    apflora.pop_history.ap_id),
count_urspr_prev as (
  select
    apflora.pop_history.ap_id,
    count(apflora.pop_history.*) as anzahl
  from
    apflora.pop_history
    inner join previous_year
    on previous_year.year = apflora.pop_history.year
  where
    apflora.pop_history.status = 100
  group by
    apflora.pop_history.ap_id
),
count_anges_prev as (
  select
    apflora.pop_history.ap_id,
    count(apflora.pop_history.*) as anzahl
  from
    apflora.pop_history
    inner join previous_year
    on previous_year.year = apflora.pop_history.year
  where
    apflora.pop_history.status = 200
  group by
    apflora.pop_history.ap_id
),
count_total_prev as (
  select
    apflora.pop_history.ap_id,
    count(apflora.pop_history.*) as anzahl
  from
    apflora.pop_history
    inner join previous_year
    on previous_year.year = apflora.pop_history.year
  where
    apflora.pop_history.status in (100, 200)
  group by
    apflora.pop_history.ap_id
),
diff_urspr as (),
diff_anges as (),
diff_total as (),
select
  apflora.ap_history.id as ap_id,
  last_year.year as zuletzt,
  previous_year.year as zuvor,
  count_urspr_last.anzahl as anz_pop_urspr_zuletzt,
  count_anges_last.anzahl as anz_pop_anges_zuletzt
from
  apflora.ap_history
  left join count_urspr_last
  on count_urspr_last.ap_id = apflora.ap_history.id
  left join count_anges_last
  on count_anges_last.ap_id = apflora.ap_history.id,
  last_year, 
  previous_year
where
  apflora.ap_history.year = last_year.year;