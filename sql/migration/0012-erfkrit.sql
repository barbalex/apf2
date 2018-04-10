ALTER TABLE apflora.erfkrit RENAME "ErfkritId" TO id_old;
ALTER TABLE apflora.erfkrit ADD COLUMN id UUID DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.erfkrit RENAME "ApArtId" TO ap_id;
ALTER TABLE apflora.erfkrit RENAME "ErfkritErreichungsgrad" TO erfolg;
ALTER TABLE apflora.erfkrit RENAME "ErfkritTxt" TO kriterien;
ALTER TABLE apflora.erfkrit RENAME "MutWann" TO changed;
ALTER TABLE apflora.erfkrit RENAME "MutWer" TO changed_by;

-- change primary key
ALTER TABLE apflora.erfkrit DROP CONSTRAINT erfkrit_pkey;
ALTER TABLE apflora.erfkrit ADD PRIMARY KEY (id);
ALTER TABLE apflora.erfkrit ALTER COLUMN id_old DROP NOT NULL;
ALTER TABLE apflora.erfkrit ALTER COLUMN id_old SET DEFAULT null;

-- comments
COMMENT ON COLUMN apflora.erfkrit.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.erfkrit.id_old IS 'frühere id';
COMMENT ON COLUMN apflora.erfkrit.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.erfkrit.erfolg IS 'Wie gut werden die Ziele erreicht? Auswahl aus der Tabelle "ap_erfbeurtkrit_werte"';
COMMENT ON COLUMN apflora.erfkrit.kriterien IS 'Beschreibung der Kriterien für den Erfolg';
COMMENT ON COLUMN apflora.erfkrit.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.erfkrit.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- drop existing indexes
DROP index apflora.apflora."erfkrit_ApArtId_idx";
DROP index apflora.apflora."erfkrit_ErfkritErreichungsgrad_idx";
DROP index apflora.apflora."erfkrit_ErfkritId_idx";
-- add new
CREATE INDEX ON apflora.erfkrit USING btree (id);
CREATE INDEX ON apflora.erfkrit USING btree (ap_id);
CREATE INDEX ON apflora.erfkrit USING btree (erfolg);

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- done: run migration sql in dev
-- done: test app
-- done: update js and run this file on server

DROP TRIGGER IF EXISTS erfkrit_on_update_set_mut ON apflora.erfkrit;
DROP FUNCTION IF EXISTS erfkrit_on_update_set_mut();
CREATE FUNCTION erfkrit_on_update_set_mut() RETURNS trigger AS $erfkrit_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$erfkrit_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER erfkrit_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.erfkrit
  FOR EACH ROW EXECUTE PROCEDURE erfkrit_on_update_set_mut();

DROP VIEW IF EXISTS apflora.v_erfkrit;
CREATE OR REPLACE VIEW apflora.v_erfkrit AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.erfkrit.id AS "ErfKrit Id",
  apflora.erfkrit.id AS "ErfKrit ApId",
  ap_erfkrit_werte."BeurteilTxt" AS "ErfKrit Beurteilung",
  apflora.erfkrit.kriterien AS "ErfKrit Kriterien",
  apflora.erfkrit.changed AS "ErfKrit MutWann",
  apflora.erfkrit.changed_by AS "ErfKrit MutWer"
FROM
  (((((apflora.adb_eigenschaften
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
    apflora.erfkrit
    ON apflora.ap."ApArtId" = apflora.erfkrit.ap_id)
  LEFT JOIN
    apflora.ap_erfkrit_werte
    ON apflora.erfkrit.erfolg = ap_erfkrit_werte."BeurteilId"
ORDER BY
  apflora.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_erfktit_verwaist;
CREATE OR REPLACE VIEW apflora.v_erfktit_verwaist AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  apflora.erfkrit.id AS "ErfKrit Id",
  apflora.erfkrit.id AS "ErfKrit ApId",
  ap_erfkrit_werte."BeurteilTxt" AS "ErfKrit Beurteilung",
  apflora.erfkrit.kriterien AS "ErfKrit Kriterien",
  apflora.erfkrit.changed AS "ErfKrit MutWann",
  apflora.erfkrit.changed_by AS "ErfKrit MutWer"
FROM
  (((((apflora.adb_eigenschaften
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
    apflora.erfkrit
    ON apflora.ap."ApArtId" = apflora.erfkrit.ap_id)
  LEFT JOIN
    apflora.ap_erfkrit_werte
    ON apflora.erfkrit.erfolg = ap_erfkrit_werte."BeurteilId"
WHERE
  apflora.ap."ApArtId" IS NULL
ORDER BY
  apflora.ap_erfkrit_werte."BeurteilTxt",
  apflora.erfkrit.kriterien;

DROP VIEW IF EXISTS apflora.v_qk2_erfkrit_ohnebeurteilung;
CREATE OR REPLACE VIEW apflora.v_qk2_erfkrit_ohnebeurteilung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Erfolgskriterium ohne Beurteilung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Erfolgskriterien', apflora.erfkrit.id]::text[] AS url,
  ARRAY[concat('Erfolgskriterium (id): ', apflora.erfkrit.id)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.erfkrit
    ON apflora.ap."ApArtId" = apflora.erfkrit.ap_id
WHERE
  apflora.erfkrit.erfolg IS NULL
ORDER BY
  apflora.erfkrit.id;

DROP VIEW IF EXISTS apflora.v_qk2_erfkrit_ohnekriterien;
CREATE OR REPLACE VIEW apflora.v_qk2_erfkrit_ohnekriterien AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Erfolgskriterium ohne Kriterien:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Erfolgskriterien', apflora.erfkrit.id]::text[] AS url,
  ARRAY[concat('Erfolgskriterium (id): ', apflora.erfkrit.id)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.erfkrit
    ON apflora.ap."ApArtId" = apflora.erfkrit.ap_id
WHERE
  apflora.erfkrit.kriterien IS NULL
ORDER BY
  apflora.erfkrit.id;