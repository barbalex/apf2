ALTER TABLE apflora.apber RENAME "JBerId" TO id_old;
ALTER TABLE apflora.apber ADD COLUMN id UUID DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.apber RENAME "ApArtId" TO ap_id;
ALTER TABLE apflora.apber RENAME "JBerJahr" TO jahr;
ALTER TABLE apflora.apber RENAME "JBerSituation" TO situation;
ALTER TABLE apflora.apber RENAME "JBerVergleichVorjahrGesamtziel" TO vergleich_vorjahr_gesamtziel;
ALTER TABLE apflora.apber RENAME "JBerBeurteilung" TO beurteilung;
ALTER TABLE apflora.apber RENAME "JBerVeraenGegenVorjahr" TO veraenderung_zum_vorjahr;
ALTER TABLE apflora.apber RENAME "JBerAnalyse" TO apber_analyse;
ALTER TABLE apflora.apber RENAME "JBerUmsetzung" TO konsequenzen_umsetzung;
ALTER TABLE apflora.apber RENAME "JBerErfko" TO konsequenzen_erfolgskontrolle;
ALTER TABLE apflora.apber RENAME "JBerATxt" TO biotope_neue;
ALTER TABLE apflora.apber RENAME "JBerBTxt" TO biotope_optimieren;
ALTER TABLE apflora.apber RENAME "JBerCTxt" TO massnahmen_optimieren;
ALTER TABLE apflora.apber RENAME "JBerDTxt" TO wirkung_auf_art;
ALTER TABLE apflora.apber RENAME "JBerDatum" TO datum;
ALTER TABLE apflora.apber RENAME "JBerBearb" TO bearbeiter;
ALTER TABLE apflora.apber RENAME "MutWann" TO changed;
ALTER TABLE apflora.apber RENAME "MutWer" TO changed_by;
ALTER TABLE apflora.apber RENAME "JBerCAktivApbearb" TO massnahmen_ap_bearb;
ALTER TABLE apflora.apber RENAME "JBerCVerglAusfPl" TO massnahmen_planung_vs_ausfuehrung;

ALTER TABLE apflora._variable RENAME "JBerJahr" TO apber_jahr;

-- change primary key
ALTER TABLE apflora.apber DROP CONSTRAINT apber_pkey CASCADE;
ALTER TABLE apflora.apber ADD PRIMARY KEY (id);
ALTER TABLE apflora.apber ALTER COLUMN id_old DROP NOT NULL;
ALTER TABLE apflora.apber ALTER COLUMN id_old SET DEFAULT null;

-- comments
COMMENT ON COLUMN apflora.apber.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.apber.id_old IS 'frühere id';
COMMENT ON COLUMN apflora.apber.jahr IS 'Für welches Jahr gilt der Bericht?';
COMMENT ON COLUMN apflora.apber.situation IS 'Beschreibung der Situation im Berichtjahr. Seit 2017 nicht mehr verwendet: Früher wurden hier die Massnahmen aufgelistet';
COMMENT ON COLUMN apflora.apber.vergleich_vorjahr_gesamtziel IS 'Vergleich zu Vorjahr und Ausblick auf das Gesamtziel';
COMMENT ON COLUMN apflora.apber.beurteilung IS 'Beurteilung des Erfolgs des Aktionsplans bisher';
COMMENT ON COLUMN apflora.apber.veraenderung_zum_vorjahr IS 'Veränderung gegenüber dem Vorjahr: plus heisst aufgestiegen, minus heisst abgestiegen';
COMMENT ON COLUMN apflora.apber.apber_analyse IS 'Was sind die Ursachen fuer die beobachtete Entwicklung?';
COMMENT ON COLUMN apflora.apber.konsequenzen_umsetzung IS 'Konsequenzen für die Umsetzung';
COMMENT ON COLUMN apflora.apber.konsequenzen_erfolgskontrolle IS 'Konsequenzen für die Erfolgskontrolle';
COMMENT ON COLUMN apflora.apber.biotope_neue IS 'Bemerkungen zum Aussagebereich A: Grundmengen und getroffene Massnahmen';
COMMENT ON COLUMN apflora.apber.biotope_optimieren IS 'Bemerkungen zum Aussagebereich B: Bestandeskontrolle';
COMMENT ON COLUMN apflora.apber.massnahmen_optimieren IS 'Bemerkungen zum Aussagebereich C: Zwischenbilanz zur Wirkung von Massnahmen';
COMMENT ON COLUMN apflora.apber.massnahmen_ap_bearb IS 'Bemerkungen zum Aussagebereich C: Weitere Aktivitäten der Aktionsplan-Verantwortlichen';
COMMENT ON COLUMN apflora.apber.massnahmen_planung_vs_ausfuehrung IS 'Bemerkungen zum Aussagebereich C: Vergleich Ausführung/Planung';
COMMENT ON COLUMN apflora.apber.wirkung_auf_art IS 'Bemerkungen zum Aussagebereich D: Einschätzung der Wirkung des AP insgesamt pro Art';
COMMENT ON COLUMN apflora.apber.datum IS 'Datum der Nachführung';
COMMENT ON COLUMN apflora.apber.bearbeiter IS 'BerichtsverfasserIn: Auswahl aus der Tabelle "adresse"';
COMMENT ON COLUMN apflora.apber.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.apber.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- drop existing indexes
DROP index apflora.apflora."apber_ApArtId_idx";
DROP index apflora.apflora."apber_JBerBearb_idx";
DROP index apflora.apflora."apber_JBerBeurteilung_idx";
DROP index apflora.apflora."apber_JBerId_idx";
DROP index apflora.apflora."apber_JBerJahr_idx";
-- add new
CREATE INDEX ON apflora.apber USING btree (id);
CREATE INDEX ON apflora.apber USING btree (ap_id);
CREATE INDEX ON apflora.apber USING btree (beurteilung);
CREATE INDEX ON apflora.apber USING btree (bearbeiter);
CREATE INDEX ON apflora.apber USING btree (jahr);

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- done: run migration sql in dev
-- done: restart postgrest and test app
-- TODO: update js and run this file on server
-- TODO: restart postgrest

