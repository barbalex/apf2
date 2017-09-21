DROP TABLE IF EXISTS _variable;
CREATE TABLE apflora._variable (
  "KonstId" SERIAL PRIMARY KEY,
  "JBerJahr" smallint DEFAULT NULL,
  "ApArtId" integer DEFAULT NULL
);
COMMENT ON COLUMN apflora._variable."JBerJahr" IS 'Von Access aus ein Berichtsjahr wählen, um die Erstellung des Jahresberichts zu beschleunigen';
COMMENT ON COLUMN apflora._variable."ApArtId" IS 'Von Access aus eine Art wählen, um views zu beschleunigen';
CREATE INDEX ON apflora._variable USING btree ("JBerJahr");
CREATE INDEX ON apflora._variable USING btree ("ApArtId");

DROP TABLE IF EXISTS adresse;
CREATE TABLE apflora.adresse (
  "AdrId" SERIAL PRIMARY KEY,
  "AdrName" text DEFAULT NULL,
  "AdrAdresse" text DEFAULT NULL,
  "AdrTel" text DEFAULT NULL,
  "AdrEmail" text DEFAULT NULL,
  "freiwErfko" integer DEFAULT NULL,
  "EvabIdPerson" varchar(40) DEFAULT NULL,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) DEFAULT NULL
);
COMMENT ON COLUMN apflora.adresse."AdrId" IS 'Primärschlüssel der Tabelle "adresse"';
COMMENT ON COLUMN apflora.adresse."AdrName" IS 'Vor- und Nachname';
COMMENT ON COLUMN apflora.adresse."AdrAdresse" IS 'Strasse, PLZ und Ort';
COMMENT ON COLUMN apflora.adresse."AdrTel" IS 'Telefonnummer';
COMMENT ON COLUMN apflora.adresse."AdrEmail" IS 'Email';
COMMENT ON COLUMN apflora.adresse."freiwErfko" IS '-1 = freiwillige(r) Kontrolleur(in)';
COMMENT ON COLUMN apflora.adresse."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.adresse."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
SELECT setval(pg_get_serial_sequence('apflora.adresse', 'AdrId'), coalesce(max("AdrId"), 0) + 1, false) FROM apflora.adresse;

DROP TABLE IF EXISTS apflora.ap;
CREATE TABLE apflora.ap (
  "ApArtId" integer PRIMARY KEY DEFAULT '0',
  "ProjId" integer DEFAULT NULL REFERENCES apflora.projekt ("ProjId") ON DELETE CASCADE ON UPDATE CASCADE,
  "ApStatus" integer DEFAULT NULL REFERENCES apflora.ap_bearbstand_werte ("DomainCode") ON DELETE SET NULL ON UPDATE CASCADE,
  "ApJahr" smallint DEFAULT NULL,
  "ApUmsetzung" integer DEFAULT NULL REFERENCES apflora.ap_umsetzung_werte ("DomainCode") ON DELETE SET NULL ON UPDATE CASCADE,
  "ApBearb" integer DEFAULT NULL REFERENCES apflora.adresse ("AdrId") ON DELETE SET NULL ON UPDATE CASCADE,
  "ApArtwert" integer DEFAULT NULL,
  "ApGuid" UUID DEFAULT uuid_generate_v1mc(),
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) DEFAULT NULL
);
COMMENT ON COLUMN apflora.ap."ApArtId" IS 'Primärschlüssel der Tabelle "ap". = SISF-Nr';
COMMENT ON COLUMN apflora.ap."ApStatus" IS 'In welchem Bearbeitungsstand befindet sich der AP?';
COMMENT ON COLUMN apflora.ap."ApJahr" IS 'Wann wurde mit der Umsetzung des Aktionsplans begonnen?';
COMMENT ON COLUMN apflora.ap."ApUmsetzung" IS 'In welchem Umsetzungsstand befindet sich der AP?';
COMMENT ON COLUMN apflora.ap."ApBearb" IS 'Verantwortliche(r) für die Art';
COMMENT ON COLUMN apflora.ap."ApArtwert" IS 'redundant aber erspart viele Abfragen. Wird aktualisiert, wenn alexande_beob.ArtenDb_Arteigenschaften aktualisiert wird';
COMMENT ON COLUMN apflora.ap."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ap."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.ap USING btree ("ApStatus");
CREATE INDEX ON apflora.ap USING btree ("ApUmsetzung");
CREATE INDEX ON apflora.ap USING btree ("ApBearb");
CREATE INDEX ON apflora.ap USING btree ("ProjId");
CREATE UNIQUE INDEX ON apflora.ap USING btree ("ApGuid");

-- only once
-- ALTER TABLE apflora.ap
--   ADD COLUMN "ProjId" integer Default Null;
-- CREATE INDEX ON apflora.ap USING btree ("ProjId");
-- UPDATE apflora.ap
-- SET "ProjId" = '1'
-- WHERE "ProjId" IS NULL;

DROP TABLE IF EXISTS apflora.userprojekt;
CREATE TABLE apflora.userprojekt (
  "UserId" integer REFERENCES apflora.user ("UserId") ON DELETE CASCADE ON UPDATE CASCADE,
  "ProjId" integer REFERENCES apflora.projekt ("ProjId") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX ON apflora.userprojekt USING btree ("UserId", "ProjId");

INSERT INTO apflora.userprojekt ("UserId", "ProjId")
SELECT "UserId", '1'
FROM apflora.user;


DROP TABLE IF EXISTS apflora.ap_bearbstand_werte;
CREATE TABLE apflora.ap_bearbstand_werte (
  "DomainCode" integer PRIMARY KEY,
  "DomainTxt" varchar(50) DEFAULT NULL,
  "DomainOrd" smallint DEFAULT NULL,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) NOT NULL
);
COMMENT ON COLUMN apflora.ap_bearbstand_werte."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ap_bearbstand_werte."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.ap_erfbeurtkrit_werte;
CREATE TABLE apflora.ap_erfbeurtkrit_werte (
  "DomainCode" integer PRIMARY KEY,
  "DomainTxt" varchar(50) DEFAULT NULL,
  "DomainOrd" smallint DEFAULT NULL,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) NOT NULL
);
COMMENT ON COLUMN apflora.ap_erfbeurtkrit_werte."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ap_erfbeurtkrit_werte."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.ap_erfkrit_werte;
CREATE TABLE apflora.ap_erfkrit_werte (
  "BeurteilId" integer PRIMARY KEY,
  "BeurteilTxt" varchar(50) DEFAULT NULL,
  "BeurteilOrd" smallint DEFAULT NULL,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) NOT NULL
);
COMMENT ON COLUMN apflora.ap_erfkrit_werte."BeurteilTxt" IS 'Wie werden die durchgefuehrten Massnahmen beurteilt?';
COMMENT ON COLUMN apflora.ap_erfkrit_werte."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ap_erfkrit_werte."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.ap_umsetzung_werte;
CREATE TABLE apflora.ap_umsetzung_werte (
  "DomainCode" integer PRIMARY KEY,
  "DomainTxt" varchar(50) DEFAULT NULL,
  "DomainOrd" smallint DEFAULT NULL,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) NOT NULL
);
COMMENT ON COLUMN apflora.ap_umsetzung_werte."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ap_umsetzung_werte."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.apber;
CREATE TABLE apflora.apber (
  "JBerId" SERIAL PRIMARY KEY,
  "ApArtId" integer NOT NULL REFERENCES apflora.ap ("ApArtId") ON DELETE CASCADE ON UPDATE CASCADE,
  "JBerJahr" smallint DEFAULT NULL,
  "JBerSituation" text,
  "JBerVergleichVorjahrGesamtziel" text,
  "JBerBeurteilung" integer DEFAULT NULL REFERENCES apflora.ap_erfkrit_werte ("BeurteilId") ON DELETE SET NULL ON UPDATE CASCADE,
  "JBerVeraenGegenVorjahr" varchar(2) DEFAULT NULL,
  "JBerAnalyse" text DEFAULT NULL,
  "JBerUmsetzung" text,
  "JBerErfko" text,
  "JBerATxt" text,
  "JBerBTxt" text,
  "JBerCTxt" text,
  "JBerDTxt" text,
  "JBerDatum" date DEFAULT NULL,
  "JBerBearb" integer DEFAULT NULL REFERENCES apflora.adresse ("AdrId") ON DELETE SET NULL ON UPDATE CASCADE,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) DEFAULT NULL
);
COMMENT ON COLUMN apflora.apber."JBerId" IS 'Primärschlüssel der Tabelle "apber"';
COMMENT ON COLUMN apflora.apber."JBerJahr" IS 'Für welches Jahr gilt der Bericht?';
COMMENT ON COLUMN apflora.apber."JBerSituation" IS 'Beschreibung der Situation im Berichtjahr. Nicht mehr verwendet: Früher wurden hier die Massnahmen aufgelistet';
COMMENT ON COLUMN apflora.apber."JBerVergleichVorjahrGesamtziel" IS 'Vergleich zu Vorjahr und Ausblick auf das Gesamtziel';
COMMENT ON COLUMN apflora.apber."JBerBeurteilung" IS 'Beurteilung des Erfolgs des Aktionsplans bisher';
COMMENT ON COLUMN apflora.apber."JBerVeraenGegenVorjahr" IS 'Veränderung gegenüber dem Vorjahr: plus heisst aufgestiegen, minus heisst abgestiegen';
COMMENT ON COLUMN apflora.apber."JBerAnalyse" IS 'Was sind die Ursachen fuer die beobachtete Entwicklung?';
COMMENT ON COLUMN apflora.apber."JBerUmsetzung" IS 'Konsequenzen für die Umsetzung';
COMMENT ON COLUMN apflora.apber."JBerErfko" IS 'Konsequenzen für die Erfolgskontrolle';
COMMENT ON COLUMN apflora.apber."JBerATxt" IS 'Bemerkungen zum Aussagebereich A: Grundmengen und getroffene Massnahmen';
COMMENT ON COLUMN apflora.apber."JBerBTxt" IS 'Bemerkungen zum Aussagebereich B: Bestandeskontrolle';
COMMENT ON COLUMN apflora.apber."JBerCTxt" IS 'Bemerkungen zum Aussagebereich C: Zwischenbilanz zur Wirkung von Massnahmen';
COMMENT ON COLUMN apflora.apber."JBerDTxt" IS 'Bemerkungen zum Aussagebereich D: Einschätzung der Wirkung des AP insgesamt pro Art';
COMMENT ON COLUMN apflora.apber."JBerDatum" IS 'Datum der Nachführung';
COMMENT ON COLUMN apflora.apber."JBerBearb" IS 'BerichtsverfasserIn: Auswahl aus der Tabelle "adresse"';
COMMENT ON COLUMN apflora.apber."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.apber."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.apber USING btree ("ApArtId");
CREATE INDEX ON apflora.apber USING btree ("JBerBeurteilung");
CREATE INDEX ON apflora.apber USING btree ("JBerBearb");
CREATE INDEX ON apflora.apber USING btree ("JBerJahr");
SELECT setval(pg_get_serial_sequence('apflora.apber', 'JBerId'), coalesce(max("JBerId"), 0) + 1, false) FROM apflora.apber;

