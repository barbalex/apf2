ALTER TABLE apflora.ap_bearbstand_werte RENAME "DomainCode" TO code;
ALTER TABLE apflora.ap_bearbstand_werte RENAME "DomainTxt" TO text;
ALTER TABLE apflora.ap_bearbstand_werte RENAME "DomainOrd" TO sort;
ALTER TABLE apflora.ap_bearbstand_werte RENAME "MutWann" TO changed;
ALTER TABLE apflora.ap_bearbstand_werte RENAME "MutWer" TO changed_by;

ALTER TABLE apflora.ap_bearbstand_werte ADD COLUMN id UUID DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.ap_bearbstand_werte DROP CONSTRAINT ap_bearbstand_werte_pkey CASCADE;
ALTER TABLE apflora.ap_bearbstand_werte ADD PRIMARY KEY (id);
ALTER TABLE apflora.ap_bearbstand_werte ALTER COLUMN code DROP NOT NULL;
ALTER TABLE apflora.ap_bearbstand_werte ALTER COLUMN code SET DEFAULT null;
ALTER TABLE apflora.ap_bearbstand_werte ADD UNIQUE (code);
CREATE INDEX ON apflora.ap_bearbstand_werte USING btree (id);
COMMENT ON COLUMN apflora.ap_bearbstand_werte.id IS 'Primärschlüssel';

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- done: run migration sql in dev
-- done: restart postgrest and test app
-- done: update js and run this file on server
-- done: restart postgrest

DROP TRIGGER IF EXISTS ap_bearbstand_werte_on_update_set_mut ON apflora.ap_bearbstand_werte;
DROP FUNCTION IF EXISTS ap_bearbstand_werte_on_update_set_mut();
CREATE FUNCTION ap_bearbstand_werte_on_update_set_mut() RETURNS trigger AS $ap_bearbstand_werte_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$ap_bearbstand_werte_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER ap_bearbstand_werte_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.ap_bearbstand_werte
  FOR EACH ROW EXECUTE PROCEDURE ap_bearbstand_werte_on_update_set_mut();

-- add missing constraints:
ALTER TABLE apflora.ap 
   ADD CONSTRAINT ap_fk_ap_bearbstand_werte
   FOREIGN KEY ("ApStatus") 
   REFERENCES apflora.ap_bearbstand_werte (code) ON DELETE SET NULL ON UPDATE CASCADE;