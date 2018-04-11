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
  "EvabIdPerson" UUID DEFAULT NULL,
  "MutWann" date DEFAULT NOW(),
  "MutWer" varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
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
CREATE INDEX ON apflora.adresse USING btree ("AdrId");
CREATE INDEX ON apflora.adresse USING btree ("AdrName");

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
  "MutWann" date DEFAULT NOW(),
  "MutWer" varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
);
COMMENT ON COLUMN apflora.ap."ApArtId" IS 'Primärschlüssel der Tabelle "ap". = SISF-Nr';
COMMENT ON COLUMN apflora.ap."ApStatus" IS 'In welchem Bearbeitungsstand befindet sich der AP?';
COMMENT ON COLUMN apflora.ap."ApJahr" IS 'Wann wurde mit der Umsetzung des Aktionsplans begonnen?';
COMMENT ON COLUMN apflora.ap."ApUmsetzung" IS 'In welchem Umsetzungsstand befindet sich der AP?';
COMMENT ON COLUMN apflora.ap."ApBearb" IS 'Verantwortliche(r) für die Art';
COMMENT ON COLUMN apflora.ap."ApArtwert" IS 'redundant aber erspart viele Abfragen. Wird aktualisiert, wenn alexande_beob.ArtenDb_Arteigenschaften aktualisiert wird';
COMMENT ON COLUMN apflora.ap."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ap."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.ap USING btree ("ApArtId");
CREATE INDEX ON apflora.ap USING btree ("ProjId");
CREATE INDEX ON apflora.ap USING btree ("ApStatus");
CREATE INDEX ON apflora.ap USING btree ("ApUmsetzung");
CREATE INDEX ON apflora.ap USING btree ("ApBearb");
CREATE UNIQUE INDEX ON apflora.ap USING btree ("ApGuid");


