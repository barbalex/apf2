-- 1: up sort by 1 if > 14
update apflora.ekfrequenz
set sort = sort + 1
where sort > 14;

with apids as (
  select distinct ap_id from apflora.ekfrequenz
),
ekf as (
  select
    apids.ap_id,
    'für erloschene Tpops oder solche, die nicht mehr kontrolliert werden sollen' as anwendungsfall,
    'nie (EKF)' as code,
    19::smallint as sort,
    'ek'::ek_kontrolljahre_ab as kontrolljahre_ab,
    '2020-04-08'::date as changed,
    'ag' as changed_by,
    'ekf'::ek_type as ektyp
  from apids
)
insert into apflora.ekfrequenz (ap_id, anwendungsfall, code, sort, changed, changed_by, ektyp)
select ap_id, anwendungsfall, code, sort, changed, changed_by, ektyp from ekf;

with apids as (
  select distinct ap_id from apflora.ekfrequenz
),
ek as (
  select
    apids.ap_id,
    'für erloschene Tpops oder solche, die nicht mehr kontrolliert werden sollen' as anwendungsfall,
    'nie (EK)' as code,
    15::smallint as sort,
    'ek'::ek_kontrolljahre_ab as kontrolljahre_ab,
    '2020-04-08'::date as changed,
    'ag' as changed_by,
    'ek'::ek_type as ektyp
  from apids
)
insert into apflora.ekfrequenz (ap_id, anwendungsfall, code, sort, changed, changed_by, ektyp)
select ap_id, anwendungsfall, code, sort, changed, changed_by, ektyp from ek;


DROP VIEW IF EXISTS apflora.v_q_tpop_erloschen_mit_ekplan_nach_letztem_tpopber CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_tpop_erloschen_mit_ekplan_nach_letztem_tpopber AS
with last_tpopber_jahr as (
  select distinct on (tpop_id)
    tpop_id,
    jahr
  from
    apflora.tpopber
  order by
   tpop_id,
   jahr desc
), tpop_erloschen_with_ekplan_after_last_tpopber_jahr as (
  select distinct
    tpop.id
  from
    apflora.tpop
    inner join last_tpopber_jahr
      inner join apflora.ekplan
      on 
        (apflora.ekplan.tpop_id = last_tpopber_jahr.tpop_id)
        and (last_tpopber_jahr.jahr < apflora.ekplan.jahr)
    on last_tpopber_jahr.tpop_id = apflora.tpop.id
  where
    apflora.tpop.status in (101, 202)
)
SELECT distinct
  apflora.projekt.id as proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.projekt
  INNER JOIN apflora.ap
    INNER JOIN apflora.pop
      INNER JOIN apflora.tpop
        inner join tpop_erloschen_with_ekplan_after_last_tpopber_jahr
        on tpop_erloschen_with_ekplan_after_last_tpopber_jahr.id = apflora.tpop.id
      ON apflora.tpop.pop_id = apflora.pop.id
    ON apflora.pop.ap_id = apflora.ap.id
  ON apflora.projekt.id = apflora.ap.proj_id
ORDER BY
  apflora.projekt.id,
  apflora.ap.id,
  apflora.pop.nr,
  apflora.tpop.nr;





-- make room to sort new qk in to
update apflora.qk
set sort = sort + 1
where sort > 60;

-- insert new qk
insert into apflora.qk (name, titel, sort)
values ('tpopErloschenMitEkplanNachLetztemTpopber', 'Teilpopulation: Status ist erloschen (ursprünglich oder angesiedelt). Nach dem letzten Teil-Populations-Bericht sind aber Kontrollen geplant', 61)


-- add new apqk's
with apqks as (
  select distinct ap_id from apflora.apqk
)
insert into apflora.apqk (ap_id, qk_name)
select
  ap_id,
  'tpopErloschenMitEkplanNachLetztemTpopber'
from apqks;