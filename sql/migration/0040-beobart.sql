ALTER TABLE apflora.beobart ADD COLUMN id UUID UNIQUE DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.beobart RENAME "BeobArtId" TO id_old;
ALTER TABLE apflora.beobart RENAME "TaxonomieId" TO taxid;
ALTER TABLE apflora.beobart RENAME "ApArtId" TO ap_id;
ALTER TABLE apflora.beobart RENAME "MutWann" TO changed;
ALTER TABLE apflora.beobart RENAME "MutWer" TO changed_by;

-- change primary key
ALTER TABLE apflora.beobart DROP CONSTRAINT beobart_pkey;
ALTER TABLE apflora.beobart ADD PRIMARY KEY (id);
ALTER TABLE apflora.beobart ALTER COLUMN id_old DROP NOT NULL;
ALTER TABLE apflora.beobart ALTER COLUMN id_old SET DEFAULT null;

-- comments
COMMENT ON COLUMN apflora.beobart.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.beobart.id_old IS 'frühere id';
COMMENT ON COLUMN apflora.beobart.taxid IS 'Zugehörige Art. Fremdschlüssel aus der Tabelle "ae_eigenschaften"';
COMMENT ON COLUMN apflora.beobart.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.beobart.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.beobart.changed_by IS 'Wer hat den Datensatz zuletzt geändert?';

-- drop existing indexes
DROP index apflora.apflora."beobart_ApArtId_TaxonomieId_idx";
DROP index apflora.apflora."beobart_BeobArtId_idx";
-- add new
CREATE INDEX ON apflora.beobart USING btree (id);
CREATE INDEX ON apflora.beobart USING btree (ap_id);
CREATE INDEX ON apflora.beobart USING btree (taxid);

ALTER TABLE apflora.beobart RENAME TO apart;

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- TODO: run migration sql in dev
-- TODO: restart postgrest and test app
-- TODO: rebuild creating new ap
-- TODO: update js and run this file on server
-- TODO: restart postgrest

-- when ap is inserted
-- ensure apart is created too
DROP TRIGGER IF EXISTS ap_insert_add_beobart ON apflora.ap;
DROP TRIGGER IF EXISTS ap_insert_add_apart ON apflora.ap;
DROP FUNCTION IF EXISTS apflora.ap_insert_add_beobart();
DROP FUNCTION IF EXISTS apflora.ap_insert_add_apart();
CREATE FUNCTION apflora.ap_insert_add_apart() RETURNS trigger AS $ap_insert_add_apart$
BEGIN
  INSERT INTO
    apflora.apart (ap_id, taxid)
  VALUES (NEW."ApArtId", NEW."ApArtId");
  RETURN NEW;
END;
$ap_insert_add_apart$ LANGUAGE plpgsql;

CREATE TRIGGER ap_insert_add_apart AFTER INSERT ON apflora.ap
  FOR EACH ROW EXECUTE PROCEDURE apflora.ap_insert_add_apart();

-- when ap is inserted
-- ensure apart is created too
DROP TRIGGER IF EXISTS ap_insert_add_beobart ON apflora.ap;
DROP TRIGGER IF EXISTS ap_insert_add_apart ON apflora.ap;
DROP FUNCTION IF EXISTS apflora.ap_insert_add_beobart();
DROP FUNCTION IF EXISTS apflora.ap_insert_add_apart();
CREATE FUNCTION apflora.ap_insert_add_apart() RETURNS trigger AS $ap_insert_add_apart$
BEGIN
  INSERT INTO
    apflora.apart (ap_id, taxid)
  VALUES (NEW."ApArtId", NEW."ApArtId");
  RETURN NEW;
END;
$ap_insert_add_apart$ LANGUAGE plpgsql;

CREATE TRIGGER ap_insert_add_apart AFTER INSERT ON apflora.ap
  FOR EACH ROW EXECUTE PROCEDURE apflora.ap_insert_add_apart();