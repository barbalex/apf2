ALTER TABLE apflora.adb_eigenschaften RENAME "GUID" TO id;
ALTER TABLE apflora.adb_eigenschaften ALTER COLUMN id SET DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.adb_eigenschaften RENAME "TaxonomieId" TO taxid;
ALTER TABLE apflora.adb_eigenschaften RENAME "Familie" TO familie;
ALTER TABLE apflora.adb_eigenschaften RENAME "Artname" TO artname;
ALTER TABLE apflora.adb_eigenschaften RENAME "NameDeutsch" TO namedeutsch;
ALTER TABLE apflora.adb_eigenschaften RENAME "Status" TO status;
ALTER TABLE apflora.adb_eigenschaften RENAME "Artwert" TO artwert;
ALTER TABLE apflora.adb_eigenschaften RENAME "KefArt" TO kefart;
ALTER TABLE apflora.adb_eigenschaften RENAME "KefKontrolljahr" TO kefkontrolljahr;
ALTER TABLE apflora.adb_eigenschaften RENAME "FnsJahresartJahr" TO fnsjahresartjahr;

CREATE INDEX ON apflora.adb_eigenschaften USING btree (id);
COMMENT ON COLUMN apflora.adb_eigenschaften.id IS 'Primärschlüssel';

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- done: run migration sql in dev
-- done: restart postgrest and test app
-- TODO: update js and run this file on server
-- TODO: restart postgrest
   
ALTER TABLE apflora.adb_eigenschaften RENAME TO ae_eigenschaften;

-- add missing constraints:
ALTER TABLE apflora.assozart 
   ADD CONSTRAINT assozart_fk_ae_eigenschaften
   FOREIGN KEY (ae_id) 
   REFERENCES apflora.ae_eigenschaften (id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE apflora.beobart 
   ADD CONSTRAINT beobart_fk_ae_eigenschaften
   FOREIGN KEY ("TaxonomieId") 
   REFERENCES apflora.ae_eigenschaften (taxid) ON DELETE SET NULL ON UPDATE CASCADE;