DROP TABLE IF EXISTS apflora.userprojekt;
CREATE TABLE apflora.userprojekt (
  "UserName" varchar(30) REFERENCES basic_auth.users (name) ON DELETE CASCADE ON UPDATE CASCADE,
  "ProjId" integer REFERENCES apflora.projekt ("ProjId") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX ON apflora.userprojekt USING btree ("UserName", "ProjId");

DROP TABLE IF EXISTS apflora.ap_bearbstand_werte;
CREATE TABLE apflora.ap_bearbstand_werte (
  "DomainCode" integer PRIMARY KEY,
  "DomainTxt" varchar(50) DEFAULT NULL,
  "DomainOrd" smallint DEFAULT NULL,
  "MutWann" date DEFAULT NOW(),
  "MutWer" varchar(20) NOT NULL
);
COMMENT ON COLUMN apflora.ap_bearbstand_werte."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ap_bearbstand_werte."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.ap_bearbstand_werte USING btree ("DomainCode");
CREATE INDEX ON apflora.ap_bearbstand_werte USING btree ("DomainOrd");

DROP TABLE IF EXISTS apflora.ap_erfbeurtkrit_werte;
CREATE TABLE apflora.ap_erfbeurtkrit_werte (
  "DomainCode" integer PRIMARY KEY,
  "DomainTxt" varchar(50) DEFAULT NULL,
  "DomainOrd" smallint DEFAULT NULL,
  "MutWann" date DEFAULT NOW(),
  "MutWer" varchar(20) NOT NULL
);
COMMENT ON COLUMN apflora.ap_erfbeurtkrit_werte."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ap_erfbeurtkrit_werte."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.ap_erfbeurtkrit_werte USING btree ("DomainCode");
CREATE INDEX ON apflora.ap_erfbeurtkrit_werte USING btree ("DomainOrd");

DROP TABLE IF EXISTS apflora.ap_erfkrit_werte;
CREATE TABLE apflora.ap_erfkrit_werte (
  "BeurteilId" integer PRIMARY KEY,
  "BeurteilTxt" varchar(50) DEFAULT NULL,
  "BeurteilOrd" smallint DEFAULT NULL,
  "MutWann" date DEFAULT NOW(),
  "MutWer" varchar(20) NOT NULL
);
COMMENT ON COLUMN apflora.ap_erfkrit_werte."BeurteilTxt" IS 'Wie werden die durchgefuehrten Massnahmen beurteilt?';
COMMENT ON COLUMN apflora.ap_erfkrit_werte."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ap_erfkrit_werte."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.ap_erfkrit_werte USING btree ("BeurteilId");
CREATE INDEX ON apflora.ap_erfkrit_werte USING btree ("BeurteilOrd");

DROP TABLE IF EXISTS apflora.ap_umsetzung_werte;
CREATE TABLE apflora.ap_umsetzung_werte (
  "DomainCode" integer PRIMARY KEY,
  "DomainTxt" varchar(50) DEFAULT NULL,
  "DomainOrd" smallint DEFAULT NULL,
  "MutWann" date DEFAULT NOW(),
  "MutWer" varchar(20) NOT NULL
);
COMMENT ON COLUMN apflora.ap_umsetzung_werte."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ap_umsetzung_werte."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.ap_umsetzung_werte USING btree ("DomainCode");
CREATE INDEX ON apflora.ap_umsetzung_werte USING btree ("DomainOrd");

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
  "JBerCAktivApbearb" text,
  "JBerCVerglAusfPl" text,
  "JBerDTxt" text,
  "JBerDatum" date DEFAULT NULL,
  "JBerBearb" integer DEFAULT NULL REFERENCES apflora.adresse ("AdrId") ON DELETE SET NULL ON UPDATE CASCADE,
  "MutWann" date DEFAULT NOW(),
  "MutWer" varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
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
COMMENT ON COLUMN apflora.apber."JBerCAktivApbearb" IS 'Bemerkungen zum Aussagebereich C: Weitere Aktivitäten der Aktionsplan-Verantwortlichen';
COMMENT ON COLUMN apflora.apber."JBerCVerglAusfPl" IS 'Bemerkungen zum Aussagebereich C: Vergleich Ausführung/Planung';
COMMENT ON COLUMN apflora.apber."JBerDTxt" IS 'Bemerkungen zum Aussagebereich D: Einschätzung der Wirkung des AP insgesamt pro Art';
COMMENT ON COLUMN apflora.apber."JBerDatum" IS 'Datum der Nachführung';
COMMENT ON COLUMN apflora.apber."JBerBearb" IS 'BerichtsverfasserIn: Auswahl aus der Tabelle "adresse"';
COMMENT ON COLUMN apflora.apber."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.apber."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.apber USING btree ("JBerId");
CREATE INDEX ON apflora.apber USING btree ("ApArtId");
CREATE INDEX ON apflora.apber USING btree ("JBerBeurteilung");
CREATE INDEX ON apflora.apber USING btree ("JBerBearb");
CREATE INDEX ON apflora.apber USING btree ("JBerJahr");
SELECT setval(pg_get_serial_sequence('apflora.apber', 'JBerId'), coalesce(max("JBerId"), 0) + 1, false) FROM apflora.apber;

DROP TABLE IF EXISTS apflora.apberuebersicht;
CREATE TABLE apflora.apberuebersicht (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  id_old integer,
  proj_id integer DEFAULT 1,
  jahr smallint,
  bemerkungen text,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT current_setting('request.jwt.claim.username', true),
  unique (proj_id, jahr)
);
CREATE INDEX ON apflora.apberuebersicht USING btree (id);
CREATE INDEX ON apflora.apberuebersicht USING btree (jahr);
CREATE INDEX ON apflora.apberuebersicht USING btree (proj_id);
COMMENT ON COLUMN apflora.apberuebersicht.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.apberuebersicht.id_old IS 'frühere id';
COMMENT ON COLUMN apflora.apberuebersicht.proj_id IS 'Zugehöriges Projekt. Zusammen mit jahr eindeutig';
COMMENT ON COLUMN apflora.apberuebersicht.jahr IS 'Berichtsjahr. Zusammen mit proj_id eindeutig';
COMMENT ON COLUMN apflora.apberuebersicht.bemerkungen IS 'Bemerkungen zur Artübersicht';
COMMENT ON COLUMN apflora.apberuebersicht.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.apberuebersicht.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.assozart;
CREATE TABLE apflora.assozart (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  id_old integer DEFAULT NULL,
  ap_id integer DEFAULT NULL REFERENCES apflora.ap ("ApArtId") ON DELETE CASCADE ON UPDATE CASCADE,
  ae_id UUID DEFAULT NULL REFERENCES apflora.adb_eigenschaften ("GUID") ON DELETE SET NULL ON UPDATE CASCADE,
  bemerkungen text,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
);
CREATE INDEX ON apflora.assozart USING btree (id);
CREATE INDEX ON apflora.assozart USING btree (ap_id);
CREATE INDEX ON apflora.assozart USING btree (ae_id);
COMMENT ON COLUMN apflora.assozart.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.assozart.id_old IS 'frühere id';
COMMENT ON COLUMN apflora.assozart.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.assozart.bemerkungen IS 'Bemerkungen zur Assoziation';
COMMENT ON COLUMN apflora.assozart.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.assozart.changed_by IS 'Wer hat den Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.tpopbeob;
CREATE TABLE apflora.tpopbeob (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  id_old integer,
  beob_id integer PRIMARY KEY,
  "QuelleId" integer Default Null REFERENCES beob.beob_quelle (id) ON DELETE SET NULL ON UPDATE CASCADE,
  tpop_id integer DEFAULT NULL REFERENCES apflora.tpop ("TPopId") ON DELETE CASCADE ON UPDATE CASCADE,
  nicht_zuordnen smallint DEFAULT NULL,
  bemerkungen text,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
);
COMMENT ON COLUMN apflora.tpopbeob.beob_id IS 'Primärschlüssel: ID aus beob.beob';
COMMENT ON COLUMN apflora.tpopbeob.tpop_id IS 'Dieser Teilpopulation wurde die Beobachtung zugeordnet. Fremdschlüssel aus der Tabelle "tpop"';
COMMENT ON COLUMN apflora.tpopbeob.nicht_zuordnen IS 'Ja oder nein. Wird ja gesetzt, wenn eine Beobachtung keiner Teilpopulation zugeordnet werden kann. Sollte im Bemerkungsfeld begründet werden. In der Regel ist die Artbestimmung zweifelhaft. Oder die Beobachtung ist nicht (genau genug) lokalisierbar';
COMMENT ON COLUMN apflora.tpopbeob.bemerkungen IS 'Bemerkungen zur Zuordnung';
COMMENT ON COLUMN apflora.tpopbeob.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopbeob.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.tpopbeob USING btree (id);
CREATE INDEX ON apflora.tpopbeob USING btree (beob_id);
CREATE INDEX ON apflora.tpopbeob USING btree ("QuelleId");
CREATE INDEX ON apflora.tpopbeob USING btree (tpop_id);
CREATE INDEX ON apflora.tpopbeob USING btree (nicht_zuordnen);

DROP TABLE IF EXISTS apflora.projekt;
CREATE TABLE apflora.projekt (
  "ProjId" SERIAL PRIMARY KEY,
  "ProjName" varchar(150) DEFAULT NULL,
  "MutWann" date DEFAULT NOW(),
  "MutWer" varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
);
CREATE INDEX ON apflora.projekt USING btree ("ProjId");
CREATE INDEX ON apflora.projekt USING btree ("ProjName");
COMMENT ON COLUMN apflora.projekt."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.projekt."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
INSERT INTO apflora.projekt VALUES (1, 'AP Flora Kt. ZH');

DROP TABLE IF EXISTS apflora.ber;
CREATE TABLE apflora.ber (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  id_old integer DEFAULT NULL,
  ap_id integer DEFAULT NULL REFERENCES apflora.ap ("ApArtId") ON DELETE CASCADE ON UPDATE CASCADE,
  autor varchar(150) DEFAULT NULL,
  jahr smallint DEFAULT NULL,
  titel text DEFAULT NULL,
  url text DEFAULT NULL,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
);
CREATE INDEX ON apflora.ber USING btree (id);
CREATE INDEX ON apflora.ber USING btree (ap_id);
CREATE INDEX ON apflora.ber USING btree (jahr);
COMMENT ON COLUMN apflora.ber.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.ber.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.ber.autor IS 'Autor des Berichts';
COMMENT ON COLUMN apflora.ber.jahr IS 'Jahr der Publikation';
COMMENT ON COLUMN apflora.ber.titel IS 'Titel des Berichts';
COMMENT ON COLUMN apflora.ber.url IS 'Link zum Bericht';
COMMENT ON COLUMN apflora.ber.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ber.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.erfkrit;
CREATE TABLE apflora.erfkrit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  id_old integer DEFAULT NULL,
  ap_id integer NOT NULL DEFAULT '0' REFERENCES apflora.ap ("ApArtId") ON DELETE CASCADE ON UPDATE CASCADE,
  erfolg integer DEFAULT NULL REFERENCES apflora.ap_erfkrit_werte ("BeurteilId") ON DELETE SET NULL ON UPDATE CASCADE,
  kriterien text DEFAULT NULL,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
);
COMMENT ON COLUMN apflora.erfkrit.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.erfkrit.id_old IS 'frühere id';
COMMENT ON COLUMN apflora.erfkrit.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.erfkrit.erfolg IS 'Wie gut werden die Ziele erreicht? Auswahl aus der Tabelle "ap_erfbeurtkrit_werte"';
COMMENT ON COLUMN apflora.erfkrit.kriterien IS 'Beschreibung der Kriterien für den Erfolg';
COMMENT ON COLUMN apflora.erfkrit.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.erfkrit.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.erfkrit USING btree (id);
CREATE INDEX ON apflora.erfkrit USING btree (ap_id);
CREATE INDEX ON apflora.erfkrit USING btree (erfolg);

