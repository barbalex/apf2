ALTER TABLE apflora.tpopber ADD COLUMN id UUID UNIQUE DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.tpopber RENAME "TPopBerId" TO id_old;
ALTER TABLE apflora.tpopber RENAME "TPopId" TO tpop_id;
ALTER TABLE apflora.tpopber RENAME "TPopBerJahr" TO jahr;
ALTER TABLE apflora.tpopber RENAME "TPopBerEntwicklung" TO entwicklung;
ALTER TABLE apflora.tpopber RENAME "TPopBerTxt" TO bemerkungen;
ALTER TABLE apflora.tpopber RENAME "MutWann" TO changed;
ALTER TABLE apflora.tpopber RENAME "MutWer" TO changed_by;

COMMENT ON COLUMN apflora.tpopber.id_old IS 'frühere id';

-- change primary key
ALTER TABLE apflora.tpopber DROP CONSTRAINT tpopber_pkey;
ALTER TABLE apflora.tpopber ADD PRIMARY KEY (id);

-- TODO: rename in sql
-- TODO: check if old id was used somewhere. If so: rename that field, add new one and update that
-- TODO: add all views, functions, triggers with tpopkontrzaehl to this file
-- TODO: rename in js
-- TODO: test app
-- TODO: update js and run this file on server