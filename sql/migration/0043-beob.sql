
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
ALTER TABLE apflora.beob ADD COLUMN tpop_id uuid DEFAULT NULL REFERENCES apflora.tpop (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE apflora.beob ADD COLUMN nicht_zuordnen boolean default false;
ALTER TABLE apflora.beob ADD COLUMN bemerkungen text;
ALTER TABLE apflora.beob ADD COLUMN changed date DEFAULT NOW();
ALTER TABLE apflora.beob ADD COLUMN changed_by varchar(20) DEFAULT current_setting('request.jwt.claim.username', true);

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
COMMENT ON COLUMN apflora.beob.tpop_id IS 'Dieser Teilpopulation wurde die Beobachtung zugeordnet. Fremdschlüssel aus der Tabelle "tpop"';
COMMENT ON COLUMN apflora.beob.nicht_zuordnen IS 'Wird ja gesetzt, wenn eine Beobachtung keiner Teilpopulation zugeordnet werden kann. Sollte im Bemerkungsfeld begründet werden. In der Regel ist die Artbestimmung zweifelhaft. Oder die Beobachtung ist nicht (genau genug) lokalisierbar';
COMMENT ON COLUMN apflora.beob.bemerkungen IS 'Bemerkungen zur Zuordnung';
COMMENT ON COLUMN apflora.beob.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.beob.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

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
CREATE INDEX ON apflora.beob USING btree (tpop_id);
CREATE INDEX ON apflora.beob USING btree (nicht_zuordnen);

-- change n-sides:

-- beob_projekt
DROP TABLE apflora.beob_projekt;

-- TODO
-- tpopbeob
-- id = uuid?
UPDATE apflora.beob SET tpop_id = (
  SELECT tpop_id FROM apflora.tpopbeob WHERE beob_id = apflora.beob.id_old LIMIT 1
);
UPDATE apflora.beob SET nicht_zuordnen = true where id_old in (
  SELECT distinct beob_id FROM apflora.tpopbeob WHERE nicht_zuordnen = 1
);
UPDATE apflora.beob SET bemerkungen = (
  SELECT bemerkungen FROM apflora.tpopbeob WHERE beob_id = apflora.beob.id_old LIMIT 1
);
UPDATE apflora.beob SET changed = (
  SELECT changed FROM apflora.tpopbeob WHERE beob_id = apflora.beob.id_old LIMIT 1
);
UPDATE apflora.beob SET changed_by = (
  SELECT changed_by FROM apflora.tpopbeob WHERE beob_id = apflora.beob.id_old LIMIT 1
);

ALTER TABLE apflora.apart ADD COLUMN art_id UUID DEFAULT NULL;
UPDATE apflora.apart SET art_id = (
  SELECT id FROM apflora.ae_eigenschaften WHERE taxid = apflora.apart.taxid
) WHERE taxid IS NOT NULL;
alter table apflora.apart drop column taxid;

DROP TRIGGER IF EXISTS beobzuordnung_on_update_set_mut ON apflora.tpopbeob;
DROP TRIGGER IF EXISTS beob_on_update_set_mut ON apflora.beob;
DROP FUNCTION IF EXISTS beob_on_update_set_mut();
CREATE FUNCTION beob_on_update_set_mut() RETURNS trigger AS $beob_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$beob_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER beob_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.beob
  FOR EACH ROW EXECUTE PROCEDURE beob_on_update_set_mut();

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- done: replace all callst to tpopbeob in views etc.
-- done: run migration sql in dev
-- done: restart postgrest and test app
-- done: CHECK child tables: are they correct?
-- done: update js and run this file on server
-- done: restart postgrest


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

-- TODO: when everything is tested:
DROP TABLE apflora.tpopbeob cascade;