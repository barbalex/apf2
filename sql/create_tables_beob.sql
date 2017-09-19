DROP TABLE IF EXISTS beob.adb_eigenschaften;
CREATE TABLE beob.adb_eigenschaften (
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
CREATE INDEX ON beob.adb_eigenschaften USING btree ("TaxonomieId");
CREATE INDEX ON beob.adb_eigenschaften USING btree ("Artname");

DROP TABLE IF EXISTS beob.adb_lr;
CREATE TABLE beob.adb_lr (
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
COMMENT ON COLUMN beob.adb_lr."Id" IS 'Primärschlüssel der Tabelle ArtenDb_LR';
CREATE INDEX ON beob.adb_lr USING btree ("LrMethodId");
CREATE INDEX ON beob.adb_lr USING btree ("Id");
CREATE INDEX ON beob.adb_lr USING btree ("Label");
CREATE INDEX ON beob.adb_lr USING btree ("LrMethodId");

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
DROP TABLE IF EXISTS beob.beob;
CREATE TABLE beob.beob (
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
CREATE INDEX ON beob.beob USING btree ("QuelleId");
CREATE INDEX ON beob.beob USING btree ("ArtId");
CREATE INDEX ON beob.beob USING btree ("Datum");
CREATE INDEX ON beob.beob USING btree ("X");
CREATE INDEX ON beob.beob USING btree ("Y");
CREATE INDEX ON beob.beob((data->>'NO_NOTE'));
CREATE INDEX ON beob.beob((data->>'NO_NOTE_PROJET'));

-- beob_projekt is used to control
-- what beob are seen in what projekt
DROP TABLE IF EXISTS beob.beob_projekt;
CREATE TABLE beob.beob_projekt (
  "ProjektId" integer,
  "BeobId" integer,
  PRIMARY KEY ("ProjektId", "BeobId")
);

DROP TABLE IF EXISTS beob.beob_quelle;
CREATE TABLE beob.beob_quelle
(
   "id" integer PRIMARY KEY,
   "name" varchar(255) DEFAULT NULL
);
INSERT INTO beob.beob_quelle VALUES (1, 'evab');
INSERT INTO beob.beob_quelle VALUES (2, 'infospezies');

DROP TABLE IF EXISTS beob.evab_tbl_personen;
CREATE TABLE beob.evab_tbl_personen (
  "idPerson" varchar(40) PRIMARY KEY,
  "Name" varchar(50) NOT NULL,
  "Vorname" varchar(50) NOT NULL,
  "Ort" varchar(50) NOT NULL
);

DROP TABLE IF EXISTS beob.flora_status_werte;
CREATE TABLE beob.flora_status_werte (
  "StatusWert" varchar(2) PRIMARY KEY,
  "StatusText" text NOT NULL
);
