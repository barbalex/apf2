ALTER TABLE apflora.adresse RENAME "AdrId" TO id_old;
ALTER TABLE apflora.adresse ADD COLUMN id UUID UNIQUE DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.adresse RENAME "AdrName" TO name;
ALTER TABLE apflora.adresse RENAME "AdrAdresse" TO adresse;
ALTER TABLE apflora.adresse RENAME "AdrTel" TO telefon;
ALTER TABLE apflora.adresse RENAME "AdrEmail" TO email;
ALTER TABLE apflora.adresse RENAME "freiwErfko" TO freiw_erfko_old;
ALTER TABLE apflora.adresse ADD COLUMN freiw_erfko boolean DEFAULT false;
ALTER TABLE apflora.adresse RENAME "MutWann" TO changed;
ALTER TABLE apflora.adresse RENAME "MutWer" TO changed_by;
ALTER TABLE apflora.adresse RENAME "EvabIdPerson" TO evab_id_person;

-- change primary key
ALTER TABLE apflora.adresse DROP CONSTRAINT adresse_pkey cascade;
ALTER TABLE apflora.adresse ADD PRIMARY KEY (id);
ALTER TABLE apflora.adresse ALTER COLUMN id_old DROP NOT NULL;
ALTER TABLE apflora.adresse ALTER COLUMN id_old SET DEFAULT null;

-- comments
COMMENT ON COLUMN apflora.adresse.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.adresse.id_old IS 'Frühere id';
COMMENT ON COLUMN apflora.adresse.name IS 'Vor- und Nachname';
COMMENT ON COLUMN apflora.adresse.adresse IS 'Strasse, PLZ und Ort';
COMMENT ON COLUMN apflora.adresse.telefon IS 'Telefonnummer';
COMMENT ON COLUMN apflora.adresse.email IS 'Email';
COMMENT ON COLUMN apflora.adresse.freiw_erfko IS 'Ist die Person freiwillige(r) Kontrolleur(in)';
COMMENT ON COLUMN apflora.adresse.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.adresse.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.adresse.evab_id_person IS 'Personen werden in EvAB separat und mit eigener ID erfasst. Daher muss die passende Person hier gewählt werden';

-- drop existing indexes
DROP index IF EXISTS apflora.apflora."adresse_AdrId_idx";
DROP index IF EXISTS apflora.apflora."adresse_AdrName_idx";
-- add new
CREATE INDEX ON apflora.adresse USING btree (id);
CREATE INDEX ON apflora.adresse USING btree (name);
CREATE INDEX ON apflora.adresse USING btree (freiw_erfko);

-- set freiw_erfko
DROP TRIGGER IF EXISTS adresse_on_update_set_mut ON apflora.adresse;
UPDATE apflora.adresse SET freiw_erfko = true where id IN (
  select distinct id from apflora.adresse where freiw_erfko_old = -1
);
-- do not exist: freiw_erfko_old = -1 comparisons
alter table apflora.adresse drop column freiw_erfko_old;

