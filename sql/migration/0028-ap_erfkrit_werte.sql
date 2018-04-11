ALTER TABLE apflora.ap_erfkrit_werte RENAME "BeurteilId" TO code;
ALTER TABLE apflora.ap_erfkrit_werte RENAME "BeurteilTxt" TO text;
ALTER TABLE apflora.ap_erfkrit_werte RENAME "BeurteilOrd" TO sort;
ALTER TABLE apflora.ap_erfkrit_werte RENAME "MutWann" TO changed;
ALTER TABLE apflora.ap_erfkrit_werte RENAME "MutWer" TO changed_by;

ALTER TABLE apflora.ap_erfkrit_werte ADD COLUMN id UUID DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.ap_erfkrit_werte DROP CONSTRAINT ap_erfkrit_werte_pkey CASCADE;
ALTER TABLE apflora.ap_erfkrit_werte ADD PRIMARY KEY (id);
ALTER TABLE apflora.ap_erfkrit_werte ALTER COLUMN code DROP NOT NULL;
ALTER TABLE apflora.ap_erfkrit_werte ALTER COLUMN code SET DEFAULT null;
ALTER TABLE apflora.ap_erfkrit_werte ADD UNIQUE (code);
CREATE INDEX ON apflora.ap_erfkrit_werte USING btree (id);
COMMENT ON COLUMN apflora.ap_erfkrit_werte.id IS 'Primärschlüssel';

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- done: run migration sql in dev
-- TODO: restart postgrest and test app
-- TODO: update js and run this file on server
-- TODO: restart postgrest

DROP TRIGGER IF EXISTS ap_erfkrit_werte_on_update_set_mut ON apflora.ap_erfkrit_werte;
DROP FUNCTION IF EXISTS ap_erfkrit_werte_on_update_set_mut();
CREATE FUNCTION ap_erfkrit_werte_on_update_set_mut() RETURNS trigger AS $ap_erfkrit_werte_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$ap_erfkrit_werte_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER ap_erfkrit_werte_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.ap_erfkrit_werte
  FOR EACH ROW EXECUTE PROCEDURE ap_erfkrit_werte_on_update_set_mut();

-- add missing constraints:
ALTER TABLE apflora.apber 
   ADD CONSTRAINT apber_fk_ap_erfkrit_werte
   FOREIGN KEY ("JBerBeurteilung") 
   REFERENCES apflora.ap_erfkrit_werte (code) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE apflora.erfkrit 
   ADD CONSTRAINT erfkrit_fk_ap_erfkrit_werte
   FOREIGN KEY (erfolg) 
   REFERENCES apflora.ap_erfkrit_werte (code) ON DELETE SET NULL ON UPDATE CASCADE;