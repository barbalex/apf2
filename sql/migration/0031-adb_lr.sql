ALTER TABLE apflora.adb_lr RENAME "Label" TO label;
ALTER TABLE apflora.adb_lr RENAME "Einheit" TO einheit;
ALTER TABLE apflora.adb_lr RENAME "Id" TO sort;

ALTER TABLE apflora.adb_lr ADD COLUMN id UUID DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.adb_lr DROP CONSTRAINT adb_lr_pkey CASCADE;
ALTER TABLE apflora.adb_lr ADD PRIMARY KEY (id);
CREATE INDEX ON apflora.adb_lr USING btree (id);
COMMENT ON COLUMN apflora.adb_lr.id IS 'Primärschlüssel';

ALTER TABLE apflora.adb_lr DROP COLUMN "LrMethodId";
ALTER TABLE apflora.adb_lr DROP COLUMN "ENr";
ALTER TABLE apflora.adb_lr DROP COLUMN "ELat";
ALTER TABLE apflora.adb_lr DROP COLUMN "EEngl";
ALTER TABLE apflora.adb_lr DROP COLUMN "EFranz";
ALTER TABLE apflora.adb_lr DROP COLUMN "EItal";
ALTER TABLE apflora.adb_lr DROP COLUMN "Bemerkungen";

ALTER TABLE apflora.adb_lr RENAME TO ae_lrdelarze;

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- done: run migration sql in dev
-- TODO: restart postgrest and test app
-- TODO: update js and run this file on server
-- TODO: restart postgrest