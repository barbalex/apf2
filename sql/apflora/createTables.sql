DROP TABLE IF EXISTS _variable;
CREATE TABLE apflora._variable (
  "KonstId" SERIAL PRIMARY KEY,
  apber_jahr smallint DEFAULT NULL,
  "ApArtId" integer DEFAULT NULL
);
COMMENT ON COLUMN apflora._variable.apber_jahr IS 'Von Access aus ein Berichtsjahr wählen, um die Erstellung des Jahresberichts zu beschleunigen';
COMMENT ON COLUMN apflora._variable."ApArtId" IS 'Von Access aus eine Art wählen, um views zu beschleunigen';
CREATE INDEX ON apflora._variable USING btree (apber_jahr);
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
  "ApStatus" integer DEFAULT NULL REFERENCES apflora.ap_bearbstand_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  "ApJahr" smallint DEFAULT NULL,
  "ApUmsetzung" integer DEFAULT NULL REFERENCES apflora.ap_umsetzung_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code integer UNIQUE DEFAULT NULL,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  changed date DEFAULT NOW(),
  changed_by varchar(20) NOT NULL
);
CREATE INDEX ON apflora.ap_bearbstand_werte USING btree (id);
CREATE INDEX ON apflora.ap_bearbstand_werte USING btree (code);
CREATE INDEX ON apflora.ap_bearbstand_werte USING btree (sort);
COMMENT ON COLUMN apflora.ap_bearbstand_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.ap_bearbstand_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ap_bearbstand_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- this table is listed in apber print in D. Einschätzung der Wirkung des AP insgesamt auf die Art
-- as Beurteilungsskala
DROP TABLE IF EXISTS apflora.ap_erfbeurtkrit_werte;
CREATE TABLE apflora.ap_erfbeurtkrit_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code integer UNIQUE DEFAULT NULL,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  changed date DEFAULT NOW(),
  changed_by varchar(20) NOT NULL
);
CREATE INDEX ON apflora.ap_erfbeurtkrit_werte USING btree (id);
CREATE INDEX ON apflora.ap_erfbeurtkrit_werte USING btree (code);
CREATE INDEX ON apflora.ap_erfbeurtkrit_werte USING btree (sort);
COMMENT ON COLUMN apflora.ap_erfbeurtkrit_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.ap_erfbeurtkrit_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ap_erfbeurtkrit_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.ap_erfkrit_werte;
CREATE TABLE apflora.ap_erfkrit_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code integer UNIQUE DEFAULT NULL,
  code integer PRIMARY KEY,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  changed date DEFAULT NOW(),
  changed_by varchar(20) NOT NULL
);
CREATE INDEX ON apflora.ap_erfkrit_werte USING btree (id);
CREATE INDEX ON apflora.ap_erfkrit_werte USING btree (code);
CREATE INDEX ON apflora.ap_erfkrit_werte USING btree (sort);
COMMENT ON COLUMN apflora.ap_erfkrit_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.ap_erfkrit_werte.text IS 'Wie werden die durchgefuehrten Massnahmen beurteilt?';
COMMENT ON COLUMN apflora.ap_erfkrit_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ap_erfkrit_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.ap_umsetzung_werte;
CREATE TABLE apflora.ap_umsetzung_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code integer UNIQUE DEFAULT NULL,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  changed date DEFAULT NOW(),
  changed_by varchar(20) NOT NULL
);
CREATE INDEX ON apflora.ap_umsetzung_werte USING btree (id);
CREATE INDEX ON apflora.ap_umsetzung_werte USING btree (code);
CREATE INDEX ON apflora.ap_umsetzung_werte USING btree (sort);
COMMENT ON COLUMN apflora.ap_umsetzung_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.ap_umsetzung_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ap_umsetzung_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.apber;
CREATE TABLE apflora.apber (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  id_old integer,
  ap_id integer NOT NULL REFERENCES apflora.ap ("ApArtId") ON DELETE CASCADE ON UPDATE CASCADE,
  jahr smallint DEFAULT NULL,
  situation text,
  vergleich_vorjahr_gesamtziel text,
  beurteilung integer DEFAULT NULL REFERENCES apflora.ap_erfkrit_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  veraenderung_zum_vorjahr varchar(2) DEFAULT NULL,
  -- analyse is a reserved word!!!
  apber_analyse text DEFAULT NULL,
  konsequenzen_umsetzung text,
  konsequenzen_erfolgskontrolle text,
  biotope_neue text,
  biotope_optimieren text,
  massnahmen_optimieren text,
  massnahmen_ap_bearb text,
  massnahmen_planung_vs_ausfuehrung text,
  wirkung_auf_art text,
  datum date DEFAULT NULL,
  bearbeiter integer DEFAULT NULL REFERENCES apflora.adresse ("AdrId") ON DELETE SET NULL ON UPDATE CASCADE,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
);
CREATE INDEX ON apflora.apber USING btree (id);
CREATE INDEX ON apflora.apber USING btree (ap_id);
CREATE INDEX ON apflora.apber USING btree (beurteilung);
CREATE INDEX ON apflora.apber USING btree (bearbeiter);
CREATE INDEX ON apflora.apber USING btree (jahr);
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
  ae_id UUID DEFAULT NULL REFERENCES apflora.ae_eigenschaften (id) ON DELETE SET NULL ON UPDATE CASCADE,
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
  tpop_id integer DEFAULT NULL REFERENCES apflora.tpop (id) ON DELETE CASCADE ON UPDATE CASCADE,
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
  erfolg integer DEFAULT NULL REFERENCES apflora.ap_erfkrit_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  kriterien text DEFAULT NULL,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
);
COMMENT ON COLUMN apflora.erfkrit.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.erfkrit.id_old IS 'frühere id';
COMMENT ON COLUMN apflora.erfkrit.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.erfkrit.erfolg IS 'Wie gut werden die Ziele erreicht? Auswahl aus der Tabelle "ap_erfkrit_werte"';
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  id_old integer,
  ap_id integer DEFAULT NULL REFERENCES apflora.ap ("ApArtId") ON DELETE CASCADE ON UPDATE CASCADE,
  nr integer DEFAULT NULL,
  name varchar(150) DEFAULT NULL,
  status integer DEFAULT NULL REFERENCES apflora.pop_status_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  status_unklar smallint DEFAULT NULL,
  status_unklar_begruendung text DEFAULT NULL,
  bekannt_seit smallint DEFAULT NULL,
  x integer DEFAULT NULL CONSTRAINT zulaessige_x_koordinate CHECK (x IS NULL OR (x > 2485071 AND x < 2828516)),
  y integer DEFAULT NULL CONSTRAINT zulaessige_y_koordinate CHECK (y IS NULL OR (y > 1075346 AND y < 1299942)),
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
);
CREATE INDEX ON apflora.pop USING btree (id);
CREATE INDEX ON apflora.pop USING btree (ap_id);
CREATE INDEX ON apflora.pop USING btree (status);
CREATE INDEX ON apflora.pop USING btree (x);
CREATE INDEX ON apflora.pop USING btree (y);
CREATE INDEX ON apflora.pop USING btree (nr);
CREATE INDEX ON apflora.pop USING btree (name);
CREATE INDEX ON apflora.pop USING btree (bekannt_seit);
COMMENT ON COLUMN apflora.pop.id IS 'Primärschlüssel der Tabelle "pop"';
COMMENT ON COLUMN apflora.pop.id_old IS 'frühere id';
COMMENT ON COLUMN apflora.pop.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.pop.nr IS 'Nummer der Population';
COMMENT ON COLUMN apflora.pop.name IS 'Bezeichnung der Population';
COMMENT ON COLUMN apflora.pop.status IS 'Herkunft der Population: autochthon oder angesiedelt? Auswahl aus der Tabelle "pop_status_werte"';
COMMENT ON COLUMN apflora.pop.status_unklar IS '1 = die Herkunft der Population ist unklar';
COMMENT ON COLUMN apflora.pop.status_unklar_begruendung IS 'Begründung, wieso die Herkunft unklar ist';
COMMENT ON COLUMN apflora.pop.bekannt_seit IS 'Seit wann ist die Population bekannt?';
COMMENT ON COLUMN apflora.pop.x IS 'Wird in der Regel von einer Teilpopulation übernommen';
COMMENT ON COLUMN apflora.pop.y IS 'Wird in der Regel von einer Teilpopulation übernommen';
COMMENT ON COLUMN apflora.pop.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.pop.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.pop_status_werte;
CREATE TABLE apflora.pop_status_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code integer UNIQUE DEFAULT NULL,
  text varchar(60) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
);
CREATE INDEX ON apflora.pop_status_werte USING btree (id);
CREATE INDEX ON apflora.pop_status_werte USING btree (code);
CREATE INDEX ON apflora.pop_status_werte USING btree (text);
CREATE INDEX ON apflora.pop_status_werte USING btree (sort);
COMMENT ON COLUMN apflora.pop_status_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.pop_status_werte.text IS 'Beschreibung der Herkunft';
COMMENT ON COLUMN apflora.pop_status_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.pop_status_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.popber;
CREATE TABLE apflora.popber (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  id_old integer,
  pop_id integer DEFAULT NULL REFERENCES apflora.pop (id) ON DELETE CASCADE ON UPDATE CASCADE,
  jahr smallint DEFAULT NULL,
  entwicklung integer DEFAULT NULL REFERENCES apflora.tpop_entwicklung_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  bemerkungen text,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
);
COMMENT ON COLUMN apflora.popber.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.popber.id_old IS 'frühere id';
COMMENT ON COLUMN apflora.popber.pop_id IS 'Zugehörige Population. Fremdschlüssel aus der Tabelle "pop"';
COMMENT ON COLUMN apflora.popber.jahr IS 'Für welches Jahr gilt der Bericht?';
COMMENT ON COLUMN apflora.popber.entwicklung IS 'Beurteilung der Populationsentwicklung: Auswahl aus Tabelle "tpop_entwicklung_werte"';
COMMENT ON COLUMN apflora.popber.bemerkungen IS 'Bemerkungen zur Beurteilung';
COMMENT ON COLUMN apflora.popber.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.popber.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.popber USING btree (id);
CREATE INDEX ON apflora.popber USING btree (pop_id);
CREATE INDEX ON apflora.popber USING btree (entwicklung);
CREATE INDEX ON apflora.popber USING btree (jahr);