DROP TABLE IF EXISTS apflora.apberuebersicht;
CREATE TABLE apflora.apberuebersicht (
  "ProjId" integer DEFAULT 1,
  "JbuJahr" smallint NOT NULL,
  "JbuBemerkungen" text,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) DEFAULT NULL
);
COMMENT ON COLUMN apflora.apberuebersicht."ProjId" IS 'Zugehöriges Projekt. Zusammen mit JbuJahr Primärschlüssel der Tabelle "apberuebersicht"';
COMMENT ON COLUMN apflora.apberuebersicht."JbuJahr" IS 'Berichtsjahr. Zusammen mit ProjId Primärschlüssel der Tabelle "apberuebersicht"';
COMMENT ON COLUMN apflora.apberuebersicht."JbuBemerkungen" IS 'Bemerkungen zur Artübersicht';
COMMENT ON COLUMN apflora.apberuebersicht."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.apberuebersicht."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
ALTER TABLE apflora.apberuebersicht ADD CONSTRAINT apberuebersicht_proj_jahr_pk PRIMARY KEY ("ProjId", "JbuJahr");

DROP TABLE IF EXISTS apflora.assozart;
CREATE TABLE apflora.assozart (
  "AaId" SERIAL PRIMARY KEY,
  "AaApArtId" integer DEFAULT NULL REFERENCES apflora.ap ("ApArtId") ON DELETE CASCADE ON UPDATE CASCADE,
  "AaSisfNr" integer DEFAULT NULL REFERENCES beob.adb_eigenschaften ("TaxonomieId") ON DELETE SET NULL ON UPDATE CASCADE,
  "AaBem" text,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) DEFAULT NULL
);
COMMENT ON COLUMN apflora.assozart."AaId" IS 'Primärschlüssel der Tabelle "assozart"';
COMMENT ON COLUMN apflora.assozart."AaApArtId" IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.assozart."AaSisfNr" IS 'SisfNr der assoziierten Art';
COMMENT ON COLUMN apflora.assozart."AaBem" IS 'Bemerkungen zur Assoziation';
COMMENT ON COLUMN apflora.assozart."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.assozart."MutWer" IS 'Wer hat den Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.assozart USING btree ("AaApArtId");
SELECT setval(pg_get_serial_sequence('apflora.assozart', 'AaId'), coalesce(max("AaId"), 0) + 1, false) FROM apflora.assozart;

DROP TABLE IF EXISTS apflora.beobzuordnung;
CREATE TABLE apflora.beobzuordnung (
  "BeobId" integer PRIMARY KEY,
  "QuelleId" integer Default Null REFERENCES beob.beob_quelle ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  "TPopId" integer DEFAULT NULL REFERENCES apflora.tpop ("TPopId") ON DELETE CASCADE ON UPDATE CASCADE,
  "BeobNichtZuordnen" smallint DEFAULT NULL,
  "BeobBemerkungen" text,
  "BeobMutWann" date DEFAULT NULL,
  "BeobMutWer" varchar(20) DEFAULT NULL
);
COMMENT ON COLUMN apflora.beobzuordnung."BeobId" IS 'Primärschlüssel: ID aus beob.beob';
COMMENT ON COLUMN apflora.beobzuordnung."TPopId" IS 'Dieser Teilpopulation wurde die Beobachtung zugeordnet. Fremdschlüssel aus der Tabelle "tpop"';
COMMENT ON COLUMN apflora.beobzuordnung."BeobNichtZuordnen" IS 'Ja oder nein. Wird ja gesetzt, wenn eine Beobachtung keiner Teilpopulation zugeordnet werden kann. Sollte im Bemerkungsfeld begründet werden. In der Regel ist die Artbestimmung zweifelhaft. Oder die Beobachtung ist nicht (genau genug) lokalisierbar';
COMMENT ON COLUMN apflora.beobzuordnung."BeobBemerkungen" IS 'Bemerkungen zur Zuordnung';
COMMENT ON COLUMN apflora.beobzuordnung."BeobMutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.beobzuordnung."BeobMutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.beobzuordnung USING btree ("BeobId");
CREATE INDEX ON apflora.beobzuordnung USING btree ("QuelleId");
CREATE INDEX ON apflora.beobzuordnung USING btree ("TPopId");
CREATE INDEX ON apflora.beobzuordnung USING btree ("BeobNichtZuordnen");

DROP TABLE IF EXISTS apflora.projekt;
CREATE TABLE apflora.projekt (
  "ProjId" SERIAL PRIMARY KEY,
  "ProjName" varchar(150) DEFAULT NULL,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) DEFAULT NULL
);
CREATE INDEX ON apflora.projekt USING btree ("ProjName");
COMMENT ON COLUMN apflora.projekt."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.projekt."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
INSERT INTO apflora.projekt VALUES (1, 'AP Flora Kt. ZH');

DROP TABLE IF EXISTS apflora.ber;
CREATE TABLE apflora.ber (
  "BerId" SERIAL PRIMARY KEY,
  "ApArtId" integer DEFAULT NULL REFERENCES apflora.ap ("ApArtId") ON DELETE CASCADE ON UPDATE CASCADE,
  "BerAutor" varchar(150) DEFAULT NULL,
  "BerJahr" smallint DEFAULT NULL,
  "BerTitel" text DEFAULT NULL,
  "BerURL" text DEFAULT NULL,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) DEFAULT NULL
);
COMMENT ON COLUMN apflora.ber."BerId" IS 'Primärschlüssel der Tabelle "ber"';
COMMENT ON COLUMN apflora.ber."ApArtId" IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.ber."BerAutor" IS 'Autor des Berichts';
COMMENT ON COLUMN apflora.ber."BerJahr" IS 'Jahr der Publikation';
COMMENT ON COLUMN apflora.ber."BerTitel" IS 'Titel des Berichts';
COMMENT ON COLUMN apflora.ber."BerURL" IS 'Link zum Bericht';
COMMENT ON COLUMN apflora.ber."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ber."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.ber USING btree ("ApArtId");
SELECT setval(pg_get_serial_sequence('apflora.ber', 'BerId'), coalesce(max("BerId"), 0) + 1, false) FROM apflora.ber;

