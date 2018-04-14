ALTER TABLE apflora.ap RENAME "ApGuid" TO id;
ALTER TABLE apflora.ap ADD UNIQUE (id);
ALTER TABLE apflora.ap RENAME "ApArtId" TO id_old;
ALTER TABLE apflora.ap ADD COLUMN art UUID UNIQUE DEFAULT NULL;
ALTER TABLE apflora.ap RENAME "ApStatus" TO bearbeitung;
ALTER TABLE apflora.ap RENAME "ApJahr" TO jahr;
ALTER TABLE apflora.ap RENAME "ApUmsetzung" TO umsetzung;
ALTER TABLE apflora.ap RENAME "ApBearb" TO bearbeiter;
ALTER TABLE apflora.ap RENAME "ProjId" TO proj_id;
ALTER TABLE apflora.ap RENAME "MutWann" TO changed;
ALTER TABLE apflora.ap RENAME "MutWer" TO changed_by;

ALTER TABLE apflora.ap DROP COLUMN "ApArtwert" cascade;
ALTER TABLE apflora.ap DROP COLUMN "ApGuid_alt" cascade;

-- add data from ApArtId to art
UPDATE apflora.ap SET art = (
  SELECT id FROM apflora.ae_eigenschaften WHERE taxid = apflora.ap.id_old
) WHERE id_old IS NOT NULL;

-- change primary key
ALTER TABLE apflora.ap DROP CONSTRAINT ap_pkey cascade;
ALTER TABLE apflora.ap ADD PRIMARY KEY (id);
ALTER TABLE apflora.ap ALTER COLUMN id_old DROP NOT NULL;
ALTER TABLE apflora.ap ALTER COLUMN id_old SET DEFAULT null;

-- comments
COMMENT ON COLUMN apflora.ap.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.ap.id_old IS 'Frühere id. = SISF2-Nr';
COMMENT ON COLUMN apflora.ap.proj_id IS 'Zugehöriges Projekt. Fremdschlüssel aus der Tabelle "proj"';
COMMENT ON COLUMN apflora.ap.art IS 'Namensgebende Art. Unter ihrem Namen bzw. Nummer werden Kontrollen an InfoFlora geliefert';
COMMENT ON COLUMN apflora.ap.bearbeitung IS 'In welchem Bearbeitungsstand befindet sich der AP?';
COMMENT ON COLUMN apflora.ap.jahr IS 'Wann wurde mit der Umsetzung des Aktionsplans begonnen?';
COMMENT ON COLUMN apflora.ap.umsetzung IS 'In welchem Umsetzungsstand befindet sich der AP?';
COMMENT ON COLUMN apflora.ap.bearbeiter IS 'Verantwortliche(r) für die Art';
COMMENT ON COLUMN apflora.ap.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ap.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- drop existing indexes
DROP index IF EXISTS apflora.apflora."ap_ApArtId_idx";
DROP index IF EXISTS apflora.apflora."ap_ApBearb_idx";
DROP index IF EXISTS apflora.apflora."ap_ApGuid_idx";
DROP index IF EXISTS apflora.apflora."ap_ApStatus_idx";
DROP index IF EXISTS apflora.apflora."ap_ApUmsetzung_idx";
DROP index IF EXISTS apflora.apflora."ap_ProjId_idx";
-- add new
CREATE INDEX ON apflora.ap USING btree (id);
CREATE INDEX ON apflora.ap USING btree (proj_id);
CREATE INDEX ON apflora.ap USING btree (bearbeitung);
CREATE INDEX ON apflora.ap USING btree (jahr);
CREATE INDEX ON apflora.ap USING btree (umsetzung);
CREATE INDEX ON apflora.ap USING btree (bearbeiter);

-- add indexes on dependant tables
CREATE INDEX ON apflora.pop USING btree (ap_id);
CREATE INDEX ON apflora.popber USING btree (pop_id);
CREATE INDEX ON apflora.popmassnber USING btree (pop_id);

-- change pop
ALTER TABLE apflora.pop RENAME ap_id TO ap_id_old;
DROP index IF EXISTS apflora.apflora."pop_ap_id_idx";
ALTER TABLE apflora.pop ADD COLUMN ap_id UUID DEFAULT NULL REFERENCES apflora.ap (id) ON DELETE CASCADE ON UPDATE CASCADE;
UPDATE apflora.pop SET ap_id = (
  SELECT id FROM apflora.ap WHERE id_old = apflora.pop.ap_id_old
) WHERE ap_id_old IS NOT NULL;
CREATE INDEX ON apflora.pop USING btree (ap_id);
ALTER TABLE apflora.pop DROP COLUMN ap_id_old CASCADE;
COMMENT ON COLUMN apflora.pop.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';

-- change apber
ALTER TABLE apflora.apber RENAME ap_id TO ap_id_old;
DROP index IF EXISTS apflora.apflora."apber_ap_id_idx";
ALTER TABLE apflora.apber ADD COLUMN ap_id UUID DEFAULT NULL REFERENCES apflora.ap (id) ON DELETE CASCADE ON UPDATE CASCADE;
UPDATE apflora.apber SET ap_id = (
  SELECT id FROM apflora.ap WHERE id_old = apflora.apber.ap_id_old
) WHERE ap_id_old IS NOT NULL;
CREATE INDEX ON apflora.apber USING btree (ap_id);
ALTER TABLE apflora.apber DROP COLUMN ap_id_old CASCADE;
COMMENT ON COLUMN apflora.apber.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';

-- change assozart
ALTER TABLE apflora.assozart RENAME ap_id TO ap_id_old;
DROP index IF EXISTS apflora.apflora."assozart_ap_id_idx";
ALTER TABLE apflora.assozart ADD COLUMN ap_id UUID DEFAULT NULL REFERENCES apflora.ap (id) ON DELETE CASCADE ON UPDATE CASCADE;
UPDATE apflora.assozart SET ap_id = (
  SELECT id FROM apflora.ap WHERE id_old = apflora.assozart.ap_id_old
) WHERE ap_id_old IS NOT NULL;
CREATE INDEX ON apflora.assozart USING btree (ap_id);
ALTER TABLE apflora.assozart DROP COLUMN ap_id_old CASCADE;
COMMENT ON COLUMN apflora.assozart.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';

-- change ber

-- change erfkrit

-- change idealbiotop

-- change ziel

-- change apart

-- TODO: make sure createTable is correct
-- TODO: rename in sql
-- TODO: rename in js
-- TODO: check if old id was used somewhere. If so: rename that field, add new one and update that
-- TODO: add all views, functions, triggers containing this table to this file
-- TODO: run migration sql in dev
-- TODO: restart postgrest and test app
-- TODO: special ap functions work?
-- TODO: CHECK child tables: are they correct?
-- TODO: check that unique && default 0 from id_old is gone
-- TODO: update js and run this file on server
-- TODO: restart postgrest
