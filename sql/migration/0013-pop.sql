ALTER TABLE apflora.pop RENAME "PopGuid" TO id;
ALTER TABLE apflora.pop ADD UNIQUE (id);
ALTER TABLE apflora.pop RENAME "PopId" TO id_old;
ALTER TABLE apflora.pop RENAME "ApArtId" TO ap_id;
ALTER TABLE apflora.pop RENAME "PopNr" TO nr;
ALTER TABLE apflora.pop RENAME "PopName" TO name;
ALTER TABLE apflora.pop RENAME "PopHerkunft" TO status;
ALTER TABLE apflora.pop RENAME "PopHerkunftUnklar" TO status_unklar;
ALTER TABLE apflora.pop RENAME "PopHerkunftUnklarBegruendung" TO status_unklar_begruendung;
ALTER TABLE apflora.pop RENAME "PopBekanntSeit" TO bekannt_seit;
ALTER TABLE apflora.pop RENAME "PopXKoord" TO x;
ALTER TABLE apflora.pop RENAME "PopYKoord" TO y;
-- ALTER TABLE apflora.pop DROP COLUMN "PopGuid_alt";
ALTER TABLE apflora.pop RENAME "MutWann" TO changed;
ALTER TABLE apflora.pop RENAME "MutWer" TO changed_by;

COMMENT ON COLUMN apflora.pop.id_old IS 'frühere id';

-- change primary key
ALTER TABLE apflora.pop DROP CONSTRAINT pop_pkey;
ALTER TABLE apflora.pop ADD PRIMARY KEY (id);