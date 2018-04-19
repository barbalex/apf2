ALTER TABLE apflora.gemeinde ADD COLUMN id UUID UNIQUE DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.gemeinde RENAME "GmdName" TO name;

-- change primary key
ALTER TABLE apflora.gemeinde DROP CONSTRAINT gemeinde_pkey cascade;
ALTER TABLE apflora.gemeinde ADD PRIMARY KEY (id);

-- drop existing indexes
DROP index IF EXISTS apflora.apflora."gemeinde_BfsNr_idx";
DROP index IF EXISTS apflora.apflora."gemeinde_GmdName_idx";
-- don't need new
ALTER TABLE apflora.gemeinde drop COLUMN "BfsNr" cascade;

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: add all views, functions, triggers containing this table to this file
-- done: run migration sql in dev
-- done: restart postgrest and test app
-- TODO: update js and run this file on server
-- TODO: restart postgrest