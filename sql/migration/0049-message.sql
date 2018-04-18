ALTER TABLE apflora.message RENAME id TO id_old;
ALTER TABLE apflora.message ADD COLUMN id UUID UNIQUE DEFAULT uuid_generate_v1mc();

-- change primary key
ALTER TABLE apflora.message DROP CONSTRAINT message_pkey cascade;
ALTER TABLE apflora.message ADD PRIMARY KEY (id);
ALTER TABLE apflora.message ALTER COLUMN id_old DROP NOT NULL;
ALTER TABLE apflora.message ALTER COLUMN id_old SET DEFAULT null;

-- drop existing index
DROP index apflora.apflora."message_id_idx";
-- add new
CREATE INDEX ON apflora.message USING btree (id);

-- change usermessage
ALTER TABLE apflora.usermessage RENAME message_id TO message_id_old;
DROP index IF EXISTS apflora.apflora."usermessage_message_id_idx";
ALTER TABLE apflora.usermessage ADD COLUMN message_id UUID DEFAULT NULL REFERENCES apflora.message (id) ON DELETE CASCADE ON UPDATE CASCADE;
UPDATE apflora.usermessage SET message_id = (
  SELECT id FROM apflora.message WHERE id_old = apflora.usermessage.message_id_old
) WHERE message_id_old IS NOT NULL;
CREATE INDEX ON apflora.usermessage USING btree (message_id);
ALTER TABLE apflora.usermessage DROP COLUMN message_id_old CASCADE;
COMMENT ON COLUMN apflora.usermessage.message_id IS 'Zugehörige Nachricht. Fremdschlüssel aus der Tabelle "message"';

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- done: run migration sql in dev
-- TODO: restart postgrest and test app
-- TODO: special ap functions work?
-- TODO: CHECK child tables: are they correct?
-- TODO: check that unique && default 0 from id_old is gone
-- TODO: update js and run this file on server
-- TODO: restart postgrest