DROP TABLE IF EXISTS apflora.gemeinde;
CREATE TABLE apflora.gemeinde (
  "BfsNr" integer PRIMARY KEY,
  "GmdName" varchar(50) DEFAULT NULL
);
CREATE INDEX ON apflora.gemeinde USING btree ("BfsNr");
CREATE INDEX ON apflora.gemeinde USING btree ("GmdName");

DROP TABLE IF EXISTS apflora.idealbiotop;
CREATE TABLE apflora.idealbiotop (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  ap_id integer UNIQUE DEFAULT NULL REFERENCES apflora.ap ("ApArtId") ON DELETE CASCADE ON UPDATE CASCADE,
  erstelldatum date DEFAULT NULL,
  hoehenlage text,
  region text,
  exposition text,
  besonnung text,
  hangneigung text,
  boden_typ text,
  boden_kalkgehalt text,
  boden_durchlaessigkeit text,
  boden_humus text,
  boden_naehrstoffgehalt text,
  wasserhaushalt text,
  konkurrenz text,
  moosschicht text,
  krautschicht text,
  strauchschicht text,
  baumschicht text,
  bemerkungen text,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
);
CREATE INDEX ON apflora.idealbiotop USING btree (id);
CREATE INDEX ON apflora.idealbiotop USING btree (ap_id);
COMMENT ON COLUMN apflora.idealbiotop.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.idealbiotop.ap_id IS 'Fremdschlüssel aus der Tabelle "ap (1:1-Beziehung)';
COMMENT ON COLUMN apflora.idealbiotop.erstelldatum IS 'Erstelldatum';
COMMENT ON COLUMN apflora.idealbiotop.hoehenlage IS 'Höhenlage';
COMMENT ON COLUMN apflora.idealbiotop.region IS 'Region';
COMMENT ON COLUMN apflora.idealbiotop.exposition IS 'Exposition';
COMMENT ON COLUMN apflora.idealbiotop.besonnung IS 'Besonnung';
COMMENT ON COLUMN apflora.idealbiotop.hangneigung IS 'Hangneigung';
COMMENT ON COLUMN apflora.idealbiotop.boden_typ IS 'Bodentyp';
COMMENT ON COLUMN apflora.idealbiotop.boden_kalkgehalt IS 'Kalkgehalt im Boden';
COMMENT ON COLUMN apflora.idealbiotop.boden_durchlaessigkeit IS 'Bodendurchlässigkeit';
COMMENT ON COLUMN apflora.idealbiotop.boden_humus IS 'Bodenhumusgehalt';
COMMENT ON COLUMN apflora.idealbiotop.boden_naehrstoffgehalt IS 'Bodennährstoffgehalt';
COMMENT ON COLUMN apflora.idealbiotop.wasserhaushalt IS 'Wasserhaushalt';
COMMENT ON COLUMN apflora.idealbiotop.konkurrenz IS 'Konkurrenz';
COMMENT ON COLUMN apflora.idealbiotop.moosschicht IS 'Moosschicht';
COMMENT ON COLUMN apflora.idealbiotop.krautschicht IS 'Krautschicht';
COMMENT ON COLUMN apflora.idealbiotop.strauchschicht IS 'Strauchschicht';
COMMENT ON COLUMN apflora.idealbiotop.baumschicht IS 'Baumschicht';
COMMENT ON COLUMN apflora.idealbiotop.bemerkungen IS 'Bemerkungen';
COMMENT ON COLUMN apflora.idealbiotop.changed IS 'Wann wurde der Datensatz zuletzt verändert?';
COMMENT ON COLUMN apflora.idealbiotop.changed_by IS 'Wer hat den Datensatz zuletzt verändert?';

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
  "PopXKoord" integer DEFAULT NULL CONSTRAINT zulaessige_x_koordinate CHECK ("PopXKoord" IS NULL OR ("PopXKoord" > 2485071 AND "PopXKoord" < 2828516)),
  "PopYKoord" integer DEFAULT NULL CONSTRAINT zulaessige_y_koordinate CHECK ("PopYKoord" IS NULL OR ("PopYKoord" > 1075346 AND "PopYKoord" < 1299942)),
  "PopGuid" UUID DEFAULT uuid_generate_v1mc(),
  "MutWann" date DEFAULT NOW(),
  "MutWer" varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
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
CREATE INDEX ON apflora.pop USING btree ("PopId");
CREATE INDEX ON apflora.pop USING btree ("ApArtId");
CREATE UNIQUE INDEX ON apflora.pop USING btree ("PopGuid");
CREATE INDEX ON apflora.pop USING btree ("PopHerkunft");
CREATE INDEX ON apflora.pop USING btree ("PopXKoord");
CREATE INDEX ON apflora.pop USING btree ("PopYKoord");
CREATE INDEX ON apflora.pop USING btree ("PopNr");
CREATE INDEX ON apflora.pop USING btree ("PopName");
CREATE INDEX ON apflora.pop USING btree ("PopBekanntSeit");