DROP TABLE IF EXISTS apflora.erfkrit;
CREATE TABLE apflora.erfkrit (
  "ErfkritId" SERIAL PRIMARY KEY,
  "ApArtId" integer NOT NULL DEFAULT '0' REFERENCES apflora.ap ("ApArtId") ON DELETE CASCADE ON UPDATE CASCADE,
  "ErfkritErreichungsgrad" integer DEFAULT NULL REFERENCES apflora.ap_erfkrit_werte ("BeurteilId") ON DELETE SET NULL ON UPDATE CASCADE,
  "ErfkritTxt" text DEFAULT NULL,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) DEFAULT NULL
);
COMMENT ON COLUMN apflora.erfkrit."ErfkritId" IS 'Primärschlüssel der Tabelle "erfkrit"';
COMMENT ON COLUMN apflora.erfkrit."ApArtId" IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.erfkrit."ErfkritErreichungsgrad" IS 'Wie gut wurden die Ziele erreicht? Auswahl aus der Tabelle "ap_erfbeurtkrit_werte"';
COMMENT ON COLUMN apflora.erfkrit."ErfkritTxt" IS 'Beschreibung der Kriterien für den Erreichungsgrad';
COMMENT ON COLUMN apflora.erfkrit."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.erfkrit."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.erfkrit USING btree ("ApArtId");
CREATE INDEX ON apflora.erfkrit USING btree ("ErfkritErreichungsgrad");
SELECT setval(pg_get_serial_sequence('apflora.erfkrit', 'ErfkritId'), coalesce(max("ErfkritId"), 0) + 1, false) FROM apflora.erfkrit;

DROP TABLE IF EXISTS apflora.gemeinde;
CREATE TABLE apflora.gemeinde (
  "BfsNr" integer PRIMARY KEY,
  "GmdName" varchar(50) DEFAULT NULL
);
CREATE INDEX ON apflora.gemeinde USING btree ("GmdName");

DROP TABLE IF EXISTS apflora.idealbiotop;
CREATE TABLE apflora.idealbiotop (
  "IbApArtId" integer UNIQUE DEFAULT '0' REFERENCES apflora.ap ("IbApArtId") ON DELETE CASCADE ON UPDATE CASCADE,
  "IbErstelldatum" date DEFAULT NULL,
  "IbHoehenlage" text,
  "IbRegion" text,
  "IbExposition" text,
  "IbBesonnung" text,
  "IbHangneigung" text,
  "IbBodenTyp" text,
  "IbBodenKalkgehalt" text,
  "IbBodenDurchlaessigkeit" text,
  "IbBodenHumus" text,
  "IbBodenNaehrstoffgehalt" text,
  "IbWasserhaushalt" text,
  "IbKonkurrenz" text,
  "IbMoosschicht" text,
  "IbKrautschicht" text,
  "IbStrauchschicht" text,
  "IbBaumschicht" text,
  "IbBemerkungen" text,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) DEFAULT NULL
);
COMMENT ON COLUMN apflora.idealbiotop."IbApArtId" IS 'Primärschlüssel der Tabelle "idealbiotop". Gleichzeitig Fremdschlüssel aus der Tabelle "ap (1:1-Beziehung)';
COMMENT ON COLUMN apflora.idealbiotop."IbErstelldatum" IS 'Erstelldatum';
COMMENT ON COLUMN apflora.idealbiotop."IbHoehenlage" IS 'Höhenlage';
COMMENT ON COLUMN apflora.idealbiotop."IbRegion" IS 'Region';
COMMENT ON COLUMN apflora.idealbiotop."IbExposition" IS 'Exposition';
COMMENT ON COLUMN apflora.idealbiotop."IbBesonnung" IS 'Besonnung';
COMMENT ON COLUMN apflora.idealbiotop."IbHangneigung" IS 'Hangneigung';
COMMENT ON COLUMN apflora.idealbiotop."IbBodenTyp" IS 'Bodentyp';
COMMENT ON COLUMN apflora.idealbiotop."IbBodenKalkgehalt" IS 'Kalkgehalt im Boden';
COMMENT ON COLUMN apflora.idealbiotop."IbBodenDurchlaessigkeit" IS 'Bodendurchlässigkeit';
COMMENT ON COLUMN apflora.idealbiotop."IbBodenHumus" IS 'Bodenhumusgehalt';
COMMENT ON COLUMN apflora.idealbiotop."IbBodenNaehrstoffgehalt" IS 'Bodennährstoffgehalt';
COMMENT ON COLUMN apflora.idealbiotop."IbWasserhaushalt" IS 'Wasserhaushalt';
COMMENT ON COLUMN apflora.idealbiotop."IbKonkurrenz" IS 'Konkurrenz';
COMMENT ON COLUMN apflora.idealbiotop."IbMoosschicht" IS 'Moosschicht';
COMMENT ON COLUMN apflora.idealbiotop."IbKrautschicht" IS 'Krautschicht';
COMMENT ON COLUMN apflora.idealbiotop."IbStrauchschicht" IS 'Strauchschicht';
COMMENT ON COLUMN apflora.idealbiotop."IbBaumschicht" IS 'Baumschicht';
COMMENT ON COLUMN apflora.idealbiotop."IbBemerkungen" IS 'Bemerkungen';
COMMENT ON COLUMN apflora.idealbiotop."MutWann" IS 'Wann wurde der Datensatz zuletzt verändert?';
COMMENT ON COLUMN apflora.idealbiotop."MutWer" IS 'Wer hat den Datensatz zuletzt verändert?';

DROP TABLE IF EXISTS apflora.pop;
CREATE TABLE apflora.pop (
  "PopId" SERIAL PRIMARY KEY,
  "ApArtId" integer DEFAULT NULL REFERENCES apflora.ap ("ApArtId") ON DELETE CASCADE ON UPDATE CASCADE,
  "PopNr" integer DEFAULT NULL,
  "PopName" varchar(150) DEFAULT NULL,
  "PopHerkunft" integer DEFAULT NULL REFERENCES apflora.pop_status_werte ("HerkunftId") ON DELETE SET NULL ON UPDATE CASCADE,
  "PopHerkunftUnklar" smallint DEFAULT NULL,
  "PopHerkunftUnklarBegruendung" text DEFAULT NULL,
  "PopBekanntSeit" smallint DEFAULT NULL,
  "PopXKoord" integer DEFAULT NULL,
  "PopYKoord" integer DEFAULT NULL,
  "PopGuid" UUID DEFAULT uuid_generate_v1mc(),
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) DEFAULT NULL
);
SELECT setval(pg_get_serial_sequence('apflora.pop', 'PopId'), coalesce(max("PopId"), 0) + 1, false) FROM apflora.pop;
COMMENT ON COLUMN apflora.pop."PopId" IS 'Primärschlüssel der Tabelle "pop"';
COMMENT ON COLUMN apflora.pop."ApArtId" IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.pop."PopNr" IS 'Nummer der Population';
COMMENT ON COLUMN apflora.pop."PopName" IS 'Bezeichnung der Population';
COMMENT ON COLUMN apflora.pop."PopHerkunft" IS 'Herkunft der Population: autochthon oder angesiedelt? Auswahl aus der Tabelle "pop_status_werte"';
COMMENT ON COLUMN apflora.pop."PopHerkunftUnklar" IS '1 = die Herkunft der Population ist unklar';
COMMENT ON COLUMN apflora.pop."PopHerkunftUnklarBegruendung" IS 'Begründung, wieso die Herkunft unklar ist';
COMMENT ON COLUMN apflora.pop."PopBekanntSeit" IS 'Seit wann ist die Population bekannt?';
COMMENT ON COLUMN apflora.pop."PopXKoord" IS 'Wird in der Regel von einer Teilpopulation übernommen';
COMMENT ON COLUMN apflora.pop."PopYKoord" IS 'Wird in der Regel von einer Teilpopulation übernommen';
COMMENT ON COLUMN apflora.pop."PopGuid" IS 'GUID der Population';
COMMENT ON COLUMN apflora.pop."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.pop."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.pop USING btree ("ApArtId");
CREATE UNIQUE INDEX ON apflora.pop USING btree ("PopGuid");
CREATE INDEX ON apflora.pop USING btree ("PopHerkunft");
CREATE INDEX ON apflora.pop USING btree ("PopXKoord");
CREATE INDEX ON apflora.pop USING btree ("PopYKoord");
CREATE INDEX ON apflora.pop USING btree ("PopNr");
CREATE INDEX ON apflora.pop USING btree ("PopName");
CREATE INDEX ON apflora.pop USING btree ("PopBekanntSeit");

