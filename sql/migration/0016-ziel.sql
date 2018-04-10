ALTER TABLE apflora.ziel RENAME "ZielBerId" TO id_old;
ALTER TABLE apflora.ziel ADD COLUMN id UUID DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.ziel RENAME "ZielId" TO ziel_id;

-- change primary key
ALTER TABLE apflora.ziel DROP CONSTRAINT ziel_pkey;
ALTER TABLE apflora.ziel ADD PRIMARY KEY (id);
ALTER TABLE apflora.ziel ALTER COLUMN id_old DROP NOT NULL;
ALTER TABLE apflora.ziel ALTER COLUMN id_old SET DEFAULT null;

-- comments
COMMENT ON COLUMN apflora.ziel.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.ziel.id_old IS 'frühere id';

-- drop existing indexes
DROP index apflora.apflora."ziel_ApArtId_idx";
DROP index apflora.apflora."ziel_ZielId_idx";
DROP index apflora.apflora."ziel_ZielJahr_idx";
DROP index apflora.apflora."ziel_ZielTyp_idx";
-- add new
CREATE INDEX ON apflora.ziel USING btree (id);

-- TODO: make sure createTable is correct
-- TODO: rename in sql
-- TODO: rename in js
-- TODO: check if old id was used somewhere. If so: rename that field, add new one and update that
-- TODO: add all views, functions, triggers containing this table to this file
-- TODO: run migration sql in dev
-- TODO: restart postgrest and test app
-- TODO: update js and run this file on server
-- TODO: restart postgrest