DROP VIEW IF EXISTS apflora.v_ap_pop_ek_prio CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_pop_ek_prio AS
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
)
select
  apflora.ap_history.id as ap_id,
  apflora.ae_taxonomies.artname,
  previous_year.year as jahr_zuvor,
  last_year.year as jahr_zuletzt,
  coalesce(count_urspr_prev.anzahl, 0) as anz_pop_urspr_zuvor,
  coalesce(count_anges_prev.anzahl, 0) as anz_pop_anges_zuvor,
  coalesce(count_urspr_prev.anzahl, 0) + coalesce(count_anges_prev.anzahl, 0) as anz_pop_aktuell_zuvor,
  coalesce(count_urspr_last.anzahl, 0) as anz_pop_urspr_zuletzt,
  coalesce(count_anges_last.anzahl, 0) as anz_pop_anges_zuletzt,
  coalesce(count_urspr_last.anzahl, 0) + coalesce(count_anges_last.anzahl, 0) as anz_pop_aktuell_zuletzt,
  coalesce(count_urspr_last.anzahl, 0) - coalesce(count_urspr_prev.anzahl, 0) as diff_pop_urspr,
  coalesce(count_anges_last.anzahl, 0) - coalesce(count_anges_prev.anzahl, 0) as diff_pop_anges,
  (coalesce(count_urspr_last.anzahl, 0) + coalesce(count_anges_last.anzahl, 0)) - (coalesce(count_urspr_prev.anzahl, 0) + coalesce(count_anges_prev.anzahl, 0)) as diff_pop_aktuell,
  apflora.ap_erfkrit_werte.text as beurteilung_zuletzt
from
  apflora.ap_history
  inner join apflora.ae_taxonomies
  on apflora.ae_taxonomies.id = apflora.ap_history.art_id
  left join apflora.apber
    left join apflora.ap_erfkrit_werte
    on apflora.ap_erfkrit_werte.code = apflora.apber.beurteilung
  on apflora.apber.ap_id = apflora.ap_history.id
  left join count_urspr_last
  on count_urspr_last.ap_id = apflora.ap_history.id
  left join count_anges_last
  on count_anges_last.ap_id = apflora.ap_history.id
  left join count_urspr_prev
  on count_urspr_prev.ap_id = apflora.ap_history.id
  left join count_anges_prev
  on count_anges_prev.ap_id = apflora.ap_history.id,
  last_year, 
  previous_year
where
  apflora.ap_history.year = last_year.year
order by
  apflora.ae_taxonomies.artname;