DROP TABLE IF EXISTS apflora.pop_entwicklung_werte;
CREATE TABLE apflora.pop_entwicklung_werte (
  "EntwicklungId" integer PRIMARY KEY,
  "EntwicklungTxt" varchar(60) DEFAULT NULL,
  "EntwicklungOrd" smallint DEFAULT NULL,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) NOT NULL
);
COMMENT ON COLUMN apflora.pop_entwicklung_werte."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.pop_entwicklung_werte."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.pop_entwicklung_werte USING btree ("EntwicklungTxt");

DROP TABLE IF EXISTS apflora.pop_status_werte;
CREATE TABLE apflora.pop_status_werte (
  "HerkunftId" integer PRIMARY KEY,
  "HerkunftTxt" varchar(60) DEFAULT NULL,
  "HerkunftOrd" smallint DEFAULT NULL,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) DEFAULT NULL
);
COMMENT ON COLUMN apflora.pop_status_werte."HerkunftTxt" IS 'Beschreibung der Herkunft';
COMMENT ON COLUMN apflora.pop_status_werte."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.pop_status_werte."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.popber;
CREATE TABLE apflora.popber (
  "PopBerId" SERIAL PRIMARY KEY,
  "PopId" integer DEFAULT NULL REFERENCES apflora.pop ("PopId") ON DELETE CASCADE ON UPDATE CASCADE,
  "PopBerJahr" smallint DEFAULT NULL,
  "PopBerEntwicklung" integer DEFAULT NULL REFERENCES apflora.pop_entwicklung_werte ("EntwicklungId") ON DELETE SET NULL ON UPDATE CASCADE,
  "PopBerTxt" text,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) DEFAULT NULL
);
SELECT setval(pg_get_serial_sequence('apflora.popber', 'PopBerId'), coalesce(max("PopBerId"), 0) + 1, false) FROM apflora.popber;
COMMENT ON COLUMN apflora.popber."PopBerId" IS 'Primärschlüssel der Tabelle "popber"';
COMMENT ON COLUMN apflora.popber."PopId" IS 'Zugehörige Population. Fremdschlüssel aus der Tabelle "pop"';
COMMENT ON COLUMN apflora.popber."PopBerJahr" IS 'Für welches Jahr gilt der Bericht?';
COMMENT ON COLUMN apflora.popber."PopBerEntwicklung" IS 'Beurteilung der Populationsentwicklung: Auswahl aus Tabelle "pop_entwicklung_werte"';
COMMENT ON COLUMN apflora.popber."PopBerTxt" IS 'Bemerkungen zur Beurteilung';
COMMENT ON COLUMN apflora.popber."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.popber."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.popber USING btree ("PopId");
CREATE INDEX ON apflora.popber USING btree ("PopBerEntwicklung");
CREATE INDEX ON apflora.popber USING btree ("PopBerJahr");

DROP TABLE IF EXISTS apflora.popmassnber;
CREATE TABLE apflora.popmassnber (
  "PopMassnBerId" SERIAL PRIMARY KEY,
  "PopId" integer DEFAULT NULL REFERENCES apflora.pop ("PopId") ON DELETE CASCADE ON UPDATE CASCADE,
  "PopMassnBerJahr" smallint DEFAULT NULL,
  "PopMassnBerErfolgsbeurteilung" integer DEFAULT NULL REFERENCES apflora.tpopmassn_erfbeurt_werte ("BeurteilId") ON DELETE SET NULL ON UPDATE CASCADE,
  "PopMassnBerTxt" text,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) DEFAULT NULL
);
SELECT setval(pg_get_serial_sequence('apflora.popmassnber', 'PopMassnBerId'), coalesce(max("PopMassnBerId"), 0) + 1, false) FROM apflora.popmassnber;
COMMENT ON COLUMN apflora.popmassnber."PopMassnBerId" IS 'Primärschlüssel der Tabelle "popmassnber"';
COMMENT ON COLUMN apflora.popmassnber."PopId" IS 'Zugehörige Population. Fremdschlüssel aus der Tabelle "pop"';
COMMENT ON COLUMN apflora.popmassnber."PopMassnBerJahr" IS 'Für welches Jahr gilt der Bericht?';
COMMENT ON COLUMN apflora.popmassnber."PopMassnBerErfolgsbeurteilung" IS 'Wie wird die Wirkung aller im Rahmen des AP durchgeführten Massnahmen beurteilt?';
COMMENT ON COLUMN apflora.popmassnber."PopMassnBerTxt" IS 'Bemerkungen zur Beurteilung';
COMMENT ON COLUMN apflora.popmassnber."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.popmassnber."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.popmassnber USING btree ("PopId");
CREATE INDEX ON apflora.popmassnber USING btree ("PopMassnBerErfolgsbeurteilung");
CREATE INDEX ON apflora.popmassnber USING btree ("PopMassnBerJahr");