DROP TABLE IF EXISTS apflora.pop_status_werte;
CREATE TABLE apflora.pop_status_werte (
  "HerkunftId" integer PRIMARY KEY,
  "HerkunftTxt" varchar(60) DEFAULT NULL,
  "HerkunftOrd" smallint DEFAULT NULL,
  "MutWann" date DEFAULT NOW(),
  "MutWer" varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
);
CREATE INDEX ON apflora.pop_status_werte USING btree ("HerkunftId");
CREATE INDEX ON apflora.pop_status_werte USING btree ("HerkunftTxt");
CREATE INDEX ON apflora.pop_status_werte USING btree ("HerkunftOrd");
COMMENT ON COLUMN apflora.pop_status_werte."HerkunftTxt" IS 'Beschreibung der Herkunft';
COMMENT ON COLUMN apflora.pop_status_werte."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.pop_status_werte."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.popber;
CREATE TABLE apflora.popber (
  "PopBerId" SERIAL PRIMARY KEY,
  "PopId" integer DEFAULT NULL REFERENCES apflora.pop ("PopId") ON DELETE CASCADE ON UPDATE CASCADE,
  "PopBerJahr" smallint DEFAULT NULL,
  "PopBerEntwicklung" integer DEFAULT NULL REFERENCES apflora.tpop_entwicklung_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  "PopBerTxt" text,
  "MutWann" date DEFAULT NOW(),
  "MutWer" varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
  -- "MutWer" varchar(20) DEFAULT current_user
);
SELECT setval(pg_get_serial_sequence('apflora.popber', 'PopBerId'), coalesce(max("PopBerId"), 0) + 1, false) FROM apflora.popber;
COMMENT ON COLUMN apflora.popber."PopBerId" IS 'Primärschlüssel der Tabelle "popber"';
COMMENT ON COLUMN apflora.popber."PopId" IS 'Zugehörige Population. Fremdschlüssel aus der Tabelle "pop"';
COMMENT ON COLUMN apflora.popber."PopBerJahr" IS 'Für welches Jahr gilt der Bericht?';
COMMENT ON COLUMN apflora.popber."PopBerEntwicklung" IS 'Beurteilung der Populationsentwicklung: Auswahl aus Tabelle "tpop_entwicklung_werte"';
COMMENT ON COLUMN apflora.popber."PopBerTxt" IS 'Bemerkungen zur Beurteilung';
COMMENT ON COLUMN apflora.popber."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.popber."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.popber USING btree ("PopBerId");
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
  "MutWann" date DEFAULT NOW(),
  "MutWer" varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
);
SELECT setval(pg_get_serial_sequence('apflora.popmassnber', 'PopMassnBerId'), coalesce(max("PopMassnBerId"), 0) + 1, false) FROM apflora.popmassnber;
COMMENT ON COLUMN apflora.popmassnber."PopMassnBerId" IS 'Primärschlüssel der Tabelle "popmassnber"';
COMMENT ON COLUMN apflora.popmassnber."PopId" IS 'Zugehörige Population. Fremdschlüssel aus der Tabelle "pop"';
COMMENT ON COLUMN apflora.popmassnber."PopMassnBerJahr" IS 'Für welches Jahr gilt der Bericht?';
COMMENT ON COLUMN apflora.popmassnber."PopMassnBerErfolgsbeurteilung" IS 'Wie wird die Wirkung aller im Rahmen des AP durchgeführten Massnahmen beurteilt?';
COMMENT ON COLUMN apflora.popmassnber."PopMassnBerTxt" IS 'Bemerkungen zur Beurteilung';
COMMENT ON COLUMN apflora.popmassnber."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.popmassnber."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.popmassnber USING btree ("PopMassnBerId");
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
  "TPopXKoord" integer DEFAULT NULL CONSTRAINT zulaessige_x_koordinate CHECK ("TPopXKoord" IS NULL OR ("TPopXKoord" > 2485071 AND "TPopXKoord" < 2828516)),
  "TPopYKoord" integer DEFAULT NULL CONSTRAINT zulaessige_y_koordinate CHECK ("TPopYKoord" IS NULL OR ("TPopYKoord" > 1075346 AND "TPopYKoord" < 1299942)),
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
  "MutWann" date DEFAULT NOW(),
  "MutWer" varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
);
CREATE INDEX ON apflora.tpop USING btree ("TPopId");
CREATE INDEX ON apflora.tpop USING btree ("PopId");
CREATE UNIQUE INDEX ON apflora.tpop USING btree ("TPopGuid");
CREATE INDEX ON apflora.tpop USING btree ("TPopHerkunft");
CREATE INDEX ON apflora.tpop USING btree ("TPopApBerichtRelevant");
CREATE INDEX ON apflora.tpop USING btree ("TPopXKoord");
CREATE INDEX ON apflora.tpop USING btree ("TPopYKoord");
CREATE INDEX ON apflora.tpop USING btree ("TPopNr");
CREATE INDEX ON apflora.tpop USING btree ("TPopGemeinde");
CREATE INDEX ON apflora.tpop USING btree ("TPopFlurname");
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

