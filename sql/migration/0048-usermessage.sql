
ALTER TABLE apflora.usermessage ADD COLUMN id UUID UNIQUE DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.usermessage RENAME "UserName" TO user;
ALTER TABLE apflora.usermessage RENAME "MessageId" TO message_id;

-- change primary key
ALTER TABLE apflora.usermessage ADD PRIMARY KEY (id);

-- drop existing indexes
DROP index IF EXISTS apflora.apflora."usermessage_UserName_MessageId_idx";
-- add new
CREATE INDEX ON apflora.usermessage USING btree (id);
CREATE INDEX ON apflora.usermessage USING btree (user);
CREATE INDEX ON apflora.usermessage USING btree (message_id);

-- done: make sure createTable is correct
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