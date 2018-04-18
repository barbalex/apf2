
ALTER TABLE apflora.beob_quelle RENAME TO beob_quelle_werte;
ALTER TABLE apflora.beob_quelle_werte RENAME id TO id_old;
ALTER TABLE apflora.beob_quelle_werte ADD COLUMN id UUID UNIQUE DEFAULT uuid_generate_v1mc();

-- change primary key
ALTER TABLE apflora.beob_quelle_werte DROP CONSTRAINT beob_quelle_pkey;
ALTER TABLE apflora.beob_quelle_werte ADD PRIMARY KEY (id);
ALTER TABLE apflora.beob_quelle_werte ALTER COLUMN id_old DROP NOT NULL;
ALTER TABLE apflora.beob_quelle_werte ALTER COLUMN id_old SET DEFAULT null;

-- drop existing indexes
DROP index apflora.apflora."beob_quelle_id_idx";
-- add new
CREATE INDEX ON apflora.beob_quelle_werte USING btree (id);

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- done: run migration sql in dev
-- TODO: restart postgrest and test app
-- TODO: update js and run this file on server
-- TODO: restart postgrest

-- change beob
ALTER TABLE apflora.beob RENAME quelle_id TO quelle_id_old;
DROP index IF EXISTS apflora.apflora."beob_quelle_id_idx";
ALTER TABLE apflora.beob ADD COLUMN quelle_id UUID DEFAULT NULL REFERENCES apflora.beob_quelle_werte (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE apflora.beob DROP CONSTRAINT IF EXISTS beob_quelle_id_fkey;
UPDATE apflora.beob SET quelle_id = (
  SELECT id FROM apflora.beob_quelle_werte WHERE id_old = apflora.beob.quelle_id_old
) WHERE quelle_id_old IS NOT NULL;
CREATE INDEX ON apflora.beob USING btree (quelle_id);
ALTER TABLE apflora.beob DROP COLUMN quelle_id_old CASCADE;
COMMENT ON COLUMN apflora.beob.quelle_id IS 'Zugehörige Beobachtungs-Quelle. Fremdschlüssel aus der Tabelle "beob_quelle_werte"';