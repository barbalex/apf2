ALTER TABLE apflora.ap_erfbeurtkrit_werte RENAME "DomainCode" TO code;
ALTER TABLE apflora.ap_erfbeurtkrit_werte RENAME "DomainTxt" TO text;
ALTER TABLE apflora.ap_erfbeurtkrit_werte RENAME "DomainOrd" TO sort;
ALTER TABLE apflora.ap_erfbeurtkrit_werte RENAME "MutWann" TO changed;
ALTER TABLE apflora.ap_erfbeurtkrit_werte RENAME "MutWer" TO changed_by;

ALTER TABLE apflora.ap_erfbeurtkrit_werte ADD COLUMN id UUID DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.ap_erfbeurtkrit_werte DROP CONSTRAINT ap_erfbeurtkrit_werte_pkey CASCADE;
ALTER TABLE apflora.ap_erfbeurtkrit_werte ADD PRIMARY KEY (id);
ALTER TABLE apflora.ap_erfbeurtkrit_werte ALTER COLUMN code DROP NOT NULL;
ALTER TABLE apflora.ap_erfbeurtkrit_werte ALTER COLUMN code SET DEFAULT null;
ALTER TABLE apflora.ap_erfbeurtkrit_werte ADD UNIQUE (code);
CREATE INDEX ON apflora.ap_erfbeurtkrit_werte USING btree (id);
COMMENT ON COLUMN apflora.ap_erfbeurtkrit_werte.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.erfkrit.erfolg IS 'Wie gut werden die Ziele erreicht? Auswahl aus der Tabelle "ap_erfkrit_werte"';

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- done: run migration sql in dev
-- done: restart postgrest and test app
-- done: update js and run this file on server
-- done: restart postgrest