DROP TABLE IF EXISTS apflora.tpop;
CREATE TABLE apflora.tpop (
  "TPopId" SERIAL PRIMARY KEY,
  "PopId" integer DEFAULT NULL REFERENCES apflora.pop ("PopId") ON DELETE CASCADE ON UPDATE CASCADE,
  "TPopNr" integer DEFAULT NULL,
  "TPopGemeinde" text DEFAULT NULL,
  "TPopFlurname" text DEFAULT NULL,
  "TPopXKoord" integer DEFAULT NULL,
  "TPopYKoord" integer DEFAULT NULL,
  "TPopRadius" smallint DEFAULT NULL,
  "TPopHoehe" smallint DEFAULT NULL,
  "TPopExposition" varchar(50) DEFAULT NULL,
  "TPopKlima" varchar(50) DEFAULT NULL,
  "TPopNeigung" varchar(50) DEFAULT NULL,
  "TPopBeschr" text DEFAULT NULL,
  "TPopKatNr" text DEFAULT NULL,
  "TPopHerkunft" integer DEFAULT NULL REFERENCES apflora.pop_status_werte ("HerkunftId") ON DELETE SET NULL ON UPDATE CASCADE,
  "TPopHerkunftUnklar" smallint DEFAULT NULL,
  "TPopHerkunftUnklarBegruendung" text DEFAULT NULL,
  "TPopApBerichtRelevant" integer DEFAULT NULL REFERENCES apflora.tpop_apberrelevant_werte ("DomainCode") ON DELETE SET NULL ON UPDATE CASCADE,
  "TPopBekanntSeit" smallint DEFAULT NULL,
  "TPopEigen" text DEFAULT NULL,
  "TPopKontakt" text DEFAULT NULL,
  "TPopNutzungszone" text DEFAULT NULL,
  "TPopBewirtschafterIn" text DEFAULT NULL,
  "TPopBewirtschaftung" text DEFAULT NULL,
  "TPopTxt" text,
  "TPopGuid" UUID DEFAULT uuid_generate_v1mc(),
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) DEFAULT NULL
);
SELECT setval(pg_get_serial_sequence('apflora.tpop', 'TPopId'), coalesce(max("TPopId"), 0) + 1, false) FROM apflora.tpop;
COMMENT ON COLUMN apflora.tpop."TPopId" IS 'Primärschlüssel der Tabelle "tpop"';
COMMENT ON COLUMN apflora.tpop."PopId" IS 'Zugehörige Population. Fremdschlüssel aus der Tabelle "pop"';
COMMENT ON COLUMN apflora.tpop."TPopNr" IS 'Nummer der Teilpopulation';
COMMENT ON COLUMN apflora.tpop."TPopGemeinde" IS 'Gemeinde';
COMMENT ON COLUMN apflora.tpop."TPopFlurname" IS 'Flurname';
COMMENT ON COLUMN apflora.tpop."TPopXKoord" IS 'X-Koordinate';
COMMENT ON COLUMN apflora.tpop."TPopYKoord" IS 'Y-Koordinate';
COMMENT ON COLUMN apflora.tpop."TPopRadius" IS 'Radius der Teilpopulation (m)';
COMMENT ON COLUMN apflora.tpop."TPopHoehe" IS 'Höhe über Meer (m)';
COMMENT ON COLUMN apflora.tpop."TPopExposition" IS 'Exposition / Besonnung des Standorts';
COMMENT ON COLUMN apflora.tpop."TPopKlima" IS 'Klima des Standorts';
COMMENT ON COLUMN apflora.tpop."TPopNeigung" IS 'Hangneigung des Standorts';
COMMENT ON COLUMN apflora.tpop."TPopBeschr" IS 'Beschreibung der Fläche';
COMMENT ON COLUMN apflora.tpop."TPopKatNr" IS 'Kataster-Nummer';
COMMENT ON COLUMN apflora.tpop."TPopHerkunft" IS 'Herkunft der Teilpopulation. Auswahl aus Tabelle "pop_status_werte"';
COMMENT ON COLUMN apflora.tpop."TPopHerkunftUnklar" IS 'Ist der Status der Teilpopulation unklar? (es bestehen keine glaubwuerdigen Beboachtungen)';
COMMENT ON COLUMN apflora.tpop."TPopHerkunftUnklarBegruendung" IS 'Wieso ist der Status unklar?';
COMMENT ON COLUMN apflora.tpop."TPopApBerichtRelevant" IS 'Ist die Teilpopulation für den AP-Bericht relevant? Auswahl aus der Tabelle "tpop_apberrelevant_werte"';
COMMENT ON COLUMN apflora.tpop."TPopBekanntSeit" IS 'Seit wann ist die Teilpopulation bekannt?';
COMMENT ON COLUMN apflora.tpop."TPopEigen" IS 'EigentümerIn';
COMMENT ON COLUMN apflora.tpop."TPopKontakt" IS 'Kontaktperson vor Ort';
COMMENT ON COLUMN apflora.tpop."TPopNutzungszone" IS 'Nutzungszone';
COMMENT ON COLUMN apflora.tpop."TPopBewirtschafterIn" IS 'Wer bewirtschaftet die Fläche?';
COMMENT ON COLUMN apflora.tpop."TPopBewirtschaftung" IS 'Wie wird die Fläche bewirtschaftet?';
COMMENT ON COLUMN apflora.tpop."TPopTxt" IS 'Bemerkungen zur Teilpopulation';
COMMENT ON COLUMN apflora.tpop."TPopGuid" IS 'GUID der Tabelle "tpop"';
COMMENT ON COLUMN apflora.tpop."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpop."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.tpop USING btree ("PopId");
CREATE UNIQUE INDEX ON apflora.tpop USING btree ("TPopGuid");
CREATE INDEX ON apflora.tpop USING btree ("TPopHerkunft");
CREATE INDEX ON apflora.tpop USING btree ("TPopApBerichtRelevant");
CREATE INDEX ON apflora.tpop USING btree ("TPopXKoord");
CREATE INDEX ON apflora.tpop USING btree ("TPopYKoord");
CREATE INDEX ON apflora.tpop USING btree ("TPopNr");
CREATE INDEX ON apflora.tpop USING btree ("TPopGemeinde");
CREATE INDEX ON apflora.tpop USING btree ("TPopFlurname");

DROP TABLE IF EXISTS apflora.tpop_apberrelevant_werte;
CREATE TABLE apflora.tpop_apberrelevant_werte (
  "DomainCode" integer PRIMARY KEY,
  "DomainTxt" text,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) NOT NULL
);
COMMENT ON COLUMN apflora.tpop_apberrelevant_werte."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpop_apberrelevant_werte."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.tpop_entwicklung_werte;
CREATE TABLE apflora.tpop_entwicklung_werte (
  "EntwicklungCode" integer PRIMARY KEY,
  "EntwicklungTxt" varchar(50) DEFAULT NULL,
  "EntwicklungOrd" smallint DEFAULT NULL,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) NOT NULL
);
COMMENT ON COLUMN apflora.tpop_entwicklung_werte."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpop_entwicklung_werte."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.tpopber;
CREATE TABLE apflora.tpopber (
  "TPopBerId" SERIAL PRIMARY KEY,
  "TPopId" integer DEFAULT NULL REFERENCES apflora.tpop ("TPopId") ON DELETE CASCADE ON UPDATE CASCADE,
  "TPopBerJahr" smallint DEFAULT NULL,
  "TPopBerEntwicklung" integer DEFAULT NULL REFERENCES apflora.tpop_entwicklung_werte ("EntwicklungCode") ON DELETE SET NULL ON UPDATE CASCADE,
  "TPopBerTxt" text,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) DEFAULT NULL
);
SELECT setval(pg_get_serial_sequence('apflora.tpopber', 'TPopBerId'), coalesce(max("TPopBerId"), 0) + 1, false) FROM apflora.tpopber;
COMMENT ON COLUMN apflora.tpopber."TPopBerId" IS 'Primärschlüssel der Tabelle "tpopber"';
COMMENT ON COLUMN apflora.tpopber."TPopId" IS 'Zugehörige Teilpopulation. Fremdschlüssel der Tabelle "tpop"';
COMMENT ON COLUMN apflora.tpopber."TPopBerJahr" IS 'Für welches Jahr gilt der Bericht?';
COMMENT ON COLUMN apflora.tpopber."TPopBerEntwicklung" IS 'Beurteilung der Populationsentwicklung: Auswahl aus Tabelle "pop_entwicklung_werte"';
COMMENT ON COLUMN apflora.tpopber."TPopBerTxt" IS 'Bemerkungen zur Beurteilung';
COMMENT ON COLUMN apflora.tpopber."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopber."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.tpopber USING btree ("TPopId");
CREATE INDEX ON apflora.tpopber USING btree ("TPopBerEntwicklung");
CREATE INDEX ON apflora.tpopber USING btree ("TPopBerJahr");

