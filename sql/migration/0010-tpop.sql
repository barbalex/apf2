ALTER TABLE apflora.tpop RENAME "TPopGuid" TO id;
ALTER TABLE apflora.tpop ADD UNIQUE (id);
ALTER TABLE apflora.tpop RENAME "TPopId" TO id_old;
ALTER TABLE apflora.tpop RENAME "PopId" TO pop_id;
ALTER TABLE apflora.tpop RENAME "TPopNr" TO nr;
ALTER TABLE apflora.tpop RENAME "TPopGemeinde" TO gemeinde;
ALTER TABLE apflora.tpop RENAME "TPopFlurname" TO flurname;
ALTER TABLE apflora.tpop RENAME "TPopXKoord" TO x;
ALTER TABLE apflora.tpop RENAME "TPopYKoord" TO y;
ALTER TABLE apflora.tpop RENAME "TPopRadius" TO radius;
ALTER TABLE apflora.tpop RENAME "TPopHoehe" TO hoehe;
ALTER TABLE apflora.tpop RENAME "TPopExposition" TO exposition;
ALTER TABLE apflora.tpop RENAME "TPopKlima" TO klima;
ALTER TABLE apflora.tpop RENAME "TPopNeigung" TO neigung;
ALTER TABLE apflora.tpop RENAME "TPopBeschr" TO beschreibung;
ALTER TABLE apflora.tpop RENAME "TPopKatNr" TO kataster_nr;
ALTER TABLE apflora.tpop RENAME "TPopHerkunft" TO status;
ALTER TABLE apflora.tpop RENAME "TPopHerkunftUnklar" TO status_unklar;
ALTER TABLE apflora.tpop RENAME "TPopHerkunftUnklarBegruendung" TO status_unklar_begruendung;
ALTER TABLE apflora.tpop RENAME "TPopApBerichtRelevant" TO apber_relevant;
ALTER TABLE apflora.tpop RENAME "TPopBekanntSeit" TO bekannt_seit;
ALTER TABLE apflora.tpop RENAME "TPopEigen" TO eigentuemer;
ALTER TABLE apflora.tpop RENAME "TPopKontakt" TO kontakt;
ALTER TABLE apflora.tpop RENAME "TPopNutzungszone" TO nutzungszone;
ALTER TABLE apflora.tpop RENAME "TPopBewirtschafterIn" TO bewirtschafter;
ALTER TABLE apflora.tpop RENAME "TPopBewirtschaftung" TO bewirtschaftung;
ALTER TABLE apflora.tpop RENAME "TPopTxt" TO bemerkungen;
ALTER TABLE apflora.tpop DROP COLUMN "TPopGuid_alt";
ALTER TABLE apflora.tpop RENAME "MutWann" TO changed;
ALTER TABLE apflora.tpop RENAME "MutWer" TO changed_by;

COMMENT ON COLUMN apflora.tpop.id_old IS 'frühere id';

-- TODO: update id in dependent tables
-- dependent tables:
-- - tpopbeob
-- - tpopber
-- - tpopmassn
-- - tpopmassnber
-- - tpopkontr