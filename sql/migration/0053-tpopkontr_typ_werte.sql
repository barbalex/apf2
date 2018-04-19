ALTER TABLE apflora.tpopkontr_typ_werte RENAME "DomainCode" TO code;
ALTER TABLE apflora.tpopkontr_typ_werte RENAME "DomainTxt" TO text;
ALTER TABLE apflora.tpopkontr_typ_werte RENAME "DomainOrd" TO sort;
ALTER TABLE apflora.tpopkontr_typ_werte RENAME "MutWann" TO changed;
ALTER TABLE apflora.tpopkontr_typ_werte RENAME "MutWer" TO changed_by;

ALTER TABLE apflora.tpopkontr_typ_werte ADD COLUMN id UUID DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.tpopkontr_typ_werte DROP CONSTRAINT tpopkontr_typ_werte_pkey CASCADE;
ALTER TABLE apflora.tpopkontr_typ_werte ADD PRIMARY KEY (id);
ALTER TABLE apflora.tpopkontr_typ_werte ALTER COLUMN code DROP NOT NULL;
ALTER TABLE apflora.tpopkontr_typ_werte ALTER COLUMN code SET DEFAULT null;
ALTER TABLE apflora.tpopkontr_typ_werte ADD UNIQUE (code);
CREATE INDEX ON apflora.tpopkontr_typ_werte USING btree (id);
COMMENT ON COLUMN apflora.tpopkontr_typ_werte.id IS 'Primärschlüssel';
ALTER TABLE apflora.tpopkontr_typ_werte ADD UNIQUE (text);

alter table apflora.tpopkontr 
   ADD CONSTRAINT tpopkontr_fk_tpopkontr_typ_werte
   FOREIGN KEY (typ) 
   REFERENCES apflora.tpopkontr_typ_werte(text) on delete set null on update cascade;

DROP index IF EXISTS apflora.apflora."tpopkontr_typ_werte_DomainCode_idx";
DROP index IF EXISTS apflora.apflora."tpopkontr_typ_werte_DomainOrd_idx";
DROP index IF EXISTS apflora.apflora."tpopkontr_typ_werte_DomainTxt_idx";

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- done: run migration sql in dev
-- TODO: restart postgrest and test app
-- TODO: update js and run this file on server
-- TODO: restart postgrest

DROP TRIGGER IF EXISTS tpopkontr_typ_werte_on_update_set_mut ON apflora.tpopkontr_typ_werte;
DROP FUNCTION IF EXISTS tpopkontr_typ_werte_on_update_set_mut();
CREATE FUNCTION tpopkontr_typ_werte_on_update_set_mut() RETURNS trigger AS $tpopkontr_typ_werte_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$tpopkontr_typ_werte_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER tpopkontr_typ_werte_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.tpopkontr_typ_werte
  FOR EACH ROW EXECUTE PROCEDURE tpopkontr_typ_werte_on_update_set_mut();