-- https://github.com/barbalex/apf2/issues/706
-- TODO:
-- 1. ensure no ziel has multiple zielber ✓
-- 2. create zielber fields (erreichung, bemerkungen) to ziel ✓
-- 3. copy data from zielber to ziel ✓
-- 4. find every place zielber are used and change to ziel ✓
-- 5. add Ziel-Erreichung to label (if is not null) ✓
-- 6. add erreichung and bemerkungen to ziel form ✓
-- 7. drop zielber group and nodes in tree ✓
-- 8. drop zielber table
-- 9. reload graphql
-- 10. implement dropdown for erreichung
--
-- 1. ensure no ziel has multiple zielber
select 
  ziel.id as ziel_id,
  ziel.ap_id as ziel_ap_id,
  ziel.typ as ziel_typ,
  ziel.jahr as ziel_jahr,
  ziel.bezeichnung as ziel_bezeichnung,
  zielber.id as zielber_id,
  zielber.jahr as zielber_jahr,
  zielber.erreichung as zielber_erreichung,
  zielber.bemerkungen as zielber_bemerkungen
from 
  apflora.ziel
  join apflora.zielber on ziel.id = zielber.ziel_id
where ziel.id in 
  (select ziel_id from apflora.zielber group by ziel_id having count(*) > 1)
order by
  ziel.ap_id,
  ziel.jahr;
-- removed two duplicates manually
-- TODO: repeat before setting live
--
-- 2. create zielber fields (erreichung, bemerkungen) to ziel
alter table apflora.ziel
  add column erreichung text DEFAULT NULL,
  add column bemerkungen text DEFAULT NULL;

-- 3. copy data from zielber to ziel
-- TODO: repeat before setting live
update apflora.ziel as z
set
  erreichung = zb.erreichung,
  bemerkungen = zb.bemerkungen
from apflora.zielber as zb
where z.id = zb.ziel_id;
-- check
select
  z.id,
  z.ap_id,
  z.jahr,
  z.bezeichnung,
  z.erreichung,
  z.bemerkungen,
  zb.erreichung as zielber_erreichung,
  zb.bemerkungen as zielber_bemerkungen
from
  apflora.ziel as z
  join apflora.zielber as zb on z.id = zb.ziel_id
where z.erreichung is distinct from zb.erreichung
   or z.bemerkungen is distinct from zb.bemerkungen;
-- looks good

-- 5. add Ziel-Erreichung to label (if is not null)
-- TODO: run: CREATE OR REPLACE FUNCTION apflora.ziel_label
-- TODO: DROP FUNCTION IF EXISTS apflora.zielber_label (zielber apflora.zielber);


-- 7. drop zielber table
-- TODO: DROP TABLE IF EXISTS apflora.zielber cascade;
-- DROP FUNCTION IF EXISTS apflora.zielber_label (zielber apflora.zielber);


-- get all values of erreichung including their counts
select erreichung, count(*) from apflora.ziel group by erreichung order by count desc;