DROP TABLE IF EXISTS apflora.tpopkontr;
CREATE TABLE apflora.tpopkontr (
  "TPopKontrId" SERIAL PRIMARY KEY,
  "TPopId" integer DEFAULT NULL REFERENCES apflora.tpop ("TPopId") ON DELETE CASCADE ON UPDATE CASCADE,
  "TPopKontrTyp" varchar(50) DEFAULT NULL,
  "TPopKontrDatum" date DEFAULT NULL,
  "TPopKontrJahr" smallint DEFAULT NULL,
  "TPopKontrBearb" integer DEFAULT NULL REFERENCES apflora.adresse ("AdrId") ON DELETE SET NULL ON UPDATE CASCADE,
  "TPopKontrJungpfl" integer DEFAULT NULL,
  "TPopKontrVitalitaet" text DEFAULT NULL,
  "TPopKontrUeberleb" smallint DEFAULT NULL,
  "TPopKontrEntwicklung" integer DEFAULT NULL REFERENCES apflora.tpop_entwicklung_werte ("EntwicklungCode") ON DELETE SET NULL ON UPDATE CASCADE,
  "TPopKontrUrsach" text DEFAULT NULL,
  "TPopKontrUrteil" text DEFAULT NULL,
  "TPopKontrAendUms" text DEFAULT NULL,
  "TPopKontrAendKontr" text DEFAULT NULL,
  "TPopKontrTxt" text,
  "TPopKontrLeb" text DEFAULT NULL,
  "TPopKontrFlaeche" integer DEFAULT NULL,
  "TPopKontrLebUmg" text DEFAULT NULL,
  "TPopKontrVegTyp" varchar(100) DEFAULT NULL,
  "TPopKontrKonkurrenz" varchar(100) DEFAULT NULL,
  "TPopKontrMoosschicht" varchar(100) DEFAULT NULL,
  "TPopKontrKrautschicht" varchar(100) DEFAULT NULL,
  "TPopKontrStrauchschicht" text DEFAULT NULL,
  "TPopKontrBaumschicht" varchar(100) DEFAULT NULL,
  "TPopKontrBodenTyp" text DEFAULT NULL,
  "TPopKontrBodenKalkgehalt" varchar(100) DEFAULT NULL,
  "TPopKontrBodenDurchlaessigkeit" varchar(100) DEFAULT NULL,
  "TPopKontrBodenHumus" varchar(100) DEFAULT NULL,
  "TPopKontrBodenNaehrstoffgehalt" varchar(100) DEFAULT NULL,
  "TPopKontrBodenAbtrag" text DEFAULT NULL,
  "TPopKontrWasserhaushalt" text DEFAULT NULL,
  "TPopKontrIdealBiotopUebereinst" integer DEFAULT NULL REFERENCES apflora.tpopkontr_idbiotuebereinst_werte ("DomainCode") ON DELETE SET NULL ON UPDATE CASCADE,
  "TPopKontrHandlungsbedarf" text,
  "TPopKontrUebFlaeche" integer DEFAULT NULL,
  "TPopKontrPlan" smallint DEFAULT NULL,
  "TPopKontrVeg" smallint DEFAULT NULL,
  "TPopKontrNaBo" smallint DEFAULT NULL,
  "TPopKontrUebPfl" smallint DEFAULT NULL,
  "TPopKontrJungPflJN" smallint DEFAULT NULL,
  "TPopKontrVegHoeMax" smallint DEFAULT NULL,
  "TPopKontrVegHoeMit" smallint DEFAULT NULL,
  "TPopKontrGefaehrdung" text DEFAULT NULL,
  "TPopKontrMutDat" date DEFAULT NULL,
  "TPopKontrGuid" UUID DEFAULT uuid_generate_v1mc(),
  "ZeitGuid" UUID DEFAULT uuid_generate_v1mc(),
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) DEFAULT NULL
);
SELECT setval(pg_get_serial_sequence('apflora.tpopkontr', 'TPopKontrId'), coalesce(max("TPopKontrId"), 0) + 1, false) FROM apflora.tpopkontr;
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrId" IS 'Primärschlüssel der Tabelle "tpopkontr"';
COMMENT ON COLUMN apflora.tpopkontr."TPopId" IS 'Zugehörige Teilpopulation. Fremdschlüssel aus der Tabelle "tpop"';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrTyp" IS 'Typ der Kontrolle. Auswahl aus Tabelle "tpopkontr_typ_werte"';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrDatum" IS 'Wann wurde kontrolliert?';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrJahr" IS 'In welchem Jahr wurde kontrolliert? Für welches Jahr gilt die Beschreibung?';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrBearb" IS 'Wer hat kontrolliert? Auswahl aus Tabelle "adresse"';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrJungpfl" IS 'Anzahl Jungpflanzen';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrVitalitaet" IS 'Vitalität der Pflanzen';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrUeberleb" IS 'Überlebensrate in Prozent';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrEntwicklung" IS 'Entwicklung des Bestandes. Auswahl aus Tabelle "pop_entwicklung_werte"';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrUrsach" IS 'Ursachen der Entwicklung';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrUrteil" IS 'Erfolgsbeurteilung';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrAendUms" IS 'Vorschlag für Änderung der Umsetzung';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrAendKontr" IS 'Vorschlag für Änderung der Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrTxt" IS 'Bemerkungen zur Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrLeb" IS 'Lebensraumtyp nach Delarze';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrFlaeche" IS 'Fläche der Teilpopulation';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrLebUmg" IS 'Lebensraumtyp der direkt angrenzenden Umgebung (nach Delarze)';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrVegTyp" IS 'Vegetationstyp';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrKonkurrenz" IS 'Konkurrenz';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrMoosschicht" IS 'Moosschicht';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrKrautschicht" IS 'Krautschicht';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrStrauchschicht" IS 'Strauchschicht, ehemals Verbuschung (%)';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrBaumschicht" IS 'Baumschicht';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrBodenTyp" IS 'Bodentyp';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrBodenKalkgehalt" IS 'Kalkgehalt des Bodens';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrBodenDurchlaessigkeit" IS 'Durchlässigkeit des Bodens';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrBodenHumus" IS 'Humusgehalt des Bodens';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrBodenNaehrstoffgehalt" IS 'Nährstoffgehalt des Bodens';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrBodenAbtrag" IS 'Oberbodenabtrag';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrWasserhaushalt" IS 'Wasserhaushalt';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrIdealBiotopUebereinst" IS 'Übereinstimmung mit dem Idealbiotop';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrHandlungsbedarf" IS 'Handlungsbedarf bezüglich Biotop';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrUebFlaeche" IS 'Überprüfte Fläche in m2. Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrPlan" IS 'Fläche / Wuchsort auf Plan eingezeichnet? Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrVeg" IS 'Von Pflanzen, Streu oder Moos bedeckter Boden (%). Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrNaBo" IS 'Flächenanteil nackter Boden (%). Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrUebPfl" IS 'Flächenanteil der überprüften Pflanzenart (%). Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrJungPflJN" IS 'Gibt es neben alten Pflanzen auch junge? Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrVegHoeMax" IS 'Maximale Vegetationshöhe in cm. Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrVegHoeMit" IS 'Mittlere Vegetationshöhe in cm. Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrGefaehrdung" IS 'Gefährdung. Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrMutDat" IS 'Letzte Mutation. Wird benötigt, um zu klären, welche Daten in den nationalen Kreislauf exportiert werden sollen';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrGuid" IS 'GUID. Wird u.a. verwendet für die Identifikation der Beobachtung im nationalen Beobachtungs-Daten-Kreislauf';
COMMENT ON COLUMN apflora.tpopkontr."ZeitGuid" IS 'GUID für den Export von Zeiten in EvAB';
COMMENT ON COLUMN apflora.tpopkontr."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopkontr."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.tpopkontr USING btree ("TPopId");
CREATE INDEX ON apflora.tpopkontr USING btree ("TPopKontrBearb");
CREATE INDEX ON apflora.tpopkontr USING btree ("TPopKontrEntwicklung");
CREATE INDEX ON apflora.tpopkontr USING btree ("TPopKontrIdealBiotopUebereinst");
CREATE INDEX ON apflora.tpopkontr USING btree ("TPopKontrJahr");
CREATE INDEX ON apflora.tpopkontr USING btree ("TPopKontrTyp");
CREATE INDEX ON apflora.tpopkontr USING btree ("TPopKontrDatum");
CREATE UNIQUE INDEX ON apflora.tpopkontr USING btree ("ZeitGuid");
CREATE UNIQUE INDEX ON apflora.tpopkontr USING btree ("TPopKontrGuid");

DROP TABLE IF EXISTS apflora.tpopkontr_idbiotuebereinst_werte;
CREATE TABLE apflora.tpopkontr_idbiotuebereinst_werte (
  "DomainCode" integer PRIMARY KEY,
  "DomainTxt" varchar(50) DEFAULT NULL,
  "DomainOrd" smallint DEFAULT NULL,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) NOT NULL
);
COMMENT ON COLUMN apflora.tpopkontr_idbiotuebereinst_werte."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopkontr_idbiotuebereinst_werte."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.tpopkontr_typ_werte;
CREATE TABLE apflora.tpopkontr_typ_werte (
  "DomainCode" integer PRIMARY KEY,
  "DomainTxt" varchar(50) DEFAULT NULL,
  "DomainOrd" smallint DEFAULT NULL,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) NOT NULL
);
COMMENT ON COLUMN apflora.tpopkontr_typ_werte."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopkontr_typ_werte."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.tpopkontr_typ_werte USING btree ("DomainTxt");

DROP TABLE IF EXISTS apflora.tpopkontrzaehl;
CREATE TABLE apflora.tpopkontrzaehl (
  "TPopKontrZaehlId" SERIAL PRIMARY KEY,
  "TPopKontrId" integer DEFAULT NULL REFERENCES apflora.tpopkontr ("TPopKontrId") ON DELETE CASCADE ON UPDATE CASCADE,
  "Anzahl" integer DEFAULT NULL,
  "Zaehleinheit" integer DEFAULT NULL REFERENCES apflora.tpopkontrzaehl_einheit_werte ("ZaehleinheitCode") ON DELETE SET NULL ON UPDATE CASCADE,
  "Methode" integer DEFAULT NULL REFERENCES apflora.tpopkontrzaehl_methode_werte ("BeurteilCode") ON DELETE SET NULL ON UPDATE CASCADE,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) DEFAULT NULL
);
SELECT setval(pg_get_serial_sequence('apflora.tpopkontrzaehl', 'TPopKontrZaehlId'), coalesce(max("TPopKontrZaehlId"), 0) + 1, false) FROM apflora.tpopkontrzaehl;
COMMENT ON COLUMN apflora.tpopkontrzaehl."Anzahl" IS 'Anzahl Zaehleinheiten';
COMMENT ON COLUMN apflora.tpopkontrzaehl."Zaehleinheit" IS 'Verwendete Zaehleinheit. Auswahl aus Tabelle "tpopkontrzaehl_einheit_werte"';
COMMENT ON COLUMN apflora.tpopkontrzaehl."Methode" IS 'Verwendete Methodik. Auswahl aus Tabelle "tpopkontrzaehl_methode_werte"';
COMMENT ON COLUMN apflora.tpopkontrzaehl."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopkontrzaehl."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.tpopkontrzaehl USING btree ("TPopKontrId");
CREATE INDEX ON apflora.tpopkontrzaehl USING btree ("Anzahl");
CREATE INDEX ON apflora.tpopkontrzaehl USING btree ("Zaehleinheit");
CREATE INDEX ON apflora.tpopkontrzaehl USING btree ("Methode");