DROP TABLE IF EXISTS apflora.popmassnber;
CREATE TABLE apflora.popmassnber (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  id_old integer,
  pop_id integer DEFAULT NULL REFERENCES apflora.pop (id) ON DELETE CASCADE ON UPDATE CASCADE,
  jahr smallint DEFAULT NULL,
  beurteilung integer DEFAULT NULL REFERENCES apflora.tpopmassn_erfbeurt_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  bemerkungen text,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
);
CREATE INDEX ON apflora.popmassnber USING btree (id);
CREATE INDEX ON apflora.popmassnber USING btree (pop_id);
CREATE INDEX ON apflora.popmassnber USING btree (beurteilung);
CREATE INDEX ON apflora.popmassnber USING btree (jahr);
COMMENT ON COLUMN apflora.popmassnber.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.popmassnber.id_old IS 'frühere id';
COMMENT ON COLUMN apflora.popmassnber.pop_id IS 'Zugehörige Population. Fremdschlüssel aus der Tabelle "pop"';
COMMENT ON COLUMN apflora.popmassnber.jahr IS 'Für welches Jahr gilt der Bericht?';
COMMENT ON COLUMN apflora.popmassnber.beurteilung IS 'Wie wird die Wirkung aller im Rahmen des AP durchgeführten Massnahmen beurteilt?';
COMMENT ON COLUMN apflora.popmassnber.bemerkungen IS 'Bemerkungen zur Beurteilung';
COMMENT ON COLUMN apflora.popmassnber.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.popmassnber.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.tpop;
CREATE TABLE apflora.tpop (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  id_old integer,
  pop_id integer DEFAULT NULL REFERENCES apflora.pop (id) ON DELETE CASCADE ON UPDATE CASCADE,
  nr integer DEFAULT NULL,
  gemeinde text DEFAULT NULL,
  flurname text DEFAULT NULL,
  x integer DEFAULT NULL CONSTRAINT zulaessige_x_koordinate CHECK (x IS NULL OR (x > 2485071 AND x < 2828516)),
  y integer DEFAULT NULL CONSTRAINT zulaessige_y_koordinate CHECK (y IS NULL OR (y > 1075346 AND y < 1299942)),
  radius smallint DEFAULT NULL,
  hoehe smallint DEFAULT NULL,
  exposition varchar(50) DEFAULT NULL,
  klima varchar(50) DEFAULT NULL,
  neigung varchar(50) DEFAULT NULL,
  beschreibung text DEFAULT NULL,
  kataster_nr text DEFAULT NULL,
  status integer DEFAULT NULL REFERENCES apflora.pop_status_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  status_unklar smallint DEFAULT NULL,
  status_unklar_grund text DEFAULT NULL,
  apber_relevant integer DEFAULT NULL REFERENCES apflora.tpop_apberrelevant_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  bekannt_seit smallint DEFAULT NULL,
  eigentuemer text DEFAULT NULL,
  kontakt text DEFAULT NULL,
  nutzungszone text DEFAULT NULL,
  bewirtschafter text DEFAULT NULL,
  bewirtschaftung text DEFAULT NULL,
  bemerkungen text,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
);
CREATE INDEX ON apflora.tpop USING btree (id);
CREATE INDEX ON apflora.tpop USING btree (pop_id);
CREATE INDEX ON apflora.tpop USING btree (status);
CREATE INDEX ON apflora.tpop USING btree (apber_relevant);
CREATE INDEX ON apflora.tpop USING btree (x);
CREATE INDEX ON apflora.tpop USING btree (y);
CREATE INDEX ON apflora.tpop USING btree (nr);
CREATE INDEX ON apflora.tpop USING btree (gemeinde);
CREATE INDEX ON apflora.tpop USING btree (flurname);
COMMENT ON COLUMN apflora.tpop.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.tpop.id_old IS 'frühere id';
COMMENT ON COLUMN apflora.tpop.pop_id IS 'Zugehörige Population. Fremdschlüssel aus der Tabelle "pop"';
COMMENT ON COLUMN apflora.tpop.nr IS 'Nummer der Teilpopulation';
COMMENT ON COLUMN apflora.tpop.gemeinde IS 'Gemeinde';
COMMENT ON COLUMN apflora.tpop.flurname IS 'Flurname';
COMMENT ON COLUMN apflora.tpop.x IS 'X-Koordinate';
COMMENT ON COLUMN apflora.tpop.y IS 'Y-Koordinate';
COMMENT ON COLUMN apflora.tpop.radius IS 'Radius der Teilpopulation (m)';
COMMENT ON COLUMN apflora.tpop.hoehe IS 'Höhe über Meer (m)';
COMMENT ON COLUMN apflora.tpop.exposition IS 'Exposition / Besonnung des Standorts';
COMMENT ON COLUMN apflora.tpop.klima IS 'Klima des Standorts';
COMMENT ON COLUMN apflora.tpop.neigung IS 'Hangneigung des Standorts';
COMMENT ON COLUMN apflora.tpop.beschreibung IS 'Beschreibung der Fläche';
COMMENT ON COLUMN apflora.tpop.kataster_nr IS 'Kataster-Nummer';
COMMENT ON COLUMN apflora.tpop.status IS 'Herkunft der Teilpopulation. Auswahl aus Tabelle "pop_status_werte"';
COMMENT ON COLUMN apflora.tpop.status_unklar IS 'Ist der Status der Teilpopulation unklar? (es bestehen keine glaubwuerdigen Beboachtungen)';
COMMENT ON COLUMN apflora.tpop.status_unklar_grund IS 'Wieso ist der Status unklar?';
COMMENT ON COLUMN apflora.tpop.apber_relevant IS 'Ist die Teilpopulation für den AP-Bericht relevant? Auswahl aus der Tabelle "tpop_apberrelevant_werte"';
COMMENT ON COLUMN apflora.tpop.bekannt_seit IS 'Seit wann ist die Teilpopulation bekannt?';
COMMENT ON COLUMN apflora.tpop.eigentuemer IS 'EigentümerIn';
COMMENT ON COLUMN apflora.tpop.kontakt IS 'Kontaktperson vor Ort';
COMMENT ON COLUMN apflora.tpop.nutzungszone IS 'Nutzungszone';
COMMENT ON COLUMN apflora.tpop.bewirtschafter IS 'Wer bewirtschaftet die Fläche?';
COMMENT ON COLUMN apflora.tpop.bewirtschaftung IS 'Wie wird die Fläche bewirtschaftet?';
COMMENT ON COLUMN apflora.tpop.bemerkungen IS 'Bemerkungen zur Teilpopulation';
COMMENT ON COLUMN apflora.tpop.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpop.changed IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.tpop_apberrelevant_werte;
CREATE TABLE apflora.tpop_apberrelevant_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code integer UNIQUE DEFAULT NULL,
  text text,
  changed date DEFAULT NOW(),
  changed_by varchar(20) NOT NULL
);
CREATE INDEX ON apflora.tpop_apberrelevant_werte USING btree (id);
CREATE INDEX ON apflora.tpop_apberrelevant_werte USING btree (code);
CREATE INDEX ON apflora.tpop_apberrelevant_werte USING btree (text);
COMMENT ON COLUMN apflora.tpop_apberrelevant_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.tpop_apberrelevant_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpop_apberrelevant_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

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
  tpop_id integer DEFAULT NULL REFERENCES apflora.tpop (id) ON DELETE CASCADE ON UPDATE CASCADE,
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  id_old integer,
  tpop_id integer DEFAULT NULL REFERENCES apflora.tpop (id) ON DELETE CASCADE ON UPDATE CASCADE,
  typ varchar(50) DEFAULT NULL,
  datum date DEFAULT NULL,
  jahr smallint DEFAULT NULL,
  bearbeiter integer DEFAULT NULL REFERENCES apflora.adresse ("AdrId") ON DELETE SET NULL ON UPDATE CASCADE,
  -- should be tpopkontrzaehl:
  jungpflanzen_anzahl integer DEFAULT NULL,
  vitalitaet text DEFAULT NULL,
  ueberlebensrate smallint DEFAULT NULL,
  entwicklung integer DEFAULT NULL REFERENCES apflora.tpop_entwicklung_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  ursachen text DEFAULT NULL,
  erfolgsbeurteilung text DEFAULT NULL,
  umsetzung_aendern text DEFAULT NULL,
  kontrolle_aendern text DEFAULT NULL,
  bemerkungen text,
  lr_delarze text DEFAULT NULL,
  flaeche integer DEFAULT NULL,
  lr_umgebung_delarze text DEFAULT NULL,
  vegetationstyp varchar(100) DEFAULT NULL,
  konkurrenz varchar(100) DEFAULT NULL,
  moosschicht varchar(100) DEFAULT NULL,
  krautschicht varchar(100) DEFAULT NULL,
  strauchschicht text DEFAULT NULL,
  baumschicht varchar(100) DEFAULT NULL,
  boden_typ text DEFAULT NULL,
  boden_kalkgehalt varchar(100) DEFAULT NULL,
  boden_durchlaessigkeit varchar(100) DEFAULT NULL,
  boden_humus varchar(100) DEFAULT NULL,
  boden_naehrstoffgehalt varchar(100) DEFAULT NULL,
  boden_abtrag text DEFAULT NULL,
  wasserhaushalt text DEFAULT NULL,
  idealbiotop_uebereinstimmung integer DEFAULT NULL REFERENCES apflora.tpopkontr_idbiotuebereinst_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  handlungsbedarf text,
  flaeche_ueberprueft integer DEFAULT NULL,
  plan_vorhanden smallint DEFAULT NULL,
  deckung_vegetation smallint DEFAULT NULL,
  deckung_nackter_boden smallint DEFAULT NULL,
  deckung_ap_art smallint DEFAULT NULL,
  jungpflanzen_vorhanden smallint DEFAULT NULL,
  vegetationshoehe_maximum smallint DEFAULT NULL,
  vegetationshoehe_mittel smallint DEFAULT NULL,
  gefaehrdung text DEFAULT NULL,
  zeit_id UUID DEFAULT uuid_generate_v1mc(),
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT current_setting('request.jwt.claim.username', true)
);
CREATE INDEX ON apflora.tpopkontr USING btree (id);
CREATE INDEX ON apflora.tpopkontr USING btree (tpop_id);
CREATE INDEX ON apflora.tpopkontr USING btree (bearbeiter);
CREATE INDEX ON apflora.tpopkontr USING btree (entwicklung);
CREATE INDEX ON apflora.tpopkontr USING btree (idealbiotop_uebereinstimmung);
CREATE INDEX ON apflora.tpopkontr USING btree (jahr);
CREATE INDEX ON apflora.tpopkontr USING btree (typ);
CREATE INDEX ON apflora.tpopkontr USING btree (datum);
CREATE UNIQUE INDEX ON apflora.tpopkontr USING btree (zeit_id);
COMMENT ON COLUMN apflora.tpopkontr.id IS 'Primärschlüssel. Wird u.a. verwendet für die Identifikation der Beobachtung im nationalen Beobachtungs-Daten-Kreislauf';
COMMENT ON COLUMN apflora.tpopkontr.id_old IS 'frühere id';
COMMENT ON COLUMN apflora.tpopkontr.tpop_id IS 'Zugehörige Teilpopulation. Fremdschlüssel aus der Tabelle "tpop"';
COMMENT ON COLUMN apflora.tpopkontr.typ IS 'Typ der Kontrolle. Auswahl aus Tabelle "tpopkontr_typ_werte"';
COMMENT ON COLUMN apflora.tpopkontr.datum IS 'Wann wurde kontrolliert?';
COMMENT ON COLUMN apflora.tpopkontr.jahr IS 'In welchem Jahr wurde kontrolliert? Für welches Jahr gilt die Beschreibung?';
COMMENT ON COLUMN apflora.tpopkontr.bearbeiter IS 'Wer hat kontrolliert? Auswahl aus Tabelle "adresse"';
COMMENT ON COLUMN apflora.tpopkontr.jungpflanzen_anzahl IS 'Anzahl Jungpflanzen';
COMMENT ON COLUMN apflora.tpopkontr.vitalitaet IS 'Vitalität der Pflanzen';
COMMENT ON COLUMN apflora.tpopkontr.ueberlebensrate IS 'Überlebensrate in Prozent';
COMMENT ON COLUMN apflora.tpopkontr.entwicklung IS 'Entwicklung des Bestandes. Auswahl aus Tabelle "tpop_entwicklung_werte"';
COMMENT ON COLUMN apflora.tpopkontr.ursachen IS 'Ursachen der Entwicklung';
COMMENT ON COLUMN apflora.tpopkontr.erfolgsbeurteilung IS 'Erfolgsbeurteilung';
COMMENT ON COLUMN apflora.tpopkontr.umsetzung_aendern IS 'Vorschlag für Änderung der Umsetzung';
COMMENT ON COLUMN apflora.tpopkontr.kontrolle_aendern IS 'Vorschlag für Änderung der Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.bemerkungen IS 'Bemerkungen zur Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.lr_delarze IS 'Lebensraumtyp nach Delarze';
COMMENT ON COLUMN apflora.tpopkontr.flaeche IS 'Fläche der Teilpopulation';
COMMENT ON COLUMN apflora.tpopkontr.lr_umgebung_delarze IS 'Lebensraumtyp der direkt angrenzenden Umgebung (nach Delarze)';
COMMENT ON COLUMN apflora.tpopkontr.vegetationstyp IS 'Vegetationstyp';
COMMENT ON COLUMN apflora.tpopkontr.konkurrenz IS 'Konkurrenz';
COMMENT ON COLUMN apflora.tpopkontr.moosschicht IS 'Moosschicht';
COMMENT ON COLUMN apflora.tpopkontr.krautschicht IS 'Krautschicht';
COMMENT ON COLUMN apflora.tpopkontr.strauchschicht IS 'Strauchschicht, ehemals Verbuschung (%)';
COMMENT ON COLUMN apflora.tpopkontr.baumschicht IS 'Baumschicht';
COMMENT ON COLUMN apflora.tpopkontr.boden_typ IS 'Bodentyp';
COMMENT ON COLUMN apflora.tpopkontr.boden_kalkgehalt IS 'Kalkgehalt des Bodens';
COMMENT ON COLUMN apflora.tpopkontr.boden_durchlaessigkeit IS 'Durchlässigkeit des Bodens';
COMMENT ON COLUMN apflora.tpopkontr.boden_humus IS 'Humusgehalt des Bodens';
COMMENT ON COLUMN apflora.tpopkontr.boden_naehrstoffgehalt IS 'Nährstoffgehalt des Bodens';
COMMENT ON COLUMN apflora.tpopkontr.boden_abtrag IS 'Oberbodenabtrag';
COMMENT ON COLUMN apflora.tpopkontr.wasserhaushalt IS 'Wasserhaushalt';
COMMENT ON COLUMN apflora.tpopkontr.idealbiotop_uebereinstimmung IS 'Übereinstimmung mit dem Idealbiotop';
COMMENT ON COLUMN apflora.tpopkontr.handlungsbedarf IS 'Handlungsbedarf bezüglich Biotop';
COMMENT ON COLUMN apflora.tpopkontr.flaeche_ueberprueft IS 'Überprüfte Fläche in m2. Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.plan_vorhanden IS 'Fläche / Wuchsort auf Plan eingezeichnet? Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.deckung_vegetation IS 'Von Pflanzen, Streu oder Moos bedeckter Boden (%). Nur für Freiwilligen-Erfolgskontrolle. Nur bis 2012 erfasst.';
COMMENT ON COLUMN apflora.tpopkontr.deckung_nackter_boden IS 'Flächenanteil nackter Boden (%). Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.deckung_ap_art IS 'Flächenanteil der überprüften Pflanzenart (%). Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.jungpflanzen_vorhanden IS 'Gibt es neben alten Pflanzen auch junge? Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.vegetationshoehe_maximum IS 'Maximale Vegetationshöhe in cm. Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.vegetationshoehe_mittel IS 'Mittlere Vegetationshöhe in cm. Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.gefaehrdung IS 'Gefährdung. Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.zeit_id IS 'GUID für den Export von Zeiten in EvAB';
COMMENT ON COLUMN apflora.tpopkontr.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopkontr.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

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
  tpopkontr_id integer DEFAULT NULL REFERENCES apflora.tpopkontr (id) ON DELETE CASCADE ON UPDATE CASCADE,
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
  tpop_id integer DEFAULT NULL REFERENCES apflora.tpop (id) ON DELETE CASCADE ON UPDATE CASCADE,
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
  tpop_id integer DEFAULT NULL REFERENCES apflora.tpop (id) ON DELETE CASCADE ON UPDATE CASCADE,
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

