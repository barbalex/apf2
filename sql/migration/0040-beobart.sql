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
TODO

-- drop existing indexes
DROP index apflora.apflora."beobart_ApArtId_TaxonomieId_idx";
DROP index apflora.apflora."beobart_BeobArtId_idx";
-- add new
TODO

-- TODO: make sure createTable is correct
-- TODO: rename in sql
-- TODO: rename in js
-- TODO: check if old id was used somewhere. If so: rename that field, add new one and update that
-- TODO: add all views, functions, triggers containing this table to this file
-- TODO: run migration sql in dev
-- TODO: restart postgrest and test app
-- TODO: update js and run this file on server
-- TODO: restart postgrest

ALTER TABLE apflora.beobart RENAME TO apflora.apart;