DROP TABLE IF EXISTS apflora.tpopkontrzaehl_einheit_werte;
CREATE TABLE apflora.tpopkontrzaehl_einheit_werte (
  "ZaehleinheitCode" integer PRIMARY KEY,
  "ZaehleinheitTxt" varchar(50) DEFAULT NULL,
  "ZaehleinheitOrd" smallint DEFAULT NULL,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) NOT NULL
);
COMMENT ON COLUMN apflora.tpopkontrzaehl_einheit_werte."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopkontrzaehl_einheit_werte."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.tpopkontrzaehl_methode_werte;
CREATE TABLE apflora.tpopkontrzaehl_methode_werte (
  "BeurteilCode" integer PRIMARY KEY,
  "BeurteilTxt" varchar(50) DEFAULT NULL,
  "BeurteilOrd" smallint DEFAULT NULL,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) NOT NULL
);
COMMENT ON COLUMN apflora.tpopkontrzaehl_methode_werte."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopkontrzaehl_methode_werte."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.tpopmassn;
CREATE TABLE apflora.tpopmassn (
  "TPopMassnId" SERIAL PRIMARY KEY,
  "TPopId" integer DEFAULT NULL REFERENCES apflora.tpop ("TPopId") ON DELETE CASCADE ON UPDATE CASCADE,
  "TPopMassnTyp" integer DEFAULT NULL REFERENCES apflora.tpopmassn_typ_werte ("MassnTypCode") ON DELETE SET NULL ON UPDATE CASCADE,
  "TPopMassnTxt" text DEFAULT NULL,
  "TPopMassnJahr" smallint DEFAULT NULL,
  "TPopMassnDatum" date DEFAULT NULL,
  "TPopMassnBearb" integer DEFAULT NULL REFERENCES apflora.adresse ("AdrId") ON DELETE SET NULL ON UPDATE CASCADE,
  "TPopMassnBemTxt" text,
  "TPopMassnPlan" smallint DEFAULT NULL,
  "TPopMassnPlanBez" text DEFAULT NULL,
  "TPopMassnFlaeche" integer DEFAULT NULL,
  "TPopMassnMarkierung" text DEFAULT NULL,
  "TPopMassnAnsiedAnzTriebe" integer DEFAULT NULL,
  "TPopMassnAnsiedAnzPfl" integer DEFAULT NULL,
  "TPopMassnAnzPflanzstellen" integer DEFAULT NULL,
  "TPopMassnAnsiedWirtspfl" text DEFAULT NULL,
  "TPopMassnAnsiedHerkunftPop" text DEFAULT NULL,
  "TPopMassnAnsiedDatSamm" varchar(50) DEFAULT NULL,
  "TPopMassnAnsiedForm" text DEFAULT NULL,
  "TPopMassnAnsiedPflanzanordnung" text DEFAULT NULL,
  "TPopMassnGuid" UUID UNIQUE DEFAULT uuid_generate_v1mc(),
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) DEFAULT NULL
);
SELECT setval(pg_get_serial_sequence('apflora.tpopmassn', 'TPopMassnId'), coalesce(max("TPopMassnId"), 0) + 1, false) FROM apflora.tpopmassn;
COMMENT ON COLUMN apflora.tpopmassn."TPopMassnId" IS 'Primärschlüssel der Tabelle "tpopmassn"';
COMMENT ON COLUMN apflora.tpopmassn."TPopId" IS 'Zugehörige Teilpopulation. Fremdschlüssel aus der Tabelle "tpop"';
COMMENT ON COLUMN apflora.tpopmassn."TPopMassnTyp" IS 'Typ der Massnahme. Auswahl aus Tabelle "tpopmassn_typ_werte"';
COMMENT ON COLUMN apflora.tpopmassn."TPopMassnTxt" IS 'Was wurde gemacht? V.a. für Typ "Spezial"';
COMMENT ON COLUMN apflora.tpopmassn."TPopMassnJahr" IS 'Jahr, in dem die Massnahme durchgeführt wurde';
COMMENT ON COLUMN apflora.tpopmassn."TPopMassnDatum" IS 'Datum, an dem die Massnahme durchgeführt wurde';
COMMENT ON COLUMN apflora.tpopmassn."TPopMassnBearb" IS 'Verantwortliche BearbeiterIn. Auswahl aus Tabelle "adresse"';
COMMENT ON COLUMN apflora.tpopmassn."TPopMassnBemTxt" IS 'Bemerkungen zur Massnahme';
COMMENT ON COLUMN apflora.tpopmassn."TPopMassnPlan" IS 'Existiert ein Plan?';
COMMENT ON COLUMN apflora.tpopmassn."TPopMassnPlanBez" IS 'Bezeichnung auf dem Plan';
COMMENT ON COLUMN apflora.tpopmassn."TPopMassnFlaeche" IS 'Fläche der Massnahme bzw. Teilpopulation (m2)';
COMMENT ON COLUMN apflora.tpopmassn."TPopMassnMarkierung" IS 'Markierung der Massnahme bzw. Teilpopulation';
COMMENT ON COLUMN apflora.tpopmassn."TPopMassnAnsiedAnzTriebe" IS 'Anzahl angesiedelte Triebe';
COMMENT ON COLUMN apflora.tpopmassn."TPopMassnAnsiedAnzPfl" IS 'Anzahl angesiedelte Pflanzen';
COMMENT ON COLUMN apflora.tpopmassn."TPopMassnAnzPflanzstellen" IS 'Anzahl Töpfe/Pflanzstellen';
COMMENT ON COLUMN apflora.tpopmassn."TPopMassnAnsiedWirtspfl" IS 'Wirtspflanze';
COMMENT ON COLUMN apflora.tpopmassn."TPopMassnAnsiedHerkunftPop" IS 'Aus welcher Population stammt das Pflanzenmaterial?';
COMMENT ON COLUMN apflora.tpopmassn."TPopMassnAnsiedDatSamm" IS 'Datum, an dem die angesiedelten Pflanzen gesammelt wurden';
COMMENT ON COLUMN apflora.tpopmassn."TPopMassnAnsiedForm" IS 'Form, Grösse der Ansiedlung';
COMMENT ON COLUMN apflora.tpopmassn."TPopMassnAnsiedPflanzanordnung" IS 'Anordnung der Pflanzung';
COMMENT ON COLUMN apflora.tpopmassn."TPopMassnGuid" IS 'GUID der Tabelle "tpopmassn"';
COMMENT ON COLUMN apflora.tpopmassn."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopmassn."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.tpopmassn USING btree ("TPopId");
CREATE INDEX ON apflora.tpopmassn USING btree ("TPopMassnBearb");
CREATE INDEX ON apflora.tpopmassn USING btree ("TPopMassnTyp");
CREATE INDEX ON apflora.tpopmassn USING btree ("TPopMassnJahr");
CREATE UNIQUE INDEX ON apflora.tpopmassn USING btree ("TPopMassnGuid");

