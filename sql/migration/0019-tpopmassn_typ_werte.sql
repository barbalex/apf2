ALTER TABLE apflora.tpopmassn_typ_werte ADD COLUMN id UUID DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.tpopmassn_typ_werte DROP CONSTRAINT tpopmassn_typ_werte_pkey CASCADE;
ALTER TABLE apflora.tpopmassn_typ_werte ADD PRIMARY KEY (id);
ALTER TABLE apflora.tpopmassn_typ_werte ALTER COLUMN code DROP NOT NULL;
ALTER TABLE apflora.tpopmassn_typ_werte ALTER COLUMN code SET DEFAULT null;
ALTER TABLE apflora.tpopmassn_typ_werte ADD UNIQUE (code);
CREATE INDEX ON apflora.tpopmassn_typ_werte USING btree (id);
COMMENT ON COLUMN apflora.tpopmassn_typ_werte.id IS 'Primärschlüssel';

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- done: run migration sql in dev
-- done: restart postgrest and test app
-- TODO: update js and run this file on server
-- TODO: restart postgrest