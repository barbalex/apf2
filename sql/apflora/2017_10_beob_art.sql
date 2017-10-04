-- create table
DROP TABLE IF EXISTS apflora.beobart;
CREATE TABLE apflora.beobart (
  "BeobArtId" SERIAL PRIMARY KEY,
  "TaxonomieId" INTEGER DEFAULT NULL REFERENCES apflora.adb_eigenschaften ("TaxonomieId") ON DELETE SET NULL ON UPDATE CASCADE,
  "ApArtId" integer DEFAULT NULL REFERENCES apflora.ap ("ApArtId") ON DELETE CASCADE ON UPDATE CASCADE,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) DEFAULT NULL
);
COMMENT ON COLUMN apflora.beobart."BeobArtId" IS 'Primärschlüssel der Tabelle "beobart"';
COMMENT ON COLUMN apflora.beobart."TaxonomieId" IS 'Zugehörige Art. Fremdschlüssel aus der Tabelle "adb_eigenschaften"';
COMMENT ON COLUMN apflora.beobart."ApArtId" IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.beobart."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.beobart."MutWer" IS 'Wer hat den Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.beobart USING btree ("ApArtId", "TaxonomieId");
SELECT setval(pg_get_serial_sequence('apflora.beobart', 'BeobArtId'), coalesce(max("BeobArtId"), 0) + 1, false) FROM apflora.beobart;

-- insert ap species
insert into apflora.beobart ("ApArtId", "TaxonomieId")
select
  "ApArtId",
  "ApArtId" as "TaxonomieId"
from apflora.ap;

-- when ap is inserted
-- ensure beobart is created too
DROP TRIGGER IF EXISTS ap_insert_add_beobart ON apflora.ap;
DROP FUNCTION IF EXISTS ap_insert_add_beobart();
CREATE FUNCTION ap_insert_add_beobart() RETURNS trigger AS $ap_insert_add_beobart$
BEGIN
  INSERT INTO
    apflora.beobart ("ApArtId", "TaxonomieId")
  VALUES (NEW."ApArtId", NEW."ApArtId");
  RETURN NEW;
END;
$ap_insert_add_beobart$ LANGUAGE plpgsql;

CREATE TRIGGER ap_insert_add_beobart AFTER INSERT ON apflora.ap
  FOR EACH ROW EXECUTE PROCEDURE ap_insert_add_beobart();
