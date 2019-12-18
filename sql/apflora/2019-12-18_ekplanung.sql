-- for all ap with ekfrequenz do:

-- 1 ekfrequenz "Spez EK" becomes "Spez EK S"
update apflora.ekfrequenz
set 
  code = 'Spez EK S',
  anwendungsfall = 'Spezialfälle in EK, Population ist angesiedelt',
  changed = '2019-12-18',
  changed_by = 'ag'
where code = 'Spez EK';

-- 2 insert ekfrequenz "Spez EK G", copying "Spez EK S", ekabrechnungstyp is "B (Umsetzungsbudget Überwachung ursprüngliche Pop)"
insert into apflora.ekfrequenz(
  ap_id,
  anwendungsfall,
  code,
  bemerkungen,
  sort,
  changed,
  changed_by,
  ek_abrechnungstyp,
  ektyp
)
select
  ap_id,
  'Spezialfälle in EK, Population ist ursprünglich' as anwendungsfall,
  'Spez EK G' as code,
  bemerkungen,
  sort,
  '2019-12-18' as changed,
  'ag' as changed_by,
  'B' as ek_abrechnungstyp,
  ektyp
from
  apflora.ekfrequenz
where
  code = 'Spez EK S';

-- 3 ekfrequenz "Spez A" becomes "Spez A S"
update apflora.ekfrequenz
set 
  code = 'Spez A S',
  anwendungsfall = 'TODO: Population ist angesiedelt',
  changed = '2019-12-18',
  changed_by = 'ag'
where code = 'Spez A';

-- 4 insert ekfrequenz "Spez A G", copying "Spez A S", ekabrechnungstyp is "B (Umsetzungsbudget Überwachung ursprüngliche Pop)"
insert into apflora.ekfrequenz(
  ap_id,
  anwendungsfall,
  code,
  bemerkungen,
  sort,
  changed,
  changed_by,
  ek_abrechnungstyp,
  ektyp
)
select
  ap_id,
  'TODO: Population ist ursprünglich' as anwendungsfall,
  'Spez A G' as code,
  bemerkungen,
  sort,
  '2019-12-18' as changed,
  'ag' as changed_by,
  'B' as ek_abrechnungstyp,
  ektyp
from
  apflora.ekfrequenz
where
  code = 'Spez A S';

-- 5 Alle bestehenden ehemaligen Fälle von "Spez EK", die nun "Spez EK S" sind: wenn die dazugehörige Population ursprünglich ist auf "Spez EK G" setzen
with tpops as (
  select apflora.tpop.id, apflora.pop.ap_id
  from apflora.tpop
    inner join apflora.ekfrequenz ekf
    on ekf.id = apflora.tpop.ekfrequenz
    inner join apflora.pop
    on apflora.pop.id = apflora.tpop.pop_id
  where
    ekf.code = 'Spez EK S'
    and apflora.pop.status < 200
)
update apflora.tpop
set ekfrequenz = (
  select id from apflora.ekfrequenz where ap_id = tpops.ap_id and code = 'Spez EK G'
)
from tpops
where tpops.id = apflora.tpop.id;

-- 6 Alle bestehenden ehemaligen Fälle von "Spez A", die nun "Spez A S" sind: wenn die dazugehörige Population ursprünglich ist auf "Spez A G" setzen
with tpops as (
  select apflora.tpop.id, apflora.pop.ap_id
  from apflora.tpop
    inner join apflora.ekfrequenz ekf
    on ekf.id = apflora.tpop.ekfrequenz
    inner join apflora.pop
    on apflora.pop.id = apflora.tpop.pop_id
  where
    ekf.code = 'Spez A S'
    and apflora.pop.status < 200
)
update apflora.tpop
set ekfrequenz = (
  select id from apflora.ekfrequenz where ap_id = tpops.ap_id and code = 'Spez A G'
)
from tpops
where tpops.id = apflora.tpop.id;