DROP TRIGGER IF EXISTS apber_on_update_set_mut ON apflora.apber;
DROP FUNCTION IF EXISTS apber_on_update_set_mut();
CREATE FUNCTION apber_on_update_set_mut() RETURNS trigger AS $apber_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$apber_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER apber_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.apber
  FOR EACH ROW EXECUTE PROCEDURE apber_on_update_set_mut();

DROP VIEW IF EXISTS apflora.v_apber_verwaist;

DROP VIEW IF EXISTS apflora.v_apber_artd;
CREATE OR REPLACE VIEW apflora.v_apber_artd AS
SELECT
  apflora.ap.*,
  apflora.ae_eigenschaften.artname,
  apflora.apber.*,
  apflora.adresse."AdrName" AS bearbeiter_decodiert,
  ap_erfkrit_werte.text
FROM
  (apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  INNER JOIN
    (((apflora.apber
    LEFT JOIN
      apflora.adresse
      ON apflora.apber.bearbeiter = apflora.adresse."AdrId")
    LEFT JOIN
      apflora.ap_erfkrit_werte
      ON apflora.apber.beurteilung = apflora.ap_erfkrit_werte.code)
    INNER JOIN
      apflora._variable
      ON apflora.apber.jahr = apflora._variable.apber_jahr)
    ON apflora.ap."ApArtId" = apflora.apber.ap_id;

DROP VIEW IF EXISTS apflora.v_apber;
CREATE OR REPLACE VIEW apflora.v_apber AS
SELECT
  apflora.ap."ApArtId",
  apflora.ae_eigenschaften.artname,
  apflora.apber.*,
  apflora.ap_erfkrit_werte.text AS beurteilung_decodiert,
  apflora.adresse."AdrName" AS bearbeiter_decodiert
FROM
  apflora.ap
  INNER JOIN
    apflora.ae_eigenschaften
    ON (apflora.ap."ApArtId" = apflora.ae_eigenschaften.taxid)
  INNER JOIN
    ((apflora.apber
    LEFT JOIN
      apflora.ap_erfkrit_werte
      ON (apflora.apber.beurteilung = apflora.ap_erfkrit_werte.code))
    LEFT JOIN
      apflora.adresse
      ON (apflora.apber.bearbeiter = apflora.adresse."AdrId"))
    ON apflora.ap."ApArtId" = apflora.apber.ap_id
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_apber_injahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_injahr AS
SELECT
  apflora.ap.*,
  apflora.ae_eigenschaften.artname,
  apflora.apber.*,
  concat(apflora.adresse."AdrName", ', ', apflora.adresse."AdrAdresse") AS bearbeiter_decodiert,
  apflora.apberuebersicht.jahr AS apberuebersicht_jahr,
  apflora.apberuebersicht.bemerkungen,
  apflora.v_erstemassnproap."MinvonTPopMassnJahr" AS "ErsteMassnahmeImJahr"
FROM
  (apflora.ae_eigenschaften
  INNER JOIN
    (apflora.ap
    LEFT JOIN
      apflora.v_erstemassnproap
      ON apflora.ap."ApArtId" = apflora.v_erstemassnproap."ApArtId")
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  INNER JOIN
    (((apflora.apber
    LEFT JOIN
      apflora.adresse
      ON apflora.apber.bearbeiter = apflora.adresse."AdrId")
    LEFT JOIN
      apflora.apberuebersicht
      ON apflora.apber.jahr = apflora.apberuebersicht.jahr)
    INNER JOIN
      apflora._variable
      ON apflora.apber.jahr = apflora._variable.apber_jahr)
    ON apflora.ap."ApArtId" = apflora.apber.ap_id
WHERE
  apflora.ap."ApStatus" < 4
  --AND apflora.ap."ApArtId" > 150
ORDER BY
  apflora.ae_eigenschaften.artname;