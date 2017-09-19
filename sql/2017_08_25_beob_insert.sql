-- create table for floz sightings
DROP TABLE IF EXISTS beob.beob_floz;
CREATE TABLE beob.beob_floz (
  "id"	integer PRIMARY KEY,
  "IdField"	text,
  "Autor"	text,
  "X"	integer,
  "Y"	integer,
  "BARCODE"	text,
  "SISF_ID"	integer,
  "SPECIES"	text,
  "TAXON_NAME"	text,
  "PROJECT_NA"	text,
  "TRANSCRIPT"	text,
  "HERBARIUM"	text,
  "DETERMINAT"	text,
  "COLLECTOR"	text,
  "DAY_COLLEC"	integer,
  "MONTH_COLL"	integer,
  "YEAR_COLLE"	integer,
  "COUNTRY"	text,
  "LOCALITY"	text,
  "ECOLOGY"	text,
  "ELEVATION"	text,
  "USER_ID"	integer,
  "DETERMI_01"	integer,
  "SPECIMEN_I"	integer,
  "Flaeche_m2"	integer
);

-- import using pgAdmin

-- add beob_quelle
INSERT INTO beob.beob_quelle ("id", "name")
VALUES ('3', 'FloZ');

-- add beob_projekt
INSERT INTO beob.beob_projekt ("ProjId", "BeobId")
SELECT '1', "id"
FROM beob.beob_floz;

-- add sightings of FloZ:
INSERT INTO beob.beob (
  "id",
  "QuelleId",
  "IdField",
  "ArtId",
  "Datum",
  "Autor",
  "X",
  "Y",
  "data"
)
SELECT
  "id",
  '3',
  'BARCODE',
  "SISF_ID",
  -- build a Date of the form YYYY-MM-DD
  CASE
    WHEN "YEAR_COLLE" IS NULL THEN NULL
    WHEN "MONTH_COLL" IS NULL THEN to_date("YEAR_COLLE"::text || '-00-00', 'YYYY-MM-DD')
    WHEN "DAY_COLLEC" IS NULL THEN to_date(CONCAT(
      "YEAR_COLLE"::text,
      '-',
      CASE WHEN char_length("MONTH_COLL"::text) = 2
      THEN "MONTH_COLL"::text
      ELSE '0' || "MONTH_COLL"::text
      END,
      '-00'
    ), 'YYYY-MM-DD')
    ELSE to_date(CONCAT(
      "YEAR_COLLE"::text,
      '-',
      CASE WHEN char_length("MONTH_COLL"::text) = 2
      THEN "MONTH_COLL"::text
      ELSE '0' || "MONTH_COLL"::text
      END,
      '-',
      CASE WHEN char_length("DAY_COLLEC"::text) = 2
      THEN "DAY_COLLEC"::text
      ELSE '0' || "DAY_COLLEC"::text
      END
    ), 'YYYY-MM-DD')
  END,
  left("Autor", 100),
  "X",
  "Y",
  row_to_json(
    (
      SELECT d FROM (
        SELECT "BARCODE", "SISF_ID", "SPECIES", "TAXON_NAME", "PROJECT_NA", "TRANSCRIPT", "HERBARIUM", "DETERMINAT", "COLLECTOR", "DAY_COLLEC", "MONTH_COLL", "YEAR_COLLE", "COUNTRY", "LOCALITY", "ECOLOGY", "ELEVATION", "USER_ID", "DETERMI_01", "SPECIMEN_I", "Flaeche_m2"
      )
    d)
  ) AS data
FROM beob.beob_floz;

-- remove beob_floz
DROP TABLE IF EXISTS beob.beob_floz;
