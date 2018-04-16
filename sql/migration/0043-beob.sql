
ALTER TABLE apflora.beob RENAME id TO id_old;
ALTER TABLE apflora.beob ADD COLUMN id UUID UNIQUE DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.beob RENAME "ArtId" TO art_id_old;
ALTER TABLE apflora.beob ADD COLUMN art_id UUID DEFAULT NULL;
ALTER TABLE apflora.beob RENAME "QuelleId" TO quelle_id;
ALTER TABLE apflora.beob RENAME "IdField" TO id_field;
ALTER TABLE apflora.beob RENAME "Datum" TO datum;
ALTER TABLE apflora.beob RENAME "Autor" TO autor;
ALTER TABLE apflora.beob RENAME "X" TO x;
ALTER TABLE apflora.beob RENAME "Y" TO y;

-- add data for art_id
CREATE INDEX ON apflora.beob USING btree (art_id_old);
UPDATE apflora.beob SET art_id = (
  SELECT id FROM apflora.ae_eigenschaften WHERE taxid = apflora.beob.art_id_old
) WHERE art_id_old IS NOT NULL;
DROP index IF EXISTS apflora.apflora."beob_art_id_old_idx";

-- change primary key
ALTER TABLE apflora.beob DROP CONSTRAINT beob_pkey cascade;
ALTER TABLE apflora.beob ADD PRIMARY KEY (id);
ALTER TABLE apflora.beob ALTER COLUMN id_old DROP NOT NULL;
ALTER TABLE apflora.beob ALTER COLUMN id_old SET DEFAULT null;

-- comments
COMMENT ON COLUMN apflora.beob.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.beob.id_old IS 'Frühere id';
COMMENT ON COLUMN apflora.beob.art_id_old IS 'Frühere Art id (=SISF2-Nr)';

-- drop existing indexes
DROP index IF EXISTS apflora.apflora."beob_ArtId_idx";
DROP index IF EXISTS apflora.apflora."beob_Datum_idx";
DROP index IF EXISTS apflora.apflora."beob_QuelleId_idx";
DROP index IF EXISTS apflora.apflora."beob_X_idx";
DROP index IF EXISTS apflora.apflora."beob_Y_idx";
DROP index IF EXISTS apflora.apflora."beob_expr_idx";
-- add new
CREATE INDEX ON apflora.beob USING btree (id);
CREATE INDEX ON apflora.beob USING btree (quelle_id);
CREATE INDEX ON apflora.beob USING btree (art_id);
CREATE INDEX ON apflora.beob USING btree (x);
CREATE INDEX ON apflora.beob USING btree (y);

-- change n-sides:

-- beob_projekt
DROP TABLE apflora.beob_projekt;

-- tpopbeob
ALTER TABLE apflora.tpopbeob RENAME beob_id TO beob_id_old;
DROP index IF EXISTS apflora.apflora."tpopbeob_beob_id_idx";
ALTER TABLE apflora.tpopbeob ADD COLUMN beob_id UUID DEFAULT NULL REFERENCES apflora.beob (id) ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX ON apflora.beob USING btree (id_old);
CREATE INDEX ON apflora.tpopbeob USING btree (id_old);
UPDATE apflora.tpopbeob SET beob_id = (
  SELECT id FROM apflora.beob WHERE id_old = apflora.tpopbeob.beob_id_old
) WHERE beob_id_old IS NOT NULL;
CREATE INDEX ON apflora.tpopbeob USING btree (beob_id);
ALTER TABLE apflora.tpopbeob DROP COLUMN beob_id_old CASCADE;
COMMENT ON COLUMN apflora.tpopbeob.beob_id IS 'Zugehörige Beobachtung. Fremdschlüssel aus der Tabelle "beob"';
DROP index IF EXISTS apflora.apflora."beob_id_old_idx";
DROP index IF EXISTS apflora.apflora."tpopbeob_id_old_idx";

ALTER TABLE apflora.apart ADD COLUMN art_id UUID DEFAULT NULL;
UPDATE apflora.apart SET art_id = (
  SELECT id FROM apflora.ae_eigenschaften WHERE taxid = apflora.apart.taxid
) WHERE taxid IS NOT NULL;
alter table apflora.apart drop column taxid;

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- TODO: check if old id was used somewhere. If so: rename that field, add new one and update that
-- TODO: add all views, functions, triggers containing this table to this file
-- TODO: run migration sql in dev
-- TODO: restart postgrest and test app
-- TODO: special ap functions work?
-- TODO: CHECK child tables: are they correct?
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
    apflora.apart (ap_id, art_id)
  VALUES (NEW.id, NEW.art);
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
    apflora.apart (ap_id, art_id)
  VALUES (NEW.id, NEW.art);
  RETURN NEW;
END;
$ap_insert_add_apart$ LANGUAGE plpgsql;

CREATE TRIGGER ap_insert_add_apart AFTER INSERT ON apflora.ap
  FOR EACH ROW EXECUTE PROCEDURE apflora.ap_insert_add_apart();