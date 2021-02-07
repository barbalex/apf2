-- 1. import all arten to tmp_ekplan_ap. done
-- 2. import importdata to tmp_ekplan. done
-- 3. copy all ekfrequenz from Abies alba to all ap's in tmp_ekplan_ap and all ap's with ap.bearbeitung < 4
select * from apflora.ekfrequenz where ap_id = '6c52d174-4f62-11e7-aebe-67a303eb0640'
select id from apflora.ap where bearbeitung < 4 union select ap_id from apflora.tmp_ekplan_ap

with
  ids as (
    select id from apflora.ap where bearbeitung < 4 and id <> '6c52d174-4f62-11e7-aebe-67a303eb0640'
    union select ap_id from apflora.tmp_ekplan_ap
  ),
  f as (select * from apflora.ekfrequenz where ap_id = '6c52d174-4f62-11e7-aebe-67a303eb0640')
insert into apflora.ekfrequenz(
  ap_id,
  anwendungsfall,
  code,
  kontrolljahre,
  anzahl_min,
  anzahl_max,
  bemerkungen,
  sort,
  changed,
  changed_by,
  ek_abrechnungstyp,
  ektyp,
  kontrolljahre_ab
)
select
  ids.id,
  f.anwendungsfall,
  f.code,
  f.kontrolljahre,
  f.anzahl_min,
  f.anzahl_max,
  f.bemerkungen,
  f.sort,
  '2019-11-13',
  'ag',
  f.ek_abrechnungstyp,
  f.ektyp,
  f.kontrolljahre_ab
from ids, f 
-- done

-- check if all tpop_id exist
SELECT tpop_id 
FROM apflora.tmp_ekplan
where tmp_ekplan.tpop_id not in (select id from apflora.tpop)

-- 4. import tpop.ekfrequenz
with ekfrequenzs as (
select
  tmp_ekplan.tpop_id,
  (select id from apflora.ekfrequenz where code = tmp_ekplan.ekfrequenz_code and ap_id = ap.id) as ekfrequenzid
from
  apflora.tmp_ekplan
  inner join apflora.tpop
    inner join apflora.pop
      inner join apflora.ap
      on apflora.ap.id = apflora.pop.ap_id
    on apflora.pop.id = apflora.tpop.pop_id
  on apflora.tpop.id = apflora.tmp_ekplan.tpop_id
)
update apflora.tpop 
set ekfrequenz = ekfrequenzs.ekfrequenzid
from ekfrequenzs
where ekfrequenzs.tpop_id = apflora.tpop.id;

-- 5. import ekplan data from tmp_ekplan in 11 queries (one for every year)
with ekplans as (
  select 
    tmp_ekplan.tpop_id,
    tmp_ekplan.typ,
    2018 as jahr,
    '2019-11-16' as changed,
    'ag' as changed_by
  from apflora.tmp_ekplan
  where tmp_ekplan.y2018 = 1
  union select 
    tmp_ekplan.tpop_id,
    tmp_ekplan.typ,
    2019 as jahr,
    '2019-11-16' as changed,
    'ag' as changed_by
  from apflora.tmp_ekplan
  where tmp_ekplan.y2019 = 1
  union select 
    tmp_ekplan.tpop_id,
    tmp_ekplan.typ,
    2020 as jahr,
    '2019-11-16' as changed,
    'ag' as changed_by
  from apflora.tmp_ekplan
  where tmp_ekplan.y2020 = 1
  union select 
    tmp_ekplan.tpop_id,
    tmp_ekplan.typ,
    2021 as jahr,
    '2019-11-16' as changed,
    'ag' as changed_by
  from apflora.tmp_ekplan
  where tmp_ekplan.y2021 = 1
  union select 
    tmp_ekplan.tpop_id,
    tmp_ekplan.typ,
    2022 as jahr,
    '2019-11-16' as changed,
    'ag' as changed_by
  from apflora.tmp_ekplan
  where tmp_ekplan.y2022 = 1
  union select 
    tmp_ekplan.tpop_id,
    tmp_ekplan.typ,
    2023 as jahr,
    '2019-11-16' as changed,
    'ag' as changed_by
  from apflora.tmp_ekplan
  where tmp_ekplan.y2023 = 1
  union select 
    tmp_ekplan.tpop_id,
    tmp_ekplan.typ,
    2024 as jahr,
    '2019-11-16' as changed,
    'ag' as changed_by
  from apflora.tmp_ekplan
  where tmp_ekplan.y2024 = 1
  union select 
    tmp_ekplan.tpop_id,
    tmp_ekplan.typ,
    2025 as jahr,
    '2019-11-16' as changed,
    'ag' as changed_by
  from apflora.tmp_ekplan
  where tmp_ekplan.y2025 = 1
  union select 
    tmp_ekplan.tpop_id,
    tmp_ekplan.typ,
    2026 as jahr,
    '2019-11-16' as changed,
    'ag' as changed_by
  from apflora.tmp_ekplan
  where tmp_ekplan.y2026 = 1
  union select 
    tmp_ekplan.tpop_id,
    tmp_ekplan.typ,
    2027 as jahr,
    '2019-11-16' as changed,
    'ag' as changed_by
  from apflora.tmp_ekplan
  where tmp_ekplan.y2027 = 1
  union select 
    tmp_ekplan.tpop_id,
    tmp_ekplan.typ,
    2028 as jahr,
    '2019-11-16' as changed,
    'ag' as changed_by
  from apflora.tmp_ekplan
  where tmp_ekplan.y2028 = 1
)
insert into apflora.ekplan(tpop_id,typ,jahr,changed,changed_by)
select
  ekplans.tpop_id,
  ekplans.typ::ek_type,
  ekplans.jahr,
  ekplans.changed::date,
  ekplans.changed_by
from ekplans
  inner join apflora.tpop
  on apflora.tpop.id = ekplans.tpop_id;

-- eventually delete tmp_ekplan_ap and tmp_ekplan