DROP TABLE IF EXISTS apflora.tpop_apberrelevant_werte;
CREATE TABLE apflora.tpop_apberrelevant_werte (
  "DomainCode" integer PRIMARY KEY,
  "DomainTxt" text,
  "MutWann" date DEFAULT NOW(),
  "MutWer" varchar(20) NOT NULL
);
CREATE INDEX ON apflora.tpop_apberrelevant_werte USING btree ("DomainCode");
CREATE INDEX ON apflora.tpop_apberrelevant_werte USING btree ("DomainTxt");
COMMENT ON COLUMN apflora.tpop_apberrelevant_werte."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpop_apberrelevant_werte."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.tpop_entwicklung_werte;
CREATE TABLE apflora.tpop_entwicklung_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code integer UNIQUE DEFAULT NULL,
  code integer PRIMARY KEY,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  changed date DEFAULT NOW(),
  changed_by varchar(20) NOT NULL
);
CREATE INDEX ON apflora.tpop_entwicklung_werte USING btree (id);
CREATE INDEX ON apflora.tpop_entwicklung_werte USING btree (code);
CREATE INDEX ON apflora.tpop_entwicklung_werte USING btree (sort);
COMMENT ON COLUMN apflora.tpop_entwicklung_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.tpop_entwicklung_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpop_entwicklung_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.tpopber;
CREATE TABLE apflora.tpopber (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  id_old integer,
  tpop_id integer DEFAULT NULL REFERENCES apflora.tpop ("TPopId") ON DELETE CASCADE ON UPDATE CASCADE,
  jahr smallint DEFAULT NULL,
  entwicklung integer DEFAULT NULL REFERENCES apflora.tpop_entwicklung_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
);
COMMENT ON COLUMN apflora.tpopber.id IS 'Primärschlüssel der Tabelle "tpopber"';
COMMENT ON COLUMN apflora.tpopber.id_old IS 'frühere id';
COMMENT ON COLUMN apflora.tpopber.tpop_id IS 'Zugehörige Teilpopulation. Fremdschlüssel der Tabelle "tpop"';
COMMENT ON COLUMN apflora.tpopber.jahr IS 'Für welches Jahr gilt der Bericht?';
COMMENT ON COLUMN apflora.tpopber.entwicklung IS 'Beurteilung der Populationsentwicklung: Auswahl aus Tabelle "tpop_entwicklung_werte"';
COMMENT ON COLUMN apflora.tpopber.entwicklung IS 'Bemerkungen zur Beurteilung';
COMMENT ON COLUMN apflora.tpopber.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopber.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.tpopber USING btree (id);
CREATE INDEX ON apflora.tpopber USING btree (tpop_id);
CREATE INDEX ON apflora.tpopber USING btree (entwicklung);
CREATE INDEX ON apflora.tpopber USING btree (jahr);

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
  "TPopKontrEntwicklung" integer DEFAULT NULL REFERENCES apflora.tpop_entwicklung_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
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
  "TPopKontrIdealBiotopUebereinst" integer DEFAULT NULL REFERENCES apflora.tpopkontr_idbiotuebereinst_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
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
  "MutWann" date DEFAULT NOW(),
  "MutWer" varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
);
CREATE INDEX ON apflora.tpopkontr USING btree ("TPopKontrId");
CREATE INDEX ON apflora.tpopkontr USING btree ("TPopId");
CREATE INDEX ON apflora.tpopkontr USING btree ("TPopKontrBearb");
CREATE INDEX ON apflora.tpopkontr USING btree ("TPopKontrEntwicklung");
CREATE INDEX ON apflora.tpopkontr USING btree ("TPopKontrIdealBiotopUebereinst");
CREATE INDEX ON apflora.tpopkontr USING btree ("TPopKontrJahr");
CREATE INDEX ON apflora.tpopkontr USING btree ("TPopKontrTyp");
CREATE INDEX ON apflora.tpopkontr USING btree ("TPopKontrDatum");
CREATE UNIQUE INDEX ON apflora.tpopkontr USING btree ("ZeitGuid");
CREATE UNIQUE INDEX ON apflora.tpopkontr USING btree ("TPopKontrGuid");
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
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrEntwicklung" IS 'Entwicklung des Bestandes. Auswahl aus Tabelle "tpop_entwicklung_werte"';
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

DROP TABLE IF EXISTS apflora.tpopkontr_idbiotuebereinst_werte;
CREATE TABLE apflora.tpopkontr_idbiotuebereinst_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code integer UNIQUE DEFAULT NULL,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  changed date DEFAULT NOW(),
  changed_by varchar(20) NOT NULL
);
CREATE INDEX ON apflora.tpopkontr_idbiotuebereinst_werte USING btree (id);
CREATE INDEX ON apflora.tpopkontr_idbiotuebereinst_werte USING btree (code);
CREATE INDEX ON apflora.tpopkontr_idbiotuebereinst_werte USING btree (sort);
COMMENT ON COLUMN apflora.tpopkontr_idbiotuebereinst_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.tpopkontr_idbiotuebereinst_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopkontr_idbiotuebereinst_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.tpopkontr_typ_werte;
CREATE TABLE apflora.tpopkontr_typ_werte (
  "DomainCode" integer PRIMARY KEY,
  "DomainTxt" varchar(50) DEFAULT NULL,
  "DomainOrd" smallint DEFAULT NULL,
  "MutWann" date DEFAULT NOW(),
  "MutWer" varchar(20) NOT NULL
);
COMMENT ON COLUMN apflora.tpopkontr_typ_werte."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopkontr_typ_werte."MutWer" IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.tpopkontr_typ_werte USING btree ("DomainCode");
CREATE INDEX ON apflora.tpopkontr_typ_werte USING btree ("DomainTxt");
CREATE INDEX ON apflora.tpopkontr_typ_werte USING btree ("DomainOrd");

DROP TABLE IF EXISTS apflora.tpopkontrzaehl;
CREATE TABLE apflora.tpopkontrzaehl (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  -- old_id still exist...
  tpopkontr_id integer DEFAULT NULL REFERENCES apflora.tpopkontr ("TPopKontrId") ON DELETE CASCADE ON UPDATE CASCADE,
  anzahl integer DEFAULT NULL,
  einheit integer DEFAULT NULL REFERENCES apflora.tpopkontrzaehl_einheit_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  methode integer DEFAULT NULL REFERENCES apflora.tpopkontrzaehl_methode_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
);
COMMENT ON COLUMN apflora.tpopkontrzaehl.id_old IS 'frühere id';
COMMENT ON COLUMN apflora.tpopkontrzaehl.anzahl IS 'Anzahl Zaehleinheiten';
COMMENT ON COLUMN apflora.tpopkontrzaehl.einheit IS 'Verwendete Zaehleinheit. Auswahl aus Tabelle "tpopkontrzaehl_einheit_werte"';
COMMENT ON COLUMN apflora.tpopkontrzaehl.methode IS 'Verwendete Methodik. Auswahl aus Tabelle "tpopkontrzaehl_methode_werte"';
COMMENT ON COLUMN apflora.tpopkontrzaehl.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopkontrzaehl.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.tpopkontrzaehl USING btree (id);
CREATE INDEX ON apflora.tpopkontrzaehl USING btree (tpopkontr_id);
CREATE INDEX ON apflora.tpopkontrzaehl USING btree (anzahl);
CREATE INDEX ON apflora.tpopkontrzaehl USING btree (einheit);
CREATE INDEX ON apflora.tpopkontrzaehl USING btree (methode);

