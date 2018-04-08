ALTER TABLE apflora.popber ADD COLUMN id UUID UNIQUE DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.popber RENAME "PopBerId" TO id_old;
ALTER TABLE apflora.popber RENAME "PopId" TO tpop_id;
ALTER TABLE apflora.popber RENAME "PopBerJahr" TO jahr;
ALTER TABLE apflora.popber RENAME "PopBerEntwicklung" TO entwicklung;
ALTER TABLE apflora.popber RENAME "PopBerTxt" TO bemerkungen;
ALTER TABLE apflora.popber RENAME "MutWann" TO changed;
ALTER TABLE apflora.popber RENAME "MutWer" TO changed_by;

COMMENT ON COLUMN apflora.popber.id_old IS 'frühere id';

-- change primary key
ALTER TABLE apflora.popber DROP CONSTRAINT popber_pkey;
ALTER TABLE apflora.popber ADD PRIMARY KEY (id);