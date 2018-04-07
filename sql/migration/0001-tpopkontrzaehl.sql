ALTER TABLE apflora.tpopkontrzaehl ADD COLUMN id UUID UNIQUE DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.tpopkontrzaehl RENAME "TPopKontrZaehlId" TO id_old;
ALTER TABLE apflora.tpopkontrzaehl RENAME "TPopKontrId" TO tpopkontr_id;
ALTER TABLE apflora.tpopkontrzaehl RENAME "Anzahl" TO anzahl;
ALTER TABLE apflora.tpopkontrzaehl RENAME "Zaehleinheit" TO einheit;
ALTER TABLE apflora.tpopkontrzaehl RENAME "Methode" TO methode;
ALTER TABLE apflora.tpopkontrzaehl RENAME "MutWann" TO changed;
ALTER TABLE apflora.tpopkontrzaehl RENAME "MutWer" TO changed_by;

COMMENT ON COLUMN apflora.tpopkontrzaehl.id_old IS 'frühere id';

-- done: renamed in sql
-- TODO: check if old id was used somewhere. If so: rename that field, add new one and update that
-- TODO: add all views, functions, triggers with tpopkontrzaehl to this file
-- TODO: rename in js
-- TODO: test app
-- TODO: update js and run this file on server