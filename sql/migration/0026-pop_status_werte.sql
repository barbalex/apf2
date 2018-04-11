ALTER TABLE apflora.pop_status_werte RENAME "HerkunftId" TO code;
ALTER TABLE apflora.pop_status_werte RENAME "HerkunftTxt" TO text;
ALTER TABLE apflora.pop_status_werte RENAME "HerkunftOrd" TO sort;
ALTER TABLE apflora.pop_status_werte RENAME "MutWann" TO changed;
ALTER TABLE apflora.pop_status_werte RENAME "MutWer" TO changed_by;

ALTER TABLE apflora.pop_status_werte ADD COLUMN id UUID DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.pop_status_werte DROP CONSTRAINT pop_status_werte_pkey CASCADE;
ALTER TABLE apflora.pop_status_werte ADD PRIMARY KEY (id);
ALTER TABLE apflora.pop_status_werte ALTER COLUMN code DROP NOT NULL;
ALTER TABLE apflora.pop_status_werte ALTER COLUMN code SET DEFAULT null;
ALTER TABLE apflora.pop_status_werte ADD UNIQUE (code);
CREATE INDEX ON apflora.pop_status_werte USING btree (id);
COMMENT ON COLUMN apflora.pop_status_werte.id IS 'Primärschlüssel';

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- done: run migration sql in dev
-- done: restart postgrest and test app
-- TODO: update js and run this file on server
-- TODO: restart postgrest

DROP TRIGGER IF EXISTS pop_status_werte_on_update_set_mut ON apflora.pop_status_werte;
DROP FUNCTION IF EXISTS pop_status_werte_on_update_set_mut();
CREATE FUNCTION pop_status_werte_on_update_set_mut() RETURNS trigger AS $pop_status_werte_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$pop_status_werte_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER pop_status_werte_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.pop_status_werte
  FOR EACH ROW EXECUTE PROCEDURE pop_status_werte_on_update_set_mut();

-- add missing constraints:
ALTER TABLE apflora.pop 
   ADD CONSTRAINT pop_fk_pop_status_werte
   FOREIGN KEY ("PopHerkunft") 
   REFERENCES apflora.pop_status_werte (code) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE apflora.tpop 
   ADD CONSTRAINT tpop_fk_tpop_status_werte
   FOREIGN KEY ("TPopHerkunft") 
   REFERENCES apflora.pop_status_werte (code) ON DELETE SET NULL ON UPDATE CASCADE;