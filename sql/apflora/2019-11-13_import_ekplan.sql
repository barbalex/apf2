-- 1. import all arten to tmp_ekplan_ap. Done
-- 2. import importdata to tmp_ekplan. Done
-- 3. copy all ekfrequenz from Abies alba to all ap's in tmp_ekplan_ap and all ap's with ap.bearbeitung < 4
select * from apflora.ekfrequenz where ap_id = '6c52d174-4f62-11e7-aebe-67a303eb0640'
select id from apflora.ap where bearbeitung < 4 union select ap_id from apflora.tmp_ekplan_ap

with
  ids as (select id from apflora.ap where bearbeitung < 4 union select ap_id from apflora.tmp_ekplan_ap),
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
-- 4. import ekplan data from tmp_ekplan in 11 queries (one for every year)
-- delete tmp_ekplan_ap and tmp_ekplan

