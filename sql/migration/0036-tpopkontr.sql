ALTER TABLE apflora.tpopkontr RENAME "TPopKontrGuid" TO id;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrId" TO id_old;
ALTER TABLE apflora.tpopkontr RENAME "xxx" TO xxx;

-- change primary key
ALTER TABLE apflora.tpopkontr DROP CONSTRAINT tpopkontr_pkey;
ALTER TABLE apflora.tpopkontr ADD PRIMARY KEY (id);
ALTER TABLE apflora.tpopkontr ALTER COLUMN id_old DROP NOT NULL;
ALTER TABLE apflora.tpopkontr ALTER COLUMN id_old SET DEFAULT null;

-- comments
COMMENT ON COLUMN apflora.tpopkontr.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.tpopkontr.id_old IS 'frühere id';

-- drop existing indexes
DROP index apflora.apflora."tpopkontr_TPopId_idx";
DROP index apflora.apflora."tpopkontr_TPopKontrBearb_idx";
DROP index apflora.apflora."tpopkontr_TPopKontrDatum_idx";
DROP index apflora.apflora."tpopkontr_TPopKontrEntwicklung_idx";
DROP index apflora.apflora."tpopkontr_TPopKontrGuid_idx";
DROP index apflora.apflora."tpopkontr_TPopKontrId_idx";
DROP index apflora.apflora."tpopkontr_TPopKontrIdealBiotopUebereinst_idx";
DROP index apflora.apflora."tpopkontr_TPopKontrJahr_idx";
DROP index apflora.apflora."tpopkontr_TPopKontrTyp_idx";
DROP index apflora.apflora."tpopkontr_ZeitGuid_idx";
-- add new
TODO

-- TODO: make sure createTable is correct
-- TODO: rename in sql
-- TODO: rename in js
-- TODO: check if old id was used somewhere. If so: rename that field, add new one and update that
-- TODO: add all views, functions, triggers containing this table to this file
-- TODO: run migration sql in dev
-- TODO: restart postgrest and test app
-- TODO: update js and run this file on server
-- TODO: restart postgrest

-- drop old fields
ALTER TABLE apflora.tpopkontr DROP COLUMN "TPopKontrGuid_alt";
ALTER TABLE apflora.tpopkontr DROP COLUMN "ZeitGuid_alt";