-- https://github.com/barbalex/apf2/issues/819
-- Löschen einer Art schlug fehl mit:
--   update or delete on table "ap" violates foreign key constraint
--   "fk_pop_history_ap" on table "pop_history"
-- Ursache: Die Jahres-Snapshots in ap_history/pop_history/tpop_history
-- blieben beim Löschen einer Art bestehen und blockierten das Löschen.
-- Fix: Das Löschen einer Art wird in die Historien-Tabellen weitergegeben:
-- ap -> ap_history -> pop_history -> tpop_history (alles ON DELETE CASCADE).

-- 1. verwaiste Snapshots entfernen (Arten, die 2021 gelöscht wurden,
--    ohne dass die Historien mitgelöscht wurden).
--    Sie verletzten den unten neuen Fremdschlüssel.
--    Keine pop_history verweist auf sie (fk_ap_history ist validiert).
delete from apflora.ap_history h
where not exists (
  select 1
  from apflora.ap a
  where a.id = h.id
);

-- 2. Löschen einer Art löscht ihre Jahres-Snapshots
alter table apflora.ap_history
  add constraint fk_ap_history_ap foreign key (id)
  references apflora.ap(id) on delete cascade on update cascade;

-- 3. Löschen eines ap_history-Jahrs löscht die Pop-Snapshots dieses Jahrs
--    (bisher schlug auch das fehl: fk_ap_history war ON DELETE NO ACTION)
alter table apflora.pop_history
  drop constraint fk_ap_history;
alter table apflora.pop_history
  add constraint fk_ap_history foreign key (ap_id, year)
  references apflora.ap_history(id, year) on delete cascade on update cascade;

-- 4. dito für die Teil-Populationen
alter table apflora.tpop_history
  drop constraint fk_pop_history;
alter table apflora.tpop_history
  add constraint fk_pop_history foreign key (year, pop_id)
  references apflora.pop_history(year, id) on delete cascade on update no action;

-- 5. fk_pop_history_ap auf CASCADE setzen.
--    Mit 2 + 3 redundant, verknüpft pop_history aber zusätzlich
--    direkt mit der lebenden Art
alter table apflora.pop_history
  drop constraint fk_pop_history_ap;
alter table apflora.pop_history
  add constraint fk_pop_history_ap foreign key (ap_id)
  references apflora.ap(id) on delete cascade on update cascade;
