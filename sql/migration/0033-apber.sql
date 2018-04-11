ALTER TABLE apflora.apber RENAME "JBerId" TO id_old;
ALTER TABLE apflora.apber ADD COLUMN id UUID DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.apber RENAME "ApArtId" TO ap_id;
ALTER TABLE apflora.apber RENAME "JBerJahr" TO jahr;
ALTER TABLE apflora.apber RENAME "JBerSituation" TO situation;
ALTER TABLE apflora.apber RENAME "JBerVergleichVorjahrGesamtziel" TO vergleich_vorjahr_gesamtziel;
ALTER TABLE apflora.apber RENAME "JBerBeurteilung" TO beurteilung;
ALTER TABLE apflora.apber RENAME "JBerVeraenGegenVorjahr" TO veraenderung_zum_vorjahr;
ALTER TABLE apflora.apber RENAME "JBerAnalyse" TO analyse;
ALTER TABLE apflora.apber RENAME "JBerUmsetzung" TO konsequenzen_umsetzung;
ALTER TABLE apflora.apber RENAME "JBerErfko" TO konsequenzen_erfolgskontrolle;
ALTER TABLE apflora.apber RENAME "JBerATxt" TO biotope_neue;
ALTER TABLE apflora.apber RENAME "JBerBTxt" TO biotope_optimieren;
ALTER TABLE apflora.apber RENAME "JBerCTxt" TO massnahmen_optimierung;
ALTER TABLE apflora.apber RENAME "JBerDTxt" TO wirkung_auf_art;
ALTER TABLE apflora.apber RENAME "JBerDatum" TO datum;
ALTER TABLE apflora.apber RENAME "JBerBearb" TO bearbeiter;
ALTER TABLE apflora.apber RENAME "MutWann" TO changed;
ALTER TABLE apflora.apber RENAME "MutWer" TO changed_by;
ALTER TABLE apflora.apber RENAME "JBerCAktivApbearb" TO massnahmen_ap_bearb;
ALTER TABLE apflora.apber RENAME "JBerCVerglAusfPl" TO massnahmen_planung_vs_ausfuehrung;

-- change primary key
ALTER TABLE apflora.apber DROP CONSTRAINT apber_pkey CASCADE;
ALTER TABLE apflora.apber ADD PRIMARY KEY (id);
ALTER TABLE apflora.apber ALTER COLUMN id_old DROP NOT NULL;
ALTER TABLE apflora.apber ALTER COLUMN id_old SET DEFAULT null;

-- comments
COMMENT ON COLUMN apflora.apber.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.apber.id_old IS 'frühere id';
COMMENT ON COLUMN apflora.apber.situation IS 'Offenbar nur bis und mit 2016 benutzt';

-- drop existing indexes
DROP index apflora.apflora."apber_ApArtId_idx";
DROP index apflora.apflora."apber_JBerBearb_idx";
DROP index apflora.apflora."apber_JBerBeurteilung_idx";
DROP index apflora.apflora."apber_JBerId_idx";
DROP index apflora.apflora."apber_JBerJahr_idx";
-- add new
CREATE INDEX ON apflora.apber USING btree (id);

-- TODO: make sure createTable is correct
-- TODO: rename in sql
-- TODO: rename in js
-- TODO: check if old id was used somewhere. If so: rename that field, add new one and update that
-- TODO: add all views, functions, triggers containing this table to this file
-- TODO: run migration sql in dev
-- TODO: restart postgrest and test app
-- TODO: update js and run this file on server
-- TODO: restart postgrest