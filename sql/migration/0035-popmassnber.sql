ALTER TABLE apflora.popmassnber ADD COLUMN id UUID UNIQUE DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.popmassnber RENAME "PopMassnBerId" TO id_old;
ALTER TABLE apflora.popmassnber RENAME "PopId" TO pop_id;
ALTER TABLE apflora.popmassnber RENAME "PopMassnBerJahr" TO jahr;
ALTER TABLE apflora.popmassnber RENAME "PopMassnBerErfolgsbeurteilung" TO beurteilung;
ALTER TABLE apflora.popmassnber RENAME "PopMassnBerTxt" TO bemerkungen;
ALTER TABLE apflora.popmassnber RENAME "MutWann" TO changed;
ALTER TABLE apflora.popmassnber RENAME "MutWer" TO changed_by;

COMMENT ON COLUMN apflora.popmassnber.id_old IS 'frühere id';

-- change primary key
ALTER TABLE apflora.popmassnber DROP CONSTRAINT popmassnber_pkey;
ALTER TABLE apflora.popmassnber ADD PRIMARY KEY (id);