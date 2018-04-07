ALTER TABLE apflora.tpopmassnber ADD COLUMN id UUID UNIQUE DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.tpopmassnber RENAME "TPopMassnBerId" TO id_old;
ALTER TABLE apflora.tpopmassnber RENAME "TPopId" TO tpop_id;
ALTER TABLE apflora.tpopmassnber RENAME "TPopMassnBerJahr" TO jahr;
ALTER TABLE apflora.tpopmassnber RENAME "TPopMassnBerErfolgsbeurteilung" TO beurteilung;
ALTER TABLE apflora.tpopmassnber RENAME "TPopMassnBerTxt" TO bemerkungen;
ALTER TABLE apflora.tpopmassnber RENAME "MutWann" TO changed;
ALTER TABLE apflora.tpopmassnber RENAME "MutWer" TO changed_by;

COMMENT ON COLUMN apflora.tpopmassnber.id_old IS 'frühere id';