DROP TABLE IF EXISTS apflora.tpopkontrzaehl_einheit_werte;
CREATE TABLE apflora.tpopkontrzaehl_einheit_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code integer UNIQUE DEFAULT NULL,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  changed date DEFAULT NOW(),
  changed_by varchar(20) NOT NULL
);
CREATE INDEX ON apflora.tpopkontrzaehl_einheit_werte USING btree (id);
CREATE INDEX ON apflora.tpopkontrzaehl_einheit_werte USING btree (code);
CREATE INDEX ON apflora.tpopkontrzaehl_einheit_werte USING btree (sort);
COMMENT ON COLUMN apflora.tpopkontrzaehl_einheit_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.tpopkontrzaehl_einheit_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopkontrzaehl_einheit_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.tpopkontrzaehl_methode_werte;
CREATE TABLE apflora.tpopkontrzaehl_methode_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code integer UNIQUE DEFAULT NULL,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  changed date DEFAULT NOW(),
  changed_by varchar(20) NOT NULL
);
CREATE INDEX ON apflora.tpopkontrzaehl_methode_werte USING btree (id);
CREATE INDEX ON apflora.tpopkontrzaehl_methode_werte USING btree (code);
CREATE INDEX ON apflora.tpopkontrzaehl_methode_werte USING btree (sort);
COMMENT ON COLUMN apflora.tpopkontrzaehl_methode_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.tpopkontrzaehl_methode_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopkontrzaehl_methode_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.tpopmassn;
CREATE TABLE apflora.tpopmassn (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  id_old integer DEFAULT NULL,
  tpop_id integer DEFAULT NULL REFERENCES apflora.tpop ("TPopId") ON DELETE CASCADE ON UPDATE CASCADE,
  typ integer DEFAULT NULL REFERENCES apflora.tpopmassn_typ_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  beschreibung text DEFAULT NULL,
  jahr smallint DEFAULT NULL,
  datum date DEFAULT NULL,
  bearbeiter integer DEFAULT NULL REFERENCES apflora.adresse ("AdrId") ON DELETE SET NULL ON UPDATE CASCADE,
  bemerkungen text,
  plan_vorhanden smallint DEFAULT NULL,
  plan_bezeichnung text DEFAULT NULL,
  flaeche integer DEFAULT NULL,
  markierung text DEFAULT NULL,
  anz_triebe integer DEFAULT NULL,
  anz_pflanzen integer DEFAULT NULL,
  anz_pflanzstellen integer DEFAULT NULL,
  wirtspflanze text DEFAULT NULL,
  herkunft_pop text DEFAULT NULL,
  sammeldatum varchar(50) DEFAULT NULL,
  form text DEFAULT NULL,
  pflanzanordnung text DEFAULT NULL,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
);
CREATE UNIQUE INDEX ON apflora.tpopmassn USING btree (id);
CREATE INDEX ON apflora.tpopmassn USING btree (tpop_id);
CREATE INDEX ON apflora.tpopmassn USING btree (bearbeiter);
CREATE INDEX ON apflora.tpopmassn USING btree (typ);
CREATE INDEX ON apflora.tpopmassn USING btree (jahr);
COMMENT ON COLUMN apflora.tpopmassn.id IS 'Primärschlüssel der Tabelle "tpopmassn"';
COMMENT ON COLUMN apflora.tpopmassn.id_old IS 'frühere id';
COMMENT ON COLUMN apflora.tpopmassn.tpop_id IS 'Zugehörige Teilpopulation. Fremdschlüssel aus der Tabelle "tpop"';
COMMENT ON COLUMN apflora.tpopmassn.typ IS 'Typ der Massnahme. Auswahl aus Tabelle "tpopmassn_typ_werte"';
COMMENT ON COLUMN apflora.tpopmassn.beschreibung IS 'Was wurde gemacht? V.a. für Typ "Spezial"';
COMMENT ON COLUMN apflora.tpopmassn.jahr IS 'Jahr, in dem die Massnahme durchgeführt wurde';
COMMENT ON COLUMN apflora.tpopmassn.datum IS 'Datum, an dem die Massnahme durchgeführt wurde';
COMMENT ON COLUMN apflora.tpopmassn.bearbeiter IS 'Verantwortliche BearbeiterIn. Auswahl aus Tabelle "adresse"';
COMMENT ON COLUMN apflora.tpopmassn.bemerkungen IS 'Bemerkungen zur Massnahme';
COMMENT ON COLUMN apflora.tpopmassn.plan_vorhanden IS 'Existiert ein Plan?';
COMMENT ON COLUMN apflora.tpopmassn.plan_bezeichnung IS 'Bezeichnung auf dem Plan';
COMMENT ON COLUMN apflora.tpopmassn.flaeche IS 'Fläche der Massnahme bzw. Teilpopulation (m2)';
COMMENT ON COLUMN apflora.tpopmassn.markierung IS 'Markierung der Massnahme bzw. Teilpopulation';
COMMENT ON COLUMN apflora.tpopmassn.anz_triebe IS 'Anzahl angesiedelte Triebe';
COMMENT ON COLUMN apflora.tpopmassn.anz_pflanzen IS 'Anzahl angesiedelte Pflanzen';
COMMENT ON COLUMN apflora.tpopmassn.anz_pflanzstellen IS 'Anzahl Töpfe/Pflanzstellen';
COMMENT ON COLUMN apflora.tpopmassn.wirtspflanze IS 'Wirtspflanze';
COMMENT ON COLUMN apflora.tpopmassn.herkunft_pop IS 'Aus welcher Population stammt das Pflanzenmaterial?';
COMMENT ON COLUMN apflora.tpopmassn.sammeldatum IS 'Datum, an dem die angesiedelten Pflanzen gesammelt wurden';
COMMENT ON COLUMN apflora.tpopmassn.form IS 'Form, Grösse der Ansiedlung';
COMMENT ON COLUMN apflora.tpopmassn.pflanzanordnung IS 'Anordnung der Pflanzung';
COMMENT ON COLUMN apflora.tpopmassn.id IS 'GUID der Tabelle "tpopmassn"';
COMMENT ON COLUMN apflora.tpopmassn.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopmassn.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.tpopmassn_erfbeurt_werte;
CREATE TABLE apflora.tpopmassn_erfbeurt_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code integer UNIQUE DEFAULT NULL,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  changed date DEFAULT NOW(),
  changed_by varchar(20) NOT NULL
);
CREATE INDEX ON apflora.tpopmassn_erfbeurt_werte USING btree (id);
CREATE INDEX ON apflora.tpopmassn_erfbeurt_werte USING btree (code);
CREATE INDEX ON apflora.tpopmassn_erfbeurt_werte USING btree (sort);
COMMENT ON COLUMN apflora.tpopmassn_erfbeurt_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.tpopmassn_erfbeurt_werte.text IS 'Wie werden die durchgefuehrten Massnahmen beurteilt?';
COMMENT ON COLUMN apflora.tpopmassn_erfbeurt_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopmassn_erfbeurt_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.tpopmassn_typ_werte;
CREATE TABLE apflora.tpopmassn_typ_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code integer UNIQUE DEFAULT NULL,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  ansiedlung smallint NOT NULL,
  changed date DEFAULT NOW(),
  changed_by varchar(20) NOT NULL
);
CREATE INDEX ON apflora.tpopmassn_typ_werte USING btree (id);
CREATE INDEX ON apflora.tpopmassn_typ_werte USING btree (code);
CREATE INDEX ON apflora.tpopmassn_typ_werte USING btree (sort);
COMMENT ON COLUMN apflora.tpopmassn_typ_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.tpopmassn_typ_werte.ansiedlung IS 'Handelt es sich um eine Ansiedlung?';
COMMENT ON COLUMN apflora.tpopmassn_typ_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopmassn_typ_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.tpopmassnber;
CREATE TABLE apflora.tpopmassnber (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  id_old integer,
  tpop_id integer DEFAULT NULL REFERENCES apflora.tpop ("TPopId") ON DELETE CASCADE ON UPDATE CASCADE,
  jahr smallint DEFAULT NULL,
  beurteilung integer DEFAULT NULL REFERENCES apflora.tpopmassn_erfbeurt_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  bemerkungen text,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
);
COMMENT ON COLUMN apflora.tpopmassnber.id_old IS 'Primärschlüssel der Tabelle "tpopmassnber"';
COMMENT ON COLUMN apflora.tpopmassnber.id_old IS 'frühere id';
COMMENT ON COLUMN apflora.tpopmassnber.tpop_id IS 'Zugehörige Teilpopulation. Fremdschlüssel aus Tabelle "tpop"';
COMMENT ON COLUMN apflora.tpopmassnber.jahr IS 'Jahr, für den der Bericht gilt';
COMMENT ON COLUMN apflora.tpopmassnber.beurteilung IS 'Beurteilung des Erfolgs. Auswahl aus Tabelle "tpopmassn_erfbeurt_werte"';
COMMENT ON COLUMN apflora.tpopmassnber.bemerkungen IS 'Bemerkungen zur Beurteilung';
COMMENT ON COLUMN apflora.tpopmassnber.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopmassnber.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.tpopmassnber USING btree (id);
CREATE INDEX ON apflora.tpopmassnber USING btree (tpop_id);
CREATE INDEX ON apflora.tpopmassnber USING btree (beurteilung);
CREATE INDEX ON apflora.tpopmassnber USING btree (jahr);

