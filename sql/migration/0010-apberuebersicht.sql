ALTER TABLE apflora.apberuebersicht RENAME id TO id_old;
ALTER TABLE apflora.apberuebersicht ADD COLUMN id UUID UNIQUE DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.apberuebersicht RENAME "JbuJahr" TO jahr;
ALTER TABLE apflora.apberuebersicht RENAME "JbuBemerkungen" TO bemerkungen;
ALTER TABLE apflora.apberuebersicht RENAME "MutWann" TO changed;
ALTER TABLE apflora.apberuebersicht RENAME "MutWer" TO changed_by;
ALTER TABLE apflora.apberuebersicht RENAME "ProjId" TO proj_id;

COMMENT ON COLUMN apflora.apberuebersicht.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.apberuebersicht.id_old IS 'frühere id';
COMMENT ON COLUMN apflora.apberuebersicht.proj_id IS 'Zugehöriges Projekt. Zusammen mit jahr eindeutig';
COMMENT ON COLUMN apflora.apberuebersicht.jahr IS 'Berichtsjahr. Zusammen mit proj_id eindeutig';

-- drop existing indexes
DROP index apflora.apflora."apberuebersicht_JbuJahr_idx";
DROP index apflora.apflora."apberuebersicht_id_idx";
-- add new
CREATE INDEX ON apflora.apberuebersicht USING btree (id);
CREATE INDEX ON apflora.apberuebersicht USING btree (jahr);
CREATE INDEX ON apflora.apberuebersicht USING btree (proj_id);
ALTER TABLE apflora.apberuebersicht ADD UNIQUE (proj_id, jahr);

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- done: run migration sql in dev
-- TODO: test app
-- TODO: update js and run this file on server

DROP TRIGGER IF EXISTS apberuebersicht_on_update_set_mut ON apflora.apberuebersicht;
DROP FUNCTION IF EXISTS apberuebersicht_on_update_set_mut();
CREATE FUNCTION apberuebersicht_on_update_set_mut() RETURNS trigger AS $apberuebersicht_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$apberuebersicht_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER apberuebersicht_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.apberuebersicht
  FOR EACH ROW EXECUTE PROCEDURE apberuebersicht_on_update_set_mut();

DROP VIEW IF EXISTS apflora.v_apber_injahr;
CREATE OR REPLACE VIEW apflora.v_apber_injahr AS
SELECT
  apflora.ap.*,
  apflora.adb_eigenschaften."Artname" AS "Art",
  apflora.apber."JBerId",
  apflora.apber."JBerJahr",
  apflora.apber."JBerVergleichVorjahrGesamtziel",
  apflora.apber."JBerBeurteilung",
  apflora.apber."JBerAnalyse",
  apflora.apber."JBerUmsetzung",
  apflora.apber."JBerErfko",
  apflora.apber."JBerATxt",
  apflora.apber."JBerBTxt",
  apflora.apber."JBerCTxt",
  apflora.apber."JBerCAktivApbearb",
  apflora.apber."JBerCVerglAusfPl",
  apflora.apber."JBerDTxt",
  apflora.apber."JBerDatum",
  apflora.apber."JBerBearb",
  concat(apflora.adresse."AdrName", ', ', apflora.adresse."AdrAdresse") AS "Bearbeiter",
  apflora.apberuebersicht.jahr,
  apflora.apberuebersicht.bemerkungen,
  apflora.v_erstemassnproap."MinvonTPopMassnJahr" AS "ErsteMassnahmeImJahr"
FROM
  (apflora.adb_eigenschaften
  INNER JOIN
    (apflora.ap
    LEFT JOIN
      apflora.v_erstemassnproap
      ON apflora.ap."ApArtId" = apflora.v_erstemassnproap."ApArtId")
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    (((apflora.apber
    LEFT JOIN
      apflora.adresse
      ON apflora.apber."JBerBearb" = apflora.adresse."AdrId")
    LEFT JOIN
      apflora.apberuebersicht
      ON apflora.apber."JBerJahr" = apflora.apberuebersicht.jahr)
    INNER JOIN
      apflora._variable
      ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId"
WHERE
  apflora.ap."ApStatus" < 4
  --AND apflora.ap."ApArtId" > 150
ORDER BY
  apflora.adb_eigenschaften."Artname";