DROP TABLE IF EXISTS apflora.evab_typologie;
CREATE TABLE apflora.evab_typologie (
  "TYPO" varchar(9) PRIMARY KEY,
  "LEBENSRAUM" varchar(100),
  "Alliance" varchar(100)
);

-- TODO:
-- replace with direct GraphQL call to ae
-- when graphql installed
DROP TABLE IF EXISTS apflora.ae_eigenschaften;
CREATE TABLE apflora.ae_eigenschaften (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  taxid integer DEFAULT NULL,
  familie varchar(100) DEFAULT NULL,
  artname varchar(100) DEFAULT NULL,
  namedeutsch varchar(100) DEFAULT NULL,
  status varchar(47) DEFAULT NULL,
  artwert smallint DEFAULT NULL,
  kefart smallint DEFAULT NULL,
  kefkontrolljahr smallint DEFAULT NULL,
  fnsjahresartjahr smallint DEFAULT NULL
);
CREATE INDEX ON apflora.ae_eigenschaften USING btree (id);
CREATE INDEX ON apflora.ae_eigenschaften USING btree (taxid);
CREATE INDEX ON apflora.ae_eigenschaften USING btree (artname);
COMMENT ON COLUMN apflora.ae_eigenschaften.id IS 'Primärschlüssel';

