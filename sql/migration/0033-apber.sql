ALTER TABLE apflora.apber RENAME "JBerId" TO id_old;
ALTER TABLE apflora.apber ADD COLUMN id UUID DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.apber RENAME "ApArtId" TO ap_id;
ALTER TABLE apflora.apber RENAME "JBerJahr" TO jahr;
ALTER TABLE apflora.apber RENAME "JBerSituation" TO situation;
ALTER TABLE apflora.apber RENAME "xxx" TO xxx;
ALTER TABLE apflora.apber RENAME "xxx" TO xxx;
ALTER TABLE apflora.apber RENAME "xxx" TO xxx;
ALTER TABLE apflora.apber RENAME "xxx" TO xxx;
ALTER TABLE apflora.apber RENAME "xxx" TO xxx;
ALTER TABLE apflora.apber RENAME "xxx" TO xxx;
ALTER TABLE apflora.apber RENAME "xxx" TO xxx;
ALTER TABLE apflora.apber RENAME "xxx" TO xxx;
ALTER TABLE apflora.apber RENAME "xxx" TO xxx;
ALTER TABLE apflora.apber RENAME "xxx" TO xxx;
ALTER TABLE apflora.apber RENAME "xxx" TO xxx;
ALTER TABLE apflora.apber RENAME "xxx" TO xxx;
ALTER TABLE apflora.apber RENAME "xxx" TO xxx;
ALTER TABLE apflora.apber RENAME "xxx" TO xxx;
ALTER TABLE apflora.apber RENAME "xxx" TO xxx;
ALTER TABLE apflora.apber RENAME "xxx" TO xxx;

-- change primary key
ALTER TABLE apflora.apber DROP CONSTRAINT apber_pkey CASCADE;
ALTER TABLE apflora.apber ADD PRIMARY KEY (id);
ALTER TABLE apflora.apber ALTER COLUMN id_old DROP NOT NULL;
ALTER TABLE apflora.apber ALTER COLUMN id_old SET DEFAULT null;

-- comments
COMMENT ON COLUMN apflora.apber.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.apber.id_old IS 'frühere id';

-- drop existing indexes
DROP index apflora.apflora."apber_ApArtId_idx";
DROP index apflora.apflora."apber_JBerBearb_idx";
DROP index apflora.apflora."apber_JBerBeurteilung_idx";
DROP index apflora.apflora."apber_JBerId_idx";
DROP index apflora.apflora."apber_JBerJahr_idx";
-- add new
CREATE INDEX ON apflora.apber USING btree (id);

-- TODO: make sure createTable is correct
-- TODO: rename in sql
-- TODO: rename in js
-- TODO: check if old id was used somewhere. If so: rename that field, add new one and update that
-- TODO: add all views, functions, triggers containing this table to this file
-- TODO: run migration sql in dev
-- TODO: restart postgrest and test app
-- TODO: update js and run this file on server
-- TODO: restart postgrest