DROP TABLE IF EXISTS apflora.message CASCADE;
CREATE TABLE apflora.message (
  id SERIAL PRIMARY KEY,
  "message" text NOT NULL,
  "time" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- active is used to prevent to many datasets fro being fetched
  -- old messages can be set inactive, expecially if read by all
  "active" boolean NOT NULL DEFAULT 'true'
);
CREATE INDEX ON apflora.message USING btree (id);
CREATE INDEX ON apflora.message USING btree ("time");
COMMENT ON COLUMN apflora.message."message" IS 'Nachricht an die Benutzer';

-- list of read messages per user
DROP TABLE IF EXISTS apflora.usermessage;
CREATE TABLE apflora.usermessage (
  "UserName" varchar(30) NOT NULL REFERENCES basic_auth.users (name) ON DELETE CASCADE ON UPDATE CASCADE,
  "MessageId" integer NOT NULL REFERENCES apflora.message (id) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE ("UserName", "MessageId")
);
CREATE INDEX ON apflora.usermessage USING btree ("UserName", "MessageId");

DROP TABLE IF EXISTS apflora.ziel;
CREATE TABLE apflora.ziel (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  id_old integer,
  ap_id integer NOT NULL REFERENCES apflora.ap ("ApArtId") ON DELETE CASCADE ON UPDATE CASCADE,
  typ integer DEFAULT NULL REFERENCES apflora.ziel_typ_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  jahr smallint DEFAULT NULL,
  bezeichnung text,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
);
CREATE INDEX ON apflora.ziel USING btree (id);
CREATE INDEX ON apflora.ziel USING btree (ap_id);
CREATE INDEX ON apflora.ziel USING btree (typ);
CREATE INDEX ON apflora.ziel USING btree (jahr);
COMMENT ON COLUMN apflora.ziel.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.ziel.id_old IS 'frühere id';
COMMENT ON COLUMN apflora.ziel.ap_id IS 'Zugehöriger Aktionsplan. Fremdschluessel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.ziel.typ IS 'Typ des Ziels. Z.B. Zwischenziel, Gesamtziel. Auswahl aus Tabelle "ziel_typ_werte"';
COMMENT ON COLUMN apflora.ziel.jahr IS 'In welchem Jahr soll das Ziel erreicht werden?';
COMMENT ON COLUMN apflora.ziel.bezeichnung IS 'Textliche Beschreibung des Ziels';
COMMENT ON COLUMN apflora.ziel.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ziel.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.ziel_typ_werte;
CREATE TABLE apflora.ziel_typ_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code integer UNIQUE DEFAULT NULL,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  changed date DEFAULT NOW(),
  changed_by varchar(20) NOT NULL
);
CREATE INDEX ON apflora.ziel_typ_werte USING btree (id);
CREATE INDEX ON apflora.ziel_typ_werte USING btree (code);
CREATE INDEX ON apflora.ziel_typ_werte USING btree (sort);
COMMENT ON COLUMN apflora.ziel_typ_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.ziel_typ_werte.text IS 'Beschreibung des Ziels';
COMMENT ON COLUMN apflora.ziel_typ_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ziel_typ_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.zielber;
CREATE TABLE apflora.zielber (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  id_old integer,
  ziel_id integer DEFAULT NULL REFERENCES apflora.ziel (id_old) ON DELETE CASCADE ON UPDATE CASCADE,
  jahr smallint DEFAULT NULL,
  erreichung text DEFAULT NULL,
  bemerkungen text DEFAULT NULL,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
);
CREATE INDEX ON apflora.zielber USING btree (id);
CREATE INDEX ON apflora.zielber USING btree (ziel_id);
CREATE INDEX ON apflora.zielber USING btree (jahr);
COMMENT ON COLUMN apflora.zielber.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.zielber.id_old IS 'frühere id';
COMMENT ON COLUMN apflora.zielber.ziel_id IS 'Zugehöriges Ziel. Fremdschlüssel aus der Tabelle "ziel"';
COMMENT ON COLUMN apflora.zielber.jahr IS 'Für welches Jahr gilt der Bericht?';
COMMENT ON COLUMN apflora.zielber.erreichung IS 'Beurteilung der Zielerreichung';
COMMENT ON COLUMN apflora.zielber.bemerkungen IS 'Bemerkungen zur Zielerreichung';
COMMENT ON COLUMN apflora.zielber.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.zielber.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.flora_status_werte;
CREATE TABLE apflora.flora_status_werte (
  "StatusWert" varchar(2) PRIMARY KEY,
  "StatusText" text NOT NULL
);

