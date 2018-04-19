ALTER TABLE apflora.gemeinde ADD COLUMN id UUID UNIQUE DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.gemeinde RENAME "BfsNr" TO id_old;
ALTER TABLE apflora.gemeinde RENAME "GmdName" TO name;

-- change primary key
ALTER TABLE apflora.gemeinde DROP CONSTRAINT gemeinde_pkey cascade;
ALTER TABLE apflora.gemeinde ADD PRIMARY KEY (id);
ALTER TABLE apflora.gemeinde ALTER COLUMN id_old DROP NOT NULL;
ALTER TABLE apflora.gemeinde ALTER COLUMN id_old SET DEFAULT null;

-- drop existing indexes
DROP index IF EXISTS apflora.apflora."gemeinde_BfsNr_idx";
DROP index IF EXISTS apflora.apflora."gemeinde_GmdName_idx";
-- don't need new

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: add all views, functions, triggers containing this table to this file
-- TODO: run migration sql in dev
-- TODO: restart postgrest and test app
-- TODO: update js and run this file on server
-- TODO: restart postgrest