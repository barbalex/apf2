ALTER TABLE apflora.zielber RENAME "ZielBerId" TO id_old;
ALTER TABLE apflora.zielber ADD COLUMN id UUID DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.zielber RENAME "ZielId" TO ziel_id;
ALTER TABLE apflora.zielber RENAME "ZielBerJahr" TO jahr;
ALTER TABLE apflora.zielber RENAME "ZielBerErreichung" TO erreichung;
ALTER TABLE apflora.zielber RENAME "ZielBerTxt" TO bemerkungen;
ALTER TABLE apflora.zielber RENAME "MutWann" TO changed;
ALTER TABLE apflora.zielber RENAME "MutWer" TO changed_by;

-- change primary key
ALTER TABLE apflora.zielber DROP CONSTRAINT zielber_pkey;
ALTER TABLE apflora.zielber ADD PRIMARY KEY (id);
ALTER TABLE apflora.zielber ALTER COLUMN id_old DROP NOT NULL;
ALTER TABLE apflora.zielber ALTER COLUMN id_old SET DEFAULT null;

-- comments
COMMENT ON COLUMN apflora.zielber.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.zielber.id_old IS 'frühere id';
COMMENT ON COLUMN apflora.zielber.ziel_id IS 'Zugehöriges Ziel. Fremdschlüssel aus der Tabelle "ziel"';
COMMENT ON COLUMN apflora.zielber.jahr IS 'Für welches Jahr gilt der Bericht?';
COMMENT ON COLUMN apflora.zielber.erreichung IS 'Beurteilung der Zielerreichung';
COMMENT ON COLUMN apflora.zielber.bemerkungen IS 'Bemerkungen zur Zielerreichung';
COMMENT ON COLUMN apflora.zielber.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.zielber.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- drop existing indexes
DROP index apflora.apflora."zielber_ZielBerId_idx";
DROP index apflora.apflora."zielber_ZielBerJahr_idx";
DROP index apflora.apflora."zielber_ZielId_idx";
-- add new
CREATE INDEX ON apflora.zielber USING btree (id);
CREATE INDEX ON apflora.zielber USING btree (ziel_id);
CREATE INDEX ON apflora.zielber USING btree (jahr);

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- done: run migration sql in dev
-- done: restart postgrest and test app
-- done: update js and run this file on server
-- done: restart postgrest

DROP TRIGGER IF EXISTS zielber_on_update_set_mut ON apflora.zielber;
DROP FUNCTION IF EXISTS zielber_on_update_set_mut();
CREATE FUNCTION zielber_on_update_set_mut() RETURNS trigger AS $zielber_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$zielber_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER zielber_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.zielber
  FOR EACH ROW EXECUTE PROCEDURE zielber_on_update_set_mut();

DROP VIEW IF EXISTS apflora.v_apber_zielber;
CREATE OR REPLACE VIEW apflora.v_apber_zielber AS
SELECT
  apflora.zielber.*
FROM
  apflora.zielber
  INNER JOIN
    apflora._variable
    ON apflora.zielber.jahr = apflora._variable."JBerJahr";

DROP VIEW IF EXISTS apflora.v_zielber;
CREATE OR REPLACE VIEW apflora.v_zielber AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.ziel."ZielId" AS "Ziel Id",
  apflora.ziel."ZielJahr" AS "Ziel Jahr",
  ziel_typ_werte."ZieltypTxt" AS "Ziel Typ",
  apflora.ziel."ZielBezeichnung" AS "Ziel Beschreibung",
  apflora.zielber.id AS "ZielBer Id",
  apflora.zielber.id AS "ZielBer ZielId",
  apflora.zielber.jahr AS "ZielBer Jahr",
  apflora.zielber.erreichung AS "ZielBer Erreichung",
  apflora.zielber.bemerkungen AS "ZielBer Bemerkungen",
  apflora.zielber.changed AS "ZielBer MutWann",
  apflora.zielber.changed_by AS "ZielBer MutWer"
FROM
  ((((((apflora.adb_eigenschaften
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
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId")
  LEFT JOIN
    apflora.ziel_typ_werte
    ON apflora.ziel."ZielTyp" = ziel_typ_werte."ZieltypId")
  RIGHT JOIN
    apflora.zielber
    ON apflora.ziel."ZielId" = apflora.zielber.ziel_id
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.ziel."ZielJahr",
  ziel_typ_werte."ZieltypTxt",
  apflora.ziel."ZielTyp",
  apflora.zielber.jahr;

DROP VIEW IF EXISTS apflora.v_zielber_verwaist;
CREATE OR REPLACE VIEW apflora.v_zielber_verwaist AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  apflora.ziel."ZielId" AS "Ziel Id",
  apflora.zielber.id AS "ZielBer Id",
  apflora.zielber.id AS "ZielBer ZielId",
  apflora.zielber.jahr AS "ZielBer Jahr",
  apflora.zielber.erreichung AS "ZielBer Erreichung",
  apflora.zielber.bemerkungen AS "ZielBer Bemerkungen",
  apflora.zielber.changed AS "ZielBer MutWann",
  apflora.zielber.changed_by AS "ZielBer MutWer"
FROM
  ((((((apflora.adb_eigenschaften
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
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId")
  LEFT JOIN
    apflora.ziel_typ_werte
    ON apflora.ziel."ZielTyp" = ziel_typ_werte."ZieltypId")
  RIGHT JOIN
    apflora.zielber
    ON apflora.ziel."ZielId" = apflora.zielber.ziel_id
WHERE
  apflora.ziel."ZielId" IS NULL
ORDER BY
  apflora.ziel."ZielTyp",
  apflora.zielber.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_zielber_ohneentwicklung;
CREATE OR REPLACE VIEW apflora.v_qk2_zielber_ohneentwicklung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Ziel-Bericht ohne Entwicklung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Ziele', apflora.ziel."ZielId", 'Berichte', apflora.zielber.id]::text[] AS url,
  ARRAY[concat('Ziel (Jahr): ', apflora.ziel."ZielJahr"), concat('Ziel-Bericht (Jahr): ', apflora.zielber.jahr)]::text[] AS text,
  apflora.zielber.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    apflora.ziel
    INNER JOIN
      apflora.zielber
      ON apflora.ziel."ZielId" = apflora.zielber.ziel_id
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId"
WHERE
  apflora.zielber.erreichung IS NULL
  AND apflora.zielber.jahr IS NOT NULL
ORDER BY
  apflora.ziel."ZielJahr",
  apflora.ziel."ZielId",
  apflora.zielber.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_zielber_ohnejahr;
CREATE OR REPLACE VIEW apflora.v_qk2_zielber_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Ziel-Bericht ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Ziele', apflora.ziel."ZielId", 'Berichte', apflora.zielber.id]::text[] AS url,
  ARRAY[concat('Ziel (Jahr): ', apflora.ziel."ZielJahr"), concat('Ziel-Bericht (Jahr): ', apflora.zielber.jahr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.ziel
    INNER JOIN
      apflora.zielber
      ON apflora.ziel."ZielId" = apflora.zielber.ziel_id)
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId"
WHERE
  apflora.zielber.jahr IS NULL
ORDER BY
  apflora.ziel."ZielJahr",
  apflora.ziel."ZielId",
  apflora.zielber.jahr;