DROP TABLE IF EXISTS apflora.evab_typologie;
CREATE TABLE apflora.evab_typologie (
  "TYPO" varchar(9) PRIMARY KEY,
  "LEBENSRAUM" varchar(100),
  "Alliance" varchar(100)
);

-- TODO:
-- replace with direct GraphQL call to ae
-- when graphql installed
DROP TABLE IF EXISTS apflora.adb_eigenschaften;
CREATE TABLE apflora.adb_eigenschaften (
  "GUID" UUID PRIMARY KEY,
  "TaxonomieId" integer DEFAULT NULL,
  "Familie" varchar(100) DEFAULT NULL,
  "Artname" varchar(100) DEFAULT NULL,
  "NameDeutsch" varchar(100) DEFAULT NULL,
  "Status" varchar(47) DEFAULT NULL,
  "Artwert" smallint DEFAULT NULL,
  "KefArt" smallint DEFAULT NULL,
  "KefKontrolljahr" smallint DEFAULT NULL,
  "FnsJahresartJahr" smallint DEFAULT NULL
);
CREATE INDEX ON apflora.adb_eigenschaften USING btree ("TaxonomieId");
CREATE INDEX ON apflora.adb_eigenschaften USING btree ("Artname");

-- TODO:
-- replace with direct GraphQL call to ae
-- when graphql installed
DROP TABLE IF EXISTS apflora.adb_lr;
CREATE TABLE apflora.adb_lr (
  "Id" integer PRIMARY KEY,
  "LrMethodId" integer DEFAULT NULL,
  "ENr" integer UNIQUE DEFAULT NULL,
  "Label" varchar(50) DEFAULT NULL,
  "Einheit" varchar(255) DEFAULT NULL,
  "ELat" varchar(255) DEFAULT NULL,
  "EEngl" varchar(50) DEFAULT NULL,
  "EFranz" varchar(50) DEFAULT NULL,
  "EItal" varchar(50) DEFAULT NULL,
  "Bemerkungen" text
);
COMMENT ON COLUMN apflora.adb_lr."Id" IS 'Primärschlüssel der Tabelle ArtenDb_LR';
CREATE INDEX ON apflora.adb_lr USING btree ("LrMethodId");
CREATE INDEX ON apflora.adb_lr USING btree ("Id");
CREATE INDEX ON apflora.adb_lr USING btree ("Label");
CREATE INDEX ON apflora.adb_lr USING btree ("LrMethodId");

--
-- beob can collect beob of any provenience by following this convention:
-- - fields that are used in apflora.ch are appended as regular fields, that is:
--   QuelleId, ArtId, Datum, Autor, X, Y
--   These fields are extracted from the original beob at import
-- - all fields of the original beob are put in jsonb field "data"
--   and shown in the form that lists beob
-- - an id field is generated inside beob because we need a unique one
--   of defined type and id fields sometimes come as integer,
--   sometimes as GUIDS, so neither in a defined type nor unique
--   Worse: sometimes the id is not absolutely clear because no field contains
--   strictly unique values... !!
-- - "IdField" points to the original id in "data"
DROP TABLE IF EXISTS apflora.beob;
CREATE TABLE apflora.beob (
  id serial PRIMARY KEY,
  "QuelleId" integer Default Null,
  -- this field in data contains this datasets id
  "IdField" varchar(38) DEFAULT NULL,
  -- SISF Nr.
  "ArtId" integer DEFAULT NULL,
  -- data without year is not imported
  -- when no month exists: month = 01
  -- when no day exists: day = 01
  "Datum" date DEFAULT NULL,
  -- Nachname Vorname
  "Autor" varchar(100) DEFAULT NULL,
  -- data without coordinates is not imported
  "X" integer DEFAULT NULL,
  "Y" integer DEFAULT NULL,
  -- maybe later add a geojson field for polygons?
  data jsonb
);
CREATE INDEX ON apflora.beob USING btree ("QuelleId");
CREATE INDEX ON apflora.beob USING btree ("ArtId");
CREATE INDEX ON apflora.beob USING btree ("Datum");
CREATE INDEX ON apflora.beob USING btree ("X");
CREATE INDEX ON apflora.beob USING btree ("Y");
CREATE INDEX ON apflora.beob((data->>'NO_NOTE'));
CREATE INDEX ON apflora.beob((data->>'NO_NOTE_PROJET'));

-- beob_projekt is used to control
-- what beob are seen in what projekt
DROP TABLE IF EXISTS apflora.beob_projekt;
CREATE TABLE apflora.beob_projekt (
  "ProjektId" integer,
  "BeobId" integer,
  PRIMARY KEY ("ProjektId", "BeobId")
);

DROP TABLE IF EXISTS apflora.beob_quelle;
CREATE TABLE apflora.beob_quelle
(
   id integer PRIMARY KEY,
   "name" varchar(255) DEFAULT NULL
);
INSERT INTO apflora.beob_quelle VALUES (1, 'evab');
INSERT INTO apflora.beob_quelle VALUES (2, 'infospezies');
CREATE INDEX ON apflora.beob_quelle USING btree (id);

-- create table
DROP TABLE IF EXISTS apflora.beobart;
CREATE TABLE apflora.beobart (
  "BeobArtId" SERIAL PRIMARY KEY,
  "TaxonomieId" INTEGER DEFAULT NULL REFERENCES apflora.adb_eigenschaften ("TaxonomieId") ON DELETE SET NULL ON UPDATE CASCADE,
  "ApArtId" integer DEFAULT NULL REFERENCES apflora.ap ("ApArtId") ON DELETE CASCADE ON UPDATE CASCADE,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) DEFAULT NULL
  --UNIQUE ("TaxonomieId") --no, maybe after beo were rearranged
);
COMMENT ON COLUMN apflora.beobart."BeobArtId" IS 'Primärschlüssel der Tabelle "beobart"';
COMMENT ON COLUMN apflora.beobart."TaxonomieId" IS 'Zugehörige Art. Fremdschlüssel aus der Tabelle "adb_eigenschaften"';
COMMENT ON COLUMN apflora.beobart."ApArtId" IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.beobart."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.beobart."MutWer" IS 'Wer hat den Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.beobart USING btree ("BeobArtId");
CREATE INDEX ON apflora.beobart USING btree ("ApArtId", "TaxonomieId");
SELECT setval(pg_get_serial_sequence('apflora.beobart', 'BeobArtId'), coalesce(max("BeobArtId"), 0) + 1, false) FROM apflora.beobart;