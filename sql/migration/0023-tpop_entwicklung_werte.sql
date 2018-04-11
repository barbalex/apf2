ALTER TABLE apflora.tpop_entwicklung_werte RENAME "EntwicklungCode" TO code;
ALTER TABLE apflora.tpop_entwicklung_werte RENAME "EntwicklungTxt" TO text;
ALTER TABLE apflora.tpop_entwicklung_werte RENAME "EntwicklungOrd" TO sort;
ALTER TABLE apflora.tpop_entwicklung_werte RENAME "MutWann" TO changed;
ALTER TABLE apflora.tpop_entwicklung_werte RENAME "MutWer" TO changed_by;

ALTER TABLE apflora.tpop_entwicklung_werte ADD COLUMN id UUID DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.tpop_entwicklung_werte DROP CONSTRAINT tpop_entwicklung_werte_pkey CASCADE;
ALTER TABLE apflora.tpop_entwicklung_werte ADD PRIMARY KEY (id);
ALTER TABLE apflora.tpop_entwicklung_werte ALTER COLUMN code DROP NOT NULL;
ALTER TABLE apflora.tpop_entwicklung_werte ALTER COLUMN code SET DEFAULT null;
ALTER TABLE apflora.tpop_entwicklung_werte ADD UNIQUE (code);
CREATE INDEX ON apflora.tpop_entwicklung_werte USING btree (id);
COMMENT ON COLUMN apflora.tpop_entwicklung_werte.id IS 'Primärschlüssel';

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- done: run migration sql in dev
-- done: restart postgrest and test app
-- TODO: update js and run this file on server
-- TODO: restart postgrest

DROP TRIGGER IF EXISTS tpop_entwicklung_werte_on_update_set_mut ON apflora.tpop_entwicklung_werte;
DROP FUNCTION IF EXISTS tpop_entwicklung_werte_on_update_set_mut();
CREATE FUNCTION tpop_entwicklung_werte_on_update_set_mut() RETURNS trigger AS $tpop_entwicklung_werte_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$tpop_entwicklung_werte_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER tpop_entwicklung_werte_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.tpop_entwicklung_werte
  FOR EACH ROW EXECUTE PROCEDURE tpop_entwicklung_werte_on_update_set_mut();