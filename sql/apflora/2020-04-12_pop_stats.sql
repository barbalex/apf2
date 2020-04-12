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
count_urspr_last as (),
count_anges_last as (),
count_total_last as (),
count_urspr_prev as (),
count_anges_prev as (),
count_total_prev as (),
diff_urspr as (),
diff_anges as (),
diff_total as (),
data as (
  select
    ap_id,
    year,
    status,
    count(*) as anzahl
    from
      apflora.pop_history
    where status is not null
    group by
      ap_id,
      year,
      status
    order by
      ap_id,
      year,
      status
)
select
  ap_id,
  year as jahr,
  json_object_agg(status, anzahl) as values
from data
group by ap_id, year
order by ap_id, year;