DROP TABLE IF EXISTS apflora.tpopmassn_erfbeurt_werte;
CREATE TABLE apflora.tpopmassn_erfbeurt_werte (
  "BeurteilId" integer PRIMARY KEY,
  "BeurteilTxt" varchar(50) DEFAULT NULL,
  "BeurteilOrd" smallint DEFAULT NULL,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) NOT NULL
);
COMMENT ON COLUMN apflora.tpopmassn_erfbeurt_werte."BeurteilTxt" IS 'Wie werden die durchgefuehrten Massnahmen beurteilt?';
COMMENT ON COLUMN apflora.tpopmassn_erfbeurt_werte."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopmassn_erfbeurt_werte."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.tpopmassn_typ_werte;
CREATE TABLE apflora.tpopmassn_typ_werte (
  "MassnTypCode" integer PRIMARY KEY,
  "MassnTypTxt" varchar(50) DEFAULT NULL,
  "MassnTypOrd" smallint DEFAULT NULL,
  "MassnAnsiedlung" smallint NOT NULL,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) NOT NULL
);
COMMENT ON COLUMN apflora.tpopmassn_typ_werte."MassnAnsiedlung" IS 'Handelt es sich um eine Ansiedlung?';
COMMENT ON COLUMN apflora.tpopmassn_typ_werte."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopmassn_typ_werte."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.tpopmassnber;
CREATE TABLE apflora.tpopmassnber (
  "TPopMassnBerId" SERIAL PRIMARY KEY,
  "TPopId" integer DEFAULT NULL REFERENCES apflora.tpop ("TPopId") ON DELETE CASCADE ON UPDATE CASCADE,
  "TPopMassnBerJahr" smallint DEFAULT NULL,
  "TPopMassnBerErfolgsbeurteilung" integer DEFAULT NULL REFERENCES apflora.tpopmassn_erfbeurt_werte ("BeurteilId") ON DELETE SET NULL ON UPDATE CASCADE,
  "TPopMassnBerTxt" text,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) DEFAULT NULL
);
SELECT setval(pg_get_serial_sequence('apflora.tpopmassnber', 'TPopMassnBerId'), coalesce(max("TPopMassnBerId"), 0) + 1, false) FROM apflora.tpopmassnber;
COMMENT ON COLUMN apflora.tpopmassnber."TPopMassnBerId" IS 'Primärschlüssel der Tabelle "tpopmassnber"';
COMMENT ON COLUMN apflora.tpopmassnber."TPopId" IS 'Zugehörige Teilpopulation. Fremdschlüssel aus Tabelle "tpop"';
COMMENT ON COLUMN apflora.tpopmassnber."TPopMassnBerJahr" IS 'Jahr, für den der Bericht gilt';
COMMENT ON COLUMN apflora.tpopmassnber."TPopMassnBerErfolgsbeurteilung" IS 'Beurteilung des Erfolgs. Auswahl aus Tabelle "tpopmassn_erfbeurt_werte"';
COMMENT ON COLUMN apflora.tpopmassnber."TPopMassnBerTxt" IS 'Bemerkungen zur Beurteilung';
COMMENT ON COLUMN apflora.tpopmassnber."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopmassnber."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.tpopmassnber USING btree ("TPopId");
CREATE INDEX ON apflora.tpopmassnber USING btree ("TPopMassnBerErfolgsbeurteilung");
CREATE INDEX ON apflora.tpopmassnber USING btree ("TPopMassnBerJahr");

DROP TABLE IF EXISTS apflora.user;
CREATE TABLE apflora.user (
  "UserId" SERIAL PRIMARY KEY,
  "UserName" varchar(30) NOT NULL UNIQUE,
  "Passwort" text NOT NULL,
  "NurLesen" smallint DEFAULT '-1'
);
SELECT setval(pg_get_serial_sequence('apflora."user"', 'UserId'), coalesce(max("UserId"), 0) + 1, false) FROM apflora."user";
COMMENT ON COLUMN apflora."user"."UserId" IS 'Primärschlüssel der Tabelle "user"';
COMMENT ON COLUMN apflora."user"."UserName" IS 'Username';
COMMENT ON COLUMN apflora."user"."Passwort" IS 'Passwort';
COMMENT ON COLUMN apflora."user"."NurLesen" IS 'Hier -1 setzen, wenn ein User keine Daten ändern darf';

DROP TABLE IF EXISTS apflora.message CASCADE;
CREATE TABLE apflora.message (
  "id" SERIAL PRIMARY KEY,
  "message" text NOT NULL,
  "time" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- active is used to prevent to many datasets fro being fetched
  -- old messages can be set inactive, expecially if read by all
  "active" boolean NOT NULL DEFAULT 'true'
);
COMMENT ON COLUMN apflora.message."message" IS 'Nachricht an die Benutzer';

-- list of read messages per user
DROP TABLE IF EXISTS apflora.usermessage;
CREATE TABLE apflora.usermessage (
  "UserName" varchar(30) NOT NULL REFERENCES apflora.user ("UserName") ON DELETE CASCADE ON UPDATE CASCADE,
  "MessageId" integer NOT NULL REFERENCES apflora.message ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE ("UserName", "MessageId")
);
CREATE INDEX ON apflora.usermessage USING btree ("UserName", "MessageId");

DROP TABLE IF EXISTS apflora.ziel;
CREATE TABLE apflora.ziel (
  "ZielId" SERIAL PRIMARY KEY,
  "ApArtId" integer NOT NULL REFERENCES apflora.ap ("ApArtId") ON DELETE CASCADE ON UPDATE CASCADE,
  "ZielTyp" integer DEFAULT NULL REFERENCES apflora.ziel_typ_werte ("ZieltypId") ON DELETE SET NULL ON UPDATE CASCADE,
  "ZielJahr" smallint DEFAULT NULL,
  "ZielBezeichnung" text,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) DEFAULT NULL
);
SELECT setval(pg_get_serial_sequence('apflora.ziel', 'ZielId'), coalesce(max("ZielId"), 0) + 1, false) FROM apflora.ziel;
COMMENT ON COLUMN apflora.ziel."ZielId" IS 'Primärschlüssel der Tabelle "ziel"';
COMMENT ON COLUMN apflora.ziel."ApArtId" IS 'Zugehöriger Aktionsplan. Fremdschluessel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.ziel."ZielTyp" IS 'Typ des Ziels. Z.B. Zwischenziel, Gesamtziel. Auswahl aus Tabelle "ziel_typ_werte"';
COMMENT ON COLUMN apflora.ziel."ZielJahr" IS 'In welchem Jahr soll das Ziel erreicht werden?';
COMMENT ON COLUMN apflora.ziel."ZielBezeichnung" IS 'Textliche Beschreibung des Ziels';
COMMENT ON COLUMN apflora.ziel."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ziel."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.ziel USING btree ("ApArtId");
CREATE INDEX ON apflora.ziel USING btree ("ZielTyp");

DROP TABLE IF EXISTS apflora.ziel_typ_werte;
CREATE TABLE apflora.ziel_typ_werte (
  "ZieltypId" integer PRIMARY KEY,
  "ZieltypTxt" varchar(50) DEFAULT NULL,
  "ZieltypOrd" smallint DEFAULT NULL,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) NOT NULL
);
COMMENT ON COLUMN apflora.ziel_typ_werte."ZieltypTxt" IS 'Beschreibung des Ziels';
COMMENT ON COLUMN apflora.ziel_typ_werte."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ziel_typ_werte."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.zielber;
CREATE TABLE apflora.zielber (
  "ZielBerId" SERIAL PRIMARY KEY,
  "ZielId" integer DEFAULT NULL REFERENCES apflora.ziel ("ZielId") ON DELETE CASCADE ON UPDATE CASCADE,
  "ZielBerJahr" smallint DEFAULT NULL,
  "ZielBerErreichung" text DEFAULT NULL,
  "ZielBerTxt" text DEFAULT NULL,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) DEFAULT NULL
);
SELECT setval(pg_get_serial_sequence('apflora.zielber', 'ZielBerId'), coalesce(max("ZielBerId"), 0) + 1, false) FROM apflora.zielber;
COMMENT ON COLUMN apflora.zielber."ZielBerId" IS 'Primärschlüssel der Tabelle "zielber"';
COMMENT ON COLUMN apflora.zielber."ZielId" IS 'Zugehöriges Ziel. Fremdschlüssel aus der Tabelle "ziel"';
COMMENT ON COLUMN apflora.zielber."ZielBerJahr" IS 'Für welches Jahr gilt der Bericht?';
COMMENT ON COLUMN apflora.zielber."ZielBerErreichung" IS 'Beurteilung der Zielerreichung';
COMMENT ON COLUMN apflora.zielber."ZielBerTxt" IS 'Bemerkungen zur Zielerreichung';
COMMENT ON COLUMN apflora.zielber."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.zielber."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.zielber USING btree ("ZielId");
