ALTER TABLE apflora.beobzuordnung RENAME id TO id_old;
ALTER TABLE apflora.beobzuordnung DROP CONSTRAINT beobzuordnung_pkey;
ALTER TABLE apflora.beobzuordnung ADD COLUMN id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.beobzuordnung RENAME "TPopId" TO tpop_id;
ALTER TABLE apflora.beobzuordnung RENAME "BeobId" TO beob_id;
ALTER TABLE apflora.beobzuordnung RENAME "BeobNichtZuordnen" TO nicht_zuordnen;
ALTER TABLE apflora.beobzuordnung RENAME "BeobBemerkungen" TO bemerkungen;
ALTER TABLE apflora.beobzuordnung RENAME "BeobMutWann" TO changed;
ALTER TABLE apflora.beobzuordnung RENAME "BeobMutWer" TO changed_by;

COMMENT ON COLUMN apflora.beobzuordnung.id_old IS 'frühere id';
ALTER TABLE apflora.beobzuordnung RENAME TO tpopbeob;
CREATE INDEX ON apflora.tpopbeob USING btree (id);

-- done: make sure createTable is correct
-- TODO: rename in sql
-- TODO: rename in js
-- TODO: check if old id was used somewhere. If so: rename that field, add new one and update that
-- TODO: add all views, functions, triggers with tpopber to this file
-- TODO: run migration sql in dev
-- TODO: test app
-- TODO: update js and run this file on server

