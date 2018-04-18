ALTER TABLE apflora.adresse RENAME "AdrId" TO id_old;
ALTER TABLE apflora.adresse ADD COLUMN id UUID UNIQUE DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.adresse RENAME "AdrName" TO name;
ALTER TABLE apflora.adresse RENAME "AdrAdresse" TO adresse;
ALTER TABLE apflora.adresse RENAME "AdrTel" TO telefon;
ALTER TABLE apflora.adresse RENAME "AdrEmail" TO email;
ALTER TABLE apflora.adresse RENAME "freiwErfko" TO freiw_erfko;
ALTER TABLE apflora.adresse RENAME "MutWann" TO changed;
ALTER TABLE apflora.adresse RENAME "MutWer" TO changed_by;
ALTER TABLE apflora.adresse RENAME "EvabIdPerson" TO evab_id_person;

-- change primary key
ALTER TABLE apflora.adresse DROP CONSTRAINT adresse_pkey cascade;
ALTER TABLE apflora.adresse ADD PRIMARY KEY (id);
ALTER TABLE apflora.adresse ALTER COLUMN id_old DROP NOT NULL;
ALTER TABLE apflora.adresse ALTER COLUMN id_old SET DEFAULT null;

-- comments
COMMENT ON COLUMN apflora.adresse.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.adresse.id_old IS 'Frühere id';

-- drop existing indexes
DROP index IF EXISTS apflora.apflora."adresse_AdrId_idx";
DROP index IF EXISTS apflora.apflora."adresse_AdrName_idx";
-- add new
CREATE INDEX ON apflora.adresse USING btree (id);

-- change ap
DROP index IF EXISTS apflora.apflora."ap_bearbeiter_idx";
DROP constraint IF EXISTS apflora.apflora.ap_fk_adresse;
ALTER TABLE apflora.ap ADD CONSTRAINT ap_fk_adresse FOREIGN KEY (bearbeiter) 
  REFERENCES apflora.adresse(id) ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX ON apflora.ap USING btree (bearbeiter);

-- TODO: make sure createTable is correct
-- TODO: rename in sql
-- TODO: rename in js
-- TODO: check if old id was used somewhere. If so: rename that field, add new one and update that
-- TODO: add all views, functions, triggers containing this table to this file
-- TODO: replace all callst to table in views etc.
-- TODO: run migration sql in dev
-- TODO: restart postgrest and test app
-- TODO: CHECK child tables: are they correct?
-- TODO: update js and run this file on server
-- TODO: restart postgrest