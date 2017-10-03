-- create table
DROP TABLE IF EXISTS apflora.beob_art;
CREATE TABLE apflora.beob_art (
  "TaxonomieId" INTEGER DEFAULT NULL REFERENCES apflora.adb_eigenschaften ("TaxonomieId") ON DELETE SET NULL ON UPDATE CASCADE,
  "ApArtId" integer DEFAULT NULL REFERENCES apflora.ap ("ApArtId") ON DELETE CASCADE ON UPDATE CASCADE,
  "MutWann" date DEFAULT NULL,
  "MutWer" varchar(20) DEFAULT NULL
);
COMMENT ON COLUMN apflora.beob_art."TaxonomieId" IS 'Zugehörige Art. Fremdschlüssel aus der Tabelle "adb_eigenschaften"';
COMMENT ON COLUMN apflora.beob_art."ApArtId" IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.beob_art."MutWann" IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.beob_art."MutWer" IS 'Wer hat den Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.beob_art USING btree ("ApArtId", "TaxonomieId");

-- insert ap species
insert into apflora.beob_art ("ApArtId", "TaxonomieId")
select
  "ApArtId",
  "ApArtId" as "TaxonomieId"
from apflora.ap;

-- when ap is inserted
-- ensure beob_art is created too
DROP TRIGGER IF EXISTS ap_insert_add_beob_art ON apflora.ap;
DROP FUNCTION IF EXISTS ap_insert_add_beob_art();
CREATE FUNCTION ap_insert_add_beob_art() RETURNS trigger AS $ap_insert_add_beob_art$
BEGIN
  INSERT INTO
    apflora.beob_art ("ApArtId", "TaxonomieId")
  VALUES (NEW."ApArtId", NEW."ApArtId");
  RETURN NEW;
END;
$ap_insert_add_beob_art$ LANGUAGE plpgsql;

CREATE TRIGGER ap_insert_add_beob_art AFTER INSERT ON apflora.ap
  FOR EACH ROW EXECUTE PROCEDURE ap_insert_add_beob_art();
