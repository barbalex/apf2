ALTER TABLE apflora.apberuebersicht RENAME id TO id_old;
ALTER TABLE apflora.apberuebersicht ADD COLUMN id UUID UNIQUE DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.apberuebersicht RENAME "JbuJahr" TO jahr;
ALTER TABLE apflora.apberuebersicht RENAME "JbuBemerkungen" TO bemerkungen;
ALTER TABLE apflora.apberuebersicht RENAME "MutWann" TO changed;
ALTER TABLE apflora.apberuebersicht RENAME "MutWer" TO changed_by;
ALTER TABLE apflora.apberuebersicht RENAME "ProjId" TO proj_id;

COMMENT ON COLUMN apflora.apberuebersicht.id_old IS 'frühere id';

-- drop existing indexes
ALTER TABLE apflora.apberuebersicht DROP index "apberuebersicht_JbuJahr_idx"
ALTER TABLE apflora.apberuebersicht DROP index "apberuebersicht_id_idx"
-- add new
CREATE INDEX ON apflora.apberuebersicht USING btree (id);
CREATE INDEX ON apflora.apberuebersicht USING btree (jahr);
CREATE INDEX ON apflora.apberuebersicht USING btree (proj_id);
ALTER TABLE apflora.apberuebersicht ADD UNIQUE (proj_id, jahr);