ALTER TABLE apflora.ap RENAME "ApGuid" TO id;
ALTER TABLE apflora.ap ADD UNIQUE (id);
ALTER TABLE apflora.ap RENAME "ApArtId" TO id_old;
ALTER TABLE apflora.ap ADD COLUMN art UUID UNIQUE DEFAULT NULL;
ALTER TABLE apflora.ap RENAME "ApStatus" TO xxx;
ALTER TABLE apflora.ap RENAME "xxx" TO xxx;
ALTER TABLE apflora.ap RENAME "xxx" TO xxx;
ALTER TABLE apflora.ap RENAME "xxx" TO xxx;
ALTER TABLE apflora.ap RENAME "xxx" TO xxx;
ALTER TABLE apflora.ap RENAME "xxx" TO xxx;
ALTER TABLE apflora.ap RENAME "xxx" TO xxx;
ALTER TABLE apflora.ap RENAME "xxx" TO xxx;
ALTER TABLE apflora.ap RENAME "xxx" TO xxx;

-- add data from ApArtId to art
UPDATE apflora.ap SET art = (
  SELECT id FROM apflora.ae_eigenschaften WHERE taxid = apflora.ap.id_old
) WHERE id_old IS NOT NULL;

-- change primary key
ALTER TABLE apflora.ap DROP CONSTRAINT pop_pkey cascade;
ALTER TABLE apflora.ap ADD PRIMARY KEY (id);
ALTER TABLE apflora.ap ALTER COLUMN id_old DROP NOT NULL;
ALTER TABLE apflora.ap ALTER COLUMN id_old SET DEFAULT null;

-- comments
TODO

-- drop existing indexes
DROP index IF EXISTS apflora.apflora."ap_ApArtId_idx";
DROP index IF EXISTS apflora.apflora."ap_ApBearb_idx";
DROP index IF EXISTS apflora.apflora."ap_ApGuid_idx";
DROP index IF EXISTS apflora.apflora."ap_ApStatus_idx";
DROP index IF EXISTS apflora.apflora."ap_ApUmsetzung_idx";
DROP index IF EXISTS apflora.apflora."ap_ProjId_idx";
-- add new
TODO

-- add indexes on dependant tables
CREATE INDEX ON apflora.pop USING btree (ap_id);
CREATE INDEX ON apflora.popber USING btree (pop_id);
CREATE INDEX ON apflora.popmassnber USING btree (pop_id);

-- change pop
ALTER TABLE apflora.pop RENAME ap_id TO ap_id_old;
DROP index IF EXISTS apflora.apflora."pop_ap_id_idx";
ALTER TABLE apflora.pop ADD COLUMN ap_id UUID DEFAULT NULL REFERENCES apflora.ap (id) ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX ON apflora.pop USING btree (ap_id);
UPDATE apflora.pop SET ap_id = (
  SELECT id FROM apflora.ap WHERE id_old = apflora.pop.ap_id_old
) WHERE ap_id_old IS NOT NULL;
ALTER TABLE apflora.pop DROP COLUMN ap_id_old CASCADE;
COMMENT ON COLUMN apflora.pop.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';

-- TODO: make sure createTable is correct
-- TODO: rename in sql
-- TODO: rename in js
-- TODO: check if old id was used somewhere. If so: rename that field, add new one and update that
-- TODO: add all views, functions, triggers containing this table to this file
-- TODO: run migration sql in dev
-- TODO: restart postgrest and test app
-- TODO: special ap functions work?
-- TODO: CHECK child tables: are they correct?
-- TODO: update js and run this file on server
-- TODO: restart postgrest