ALTER TABLE apflora.ber RENAME "BerId" TO id_old;
ALTER TABLE apflora.ber ADD COLUMN id UUID UNIQUE DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.ber RENAME "ApArtId" TO ap_id;
ALTER TABLE apflora.ber RENAME "BerAutor" TO autor;
ALTER TABLE apflora.ber RENAME "BerJahr" TO jahr;
ALTER TABLE apflora.ber RENAME "BerTitel" TO titel;
ALTER TABLE apflora.ber RENAME "BerURL" TO url;
ALTER TABLE apflora.ber RENAME "MutWann" TO changed;
ALTER TABLE apflora.ber RENAME "MutWer" TO changed_by;

COMMENT ON COLUMN apflora.ber.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.ber.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.ber.autor IS 'Autor des Berichts';
COMMENT ON COLUMN apflora.ber.jahr IS 'Jahr der Publikation';
COMMENT ON COLUMN apflora.ber.titel IS 'Titel des Berichts';
COMMENT ON COLUMN apflora.ber.url IS 'Link zum Bericht';
COMMENT ON COLUMN apflora.ber.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ber.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- drop existing indexes
DROP index apflora.apflora."ber_ApArtId_idx";
DROP index apflora.apflora."ber_BerId_idx";
DROP index apflora.apflora."ber_BerJahr_idx";
-- add new
CREATE INDEX ON apflora.ber USING btree (id);
CREATE INDEX ON apflora.ber USING btree (ap_id);
CREATE INDEX ON apflora.ber USING btree (jahr);

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- TODO: run migration sql in dev
-- TODO: test app
-- TODO: update js and run this file on server

DROP TRIGGER IF EXISTS ber_on_update_set_mut ON apflora.ber;
DROP FUNCTION IF EXISTS ber_on_update_set_mut();
CREATE FUNCTION ber_on_update_set_mut() RETURNS trigger AS $ber_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$ber_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER ber_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.ber
  FOR EACH ROW EXECUTE PROCEDURE ber_on_update_set_mut();

DROP VIEW IF EXISTS apflora.v_ber;
CREATE OR REPLACE VIEW apflora.v_ber AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Bearbeitungsstand",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.ber.id AS "Ber Id",
  apflora.ber.ap_id AS "Ber ApId",
  apflora.ber.autor AS "Ber Autor",
  apflora.ber.jahr AS "Ber Jahr",
  apflora.ber.titel AS "Ber Titel",
  apflora.ber.url AS "Ber URL",
  apflora.ber.changed AS "Ber MutWann",
  apflora.ber.changed_by AS "Ber MutWer"
FROM
  ((((apflora.adb_eigenschaften
  RIGHT JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
  RIGHT JOIN
    apflora.ber
    ON apflora.ap."ApArtId" = apflora.ber.ap_id
ORDER BY
  apflora.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_ber_verwaist;
CREATE OR REPLACE VIEW apflora.v_ber_verwaist AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  apflora.ber.id AS "Ber Id",
  apflora.ber.ap_id AS "Ber ApId",
  apflora.ber.autor AS "Ber Autor",
  apflora.ber.jahr AS "Ber Jahr",
  apflora.ber.titel AS "Ber Titel",
  apflora.ber.url AS "Ber URL",
  apflora.ber.changed AS "Ber MutWann",
  apflora.ber.changed_by AS "Ber MutWer"
FROM
  ((((apflora.adb_eigenschaften
  RIGHT JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
  RIGHT JOIN
    apflora.ber
    ON apflora.ap."ApArtId" = apflora.ber.ap_id
WHERE
  apflora.ap."ApArtId" IS NULL
ORDER BY
  apflora.adb_eigenschaften."Artname";