-- TODO:
-- replace with direct GraphQL call to ae
-- when graphql installed
DROP TABLE IF EXISTS apflora.ae_lrdelarze;
CREATE TABLE apflora.ae_lrdelarze (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  label varchar(50) DEFAULT NULL,
  einheit varchar(255) DEFAULT NULL,
  sort integer DEFAULT NULL
);
CREATE INDEX ON apflora.ae_lrdelarze USING btree (id);
CREATE INDEX ON apflora.ae_lrdelarze USING btree (sort);
COMMENT ON COLUMN apflora.ae_lrdelarze.id IS 'Primärschlüssel';

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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  id_old integer,
  taxid INTEGER DEFAULT NULL REFERENCES apflora.ae_eigenschaften (taxid) ON DELETE SET NULL ON UPDATE CASCADE,
  ap_id integer DEFAULT NULL REFERENCES apflora.ap ("ApArtId") ON DELETE CASCADE ON UPDATE CASCADE,
  changed date DEFAULT NULL,
  changed_by varchar(20) DEFAULT NULL
  --UNIQUE (taxid) --no, maybe after beob were rearranged
);
CREATE INDEX ON apflora.beobart USING btree (id);
CREATE INDEX ON apflora.beobart USING btree (ap_id);
CREATE INDEX ON apflora.beobart USING btree (taxid);
COMMENT ON COLUMN apflora.beobart.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.beobart.id_old IS 'frühere id';
COMMENT ON COLUMN apflora.beobart.taxid IS 'Zugehörige Art. Fremdschlüssel aus der Tabelle "ae_eigenschaften"';
COMMENT ON COLUMN apflora.beobart.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.beobart.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.beobart.changed_by IS 'Wer hat den Datensatz zuletzt geändert?';