-- change ap
ALTER TABLE apflora.ap RENAME bearbeiter TO bearbeiter_old;
DROP index IF EXISTS apflora.apflora."ap_bearbeiter_idx";
ALTER TABLE apflora.ap ADD COLUMN bearbeiter UUID DEFAULT NULL REFERENCES apflora.ap (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE apflora.ap DROP CONSTRAINT IF EXISTS ap_bearbeiter_fkey;
UPDATE apflora.ap SET bearbeiter = (
  SELECT id FROM apflora.adresse WHERE id_old = apflora.ap.bearbeiter_old
) WHERE bearbeiter_old IS NOT NULL;
CREATE INDEX ON apflora.ap USING btree (bearbeiter);
ALTER TABLE apflora.ap DROP COLUMN bearbeiter_old CASCADE;
COMMENT ON COLUMN apflora.ap.bearbeiter IS 'Zugehöriger Bearbeiter. Fremdschlüssel aus der Tabelle "adresse"';

-- change apber
ALTER TABLE apflora.apber RENAME bearbeiter TO bearbeiter_old;
DROP index IF EXISTS apflora.apflora."apber_bearbeiter_idx";
ALTER TABLE apflora.apber ADD COLUMN bearbeiter UUID DEFAULT NULL REFERENCES apflora.apber (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE apflora.apber DROP CONSTRAINT IF EXISTS apber_bearbeiter_fkey;
UPDATE apflora.apber SET bearbeiter = (
  SELECT id FROM apflora.adresse WHERE id_old = apflora.apber.bearbeiter_old
) WHERE bearbeiter_old IS NOT NULL;
CREATE INDEX ON apflora.apber USING btree (bearbeiter);
ALTER TABLE apflora.apber DROP COLUMN bearbeiter_old CASCADE;
COMMENT ON COLUMN apflora.apber.bearbeiter IS 'Zugehöriger Bearbeiter. Fremdschlüssel aus der Tabelle "adresse"';

-- change tpopkontr
ALTER TABLE apflora.tpopkontr RENAME bearbeiter TO bearbeiter_old;
DROP index IF EXISTS apflora.apflora."tpopkontr_bearbeiter_idx";
ALTER TABLE apflora.tpopkontr ADD COLUMN bearbeiter UUID DEFAULT NULL REFERENCES apflora.tpopkontr (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE apflora.tpopkontr DROP CONSTRAINT IF EXISTS tpopkontr_bearbeiter_fkey;
UPDATE apflora.tpopkontr SET bearbeiter = (
  SELECT id FROM apflora.adresse WHERE id_old = apflora.tpopkontr.bearbeiter_old
) WHERE bearbeiter_old IS NOT NULL;
CREATE INDEX ON apflora.tpopkontr USING btree (bearbeiter);
ALTER TABLE apflora.tpopkontr DROP COLUMN bearbeiter_old CASCADE;
COMMENT ON COLUMN apflora.tpopkontr.bearbeiter IS 'Zugehöriger Bearbeiter. Fremdschlüssel aus der Tabelle "adresse"';

-- change tpopmassn
ALTER TABLE apflora.tpopmassn RENAME bearbeiter TO bearbeiter_old;
DROP index IF EXISTS apflora.apflora."tpopmassn_bearbeiter_idx";
ALTER TABLE apflora.tpopmassn ADD COLUMN bearbeiter UUID DEFAULT NULL REFERENCES apflora.tpopmassn (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE apflora.tpopmassn DROP CONSTRAINT IF EXISTS tpopmassn_bearbeiter_fkey;
UPDATE apflora.tpopmassn SET bearbeiter = (
  SELECT id FROM apflora.adresse WHERE id_old = apflora.tpopmassn.bearbeiter_old
) WHERE bearbeiter_old IS NOT NULL;
CREATE INDEX ON apflora.tpopmassn USING btree (bearbeiter);
ALTER TABLE apflora.tpopmassn DROP COLUMN bearbeiter_old CASCADE;
COMMENT ON COLUMN apflora.tpopmassn.bearbeiter IS 'Zugehöriger Bearbeiter. Fremdschlüssel aus der Tabelle "adresse"';

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- TODO: check if old id was used somewhere. If so: rename that field, add new one and update that
-- TODO: add all views, functions, triggers containing this table to this file
-- TODO: replace all callst to table in views etc.
-- TODO: run migration sql in dev
-- TODO: restart postgrest and test app
-- TODO: CHECK child tables: are they correct?
-- TODO: update js and run this file on server
-- TODO: restart postgrest

DROP TRIGGER IF EXISTS adresse_on_update_set_mut ON apflora.adresse;
DROP FUNCTION IF EXISTS adresse_on_update_set_mut();
CREATE FUNCTION adresse_on_update_set_mut() RETURNS trigger AS $adresse_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$adresse_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER adresse_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.adresse
  FOR EACH ROW EXECUTE PROCEDURE adresse_on_update_set_mut();