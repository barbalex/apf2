ALTER TABLE apflora.tpopmassn_erfbeurt_werte ADD COLUMN id UUID DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.tpopmassn_erfbeurt_werte DROP CONSTRAINT tpopmassn_erfbeurt_werte_pkey CASCADE;
ALTER TABLE apflora.tpopmassn_erfbeurt_werte ADD PRIMARY KEY (id);
ALTER TABLE apflora.tpopmassn_erfbeurt_werte ALTER COLUMN code DROP NOT NULL;
ALTER TABLE apflora.tpopmassn_erfbeurt_werte ALTER COLUMN code SET DEFAULT null;
ALTER TABLE apflora.tpopmassn_erfbeurt_werte ADD UNIQUE (code);
CREATE INDEX ON apflora.tpopmassn_erfbeurt_werte USING btree (id);
COMMENT ON COLUMN apflora.tpopmassn_erfbeurt_werte.id IS 'Primärschlüssel';

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- done: run migration sql in dev
-- done: restart postgrest and test app
-- done: update js and run this file on server
-- done: restart postgrest