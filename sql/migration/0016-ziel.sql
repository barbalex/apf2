ALTER TABLE apflora.ziel RENAME "ZielId" TO id_old;
ALTER TABLE apflora.ziel ADD COLUMN id UUID DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.ziel RENAME "ApArtId" TO ap_id;
ALTER TABLE apflora.ziel RENAME "ZielTyp" TO typ;
ALTER TABLE apflora.ziel RENAME "ZielJahr" TO jahr;
ALTER TABLE apflora.ziel RENAME "ZielBezeichnung" TO bezeichnung;
ALTER TABLE apflora.ziel RENAME "MutWann" TO changed;
ALTER TABLE apflora.ziel RENAME "MutWer" TO changed_by;

-- change primary key
ALTER TABLE apflora.ziel DROP CONSTRAINT ziel_pkey CASCADE;
ALTER TABLE apflora.ziel ADD PRIMARY KEY (id);
ALTER TABLE apflora.ziel ALTER COLUMN id_old DROP NOT NULL;
ALTER TABLE apflora.ziel ALTER COLUMN id_old SET DEFAULT null;

-- change zielber
ALTER TABLE apflora.zielber RENAME ziel_id TO ziel_id_old;
ALTER TABLE apflora.zielber ADD COLUMN ziel_id UUID DEFAULT NULL REFERENCES apflora.ziel (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- comments
COMMENT ON COLUMN apflora.ziel.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.ziel.id_old IS 'frühere id';
COMMENT ON COLUMN apflora.ziel.ap_id IS 'Zugehöriger Aktionsplan. Fremdschluessel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.ziel.typ IS 'Typ des Ziels. Z.B. Zwischenziel, Gesamtziel. Auswahl aus Tabelle "ziel_typ_werte"';
COMMENT ON COLUMN apflora.ziel.jahr IS 'In welchem Jahr soll das Ziel erreicht werden?';
COMMENT ON COLUMN apflora.ziel.bezeichnung IS 'Textliche Beschreibung des Ziels';
COMMENT ON COLUMN apflora.ziel.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ziel.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.zielber.ziel_id IS 'Zugehöriges Ziel. Fremdschlüssel aus der Tabelle "ziel"';

-- drop existing indexes
DROP index apflora.apflora."ziel_ApArtId_idx";
DROP index apflora.apflora."ziel_ZielId_idx";
DROP index apflora.apflora."ziel_ZielJahr_idx";
DROP index apflora.apflora."ziel_ZielTyp_idx";
-- add new
CREATE INDEX ON apflora.ziel USING btree (id);
CREATE INDEX ON apflora.ziel USING btree (ap_id);
CREATE INDEX ON apflora.ziel USING btree (typ);
CREATE INDEX ON apflora.ziel USING btree (jahr);
CREATE INDEX ON apflora.zielber USING btree (ziel_id);

-- update, then drop zielber stuff
UPDATE apflora.zielber SET ziel_id = (
  SELECT id FROM apflora.ziel WHERE id_old = apflora.zielber.ziel_id_old
) WHERE ziel_id_old IS NOT NULL;

DROP index apflora.apflora."zielber_ziel_id_idx";
ALTER TABLE apflora.zielber DROP COLUMN ziel_id_old CASCADE;

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- done: run migration sql in dev
-- done: restart postgrest and test app
-- TODO: update js and run this file on server
-- TODO: restart postgrest

DROP TRIGGER IF EXISTS ziel_on_update_set_mut ON apflora.ziel;
DROP FUNCTION IF EXISTS ziel_on_update_set_mut();
CREATE FUNCTION ziel_on_update_set_mut() RETURNS trigger AS $ziel_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$ziel_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER ziel_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.ziel
  FOR EACH ROW EXECUTE PROCEDURE ziel_on_update_set_mut();

DROP VIEW IF EXISTS apflora.v_abper_ziel;
CREATE OR REPLACE VIEW apflora.v_abper_ziel AS
SELECT
  apflora.ziel.*,
  ziel_typ_werte."ZieltypTxt"
FROM
  apflora._variable
  INNER JOIN
    (apflora.ziel
    INNER JOIN
      apflora.ziel_typ_werte
      ON apflora.ziel.typ = ziel_typ_werte."ZieltypId")
    ON apflora._variable."JBerJahr" = apflora.ziel.jahr
WHERE
  apflora.ziel.typ IN(1, 2, 1170775556)
ORDER BY
  apflora.ziel_typ_werte."ZieltypOrd",
  apflora.ziel.bezeichnung;

DROP VIEW IF EXISTS apflora.v_ziel;
CREATE OR REPLACE VIEW apflora.v_ziel AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.ziel.id AS "Ziel Id",
  apflora.ziel.ap_id AS "Ziel ApId",
  apflora.ziel.jahr AS "Ziel Jahr",
  ziel_typ_werte."ZieltypTxt" AS "Ziel Typ",
  apflora.ziel.bezeichnung AS "Ziel Beschreibung"
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
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel.ap_id)
  LEFT JOIN
    apflora.ziel_typ_werte
    ON apflora.ziel.typ = ziel_typ_werte."ZieltypId"
WHERE
  apflora.ziel.typ IN (1, 2, 1170775556)
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.ziel.jahr,
  ziel_typ_werte."ZieltypTxt",
  apflora.ziel.typ;

DROP VIEW IF EXISTS apflora.v_ziel_verwaist;
CREATE OR REPLACE VIEW apflora.v_ziel_verwaist AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  apflora.ziel.id AS "Ziel Id",
  apflora.ziel.ap_id AS "Ziel ApId",
  apflora.ziel.jahr AS "Ziel Jahr",
  ziel_typ_werte."ZieltypTxt" AS "Ziel Typ",
  apflora.ziel.bezeichnung AS "Ziel Beschreibung"
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
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel.ap_id)
  LEFT JOIN
    apflora.ziel_typ_werte
    ON apflora.ziel.typ = ziel_typ_werte."ZieltypId"
WHERE
  apflora.ap."ApArtId" IS NULL
ORDER BY
  apflora.ziel.jahr,
  ziel_typ_werte."ZieltypTxt",
  apflora.ziel.typ;

DROP VIEW IF EXISTS apflora.v_zielber;
CREATE OR REPLACE VIEW apflora.v_zielber AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.ziel.id AS "Ziel Id",
  apflora.ziel.jahr AS "Ziel Jahr",
  ziel_typ_werte."ZieltypTxt" AS "Ziel Typ",
  apflora.ziel.bezeichnung AS "Ziel Beschreibung",
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
    ON apflora.ap."ApArtId" = apflora.ziel.ap_id)
  LEFT JOIN
    apflora.ziel_typ_werte
    ON apflora.ziel.typ = ziel_typ_werte."ZieltypId")
  RIGHT JOIN
    apflora.zielber
    ON apflora.ziel.id = apflora.zielber.ziel_id
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.ziel.jahr,
  ziel_typ_werte."ZieltypTxt",
  apflora.ziel.typ,
  apflora.zielber.jahr;

DROP VIEW IF EXISTS apflora.v_zielber_verwaist;
CREATE OR REPLACE VIEW apflora.v_zielber_verwaist AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  apflora.ziel.id AS "Ziel Id",
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
    ON apflora.ap."ApArtId" = apflora.ziel.ap_id)
  LEFT JOIN
    apflora.ziel_typ_werte
    ON apflora.ziel.typ = ziel_typ_werte."ZieltypId")
  RIGHT JOIN
    apflora.zielber
    ON apflora.ziel.id = apflora.zielber.ziel_id
WHERE
  apflora.ziel.id IS NULL
ORDER BY
  apflora.ziel.typ,
  apflora.zielber.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_zielber_ohneentwicklung;
CREATE OR REPLACE VIEW apflora.v_qk2_zielber_ohneentwicklung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Ziel-Bericht ohne Entwicklung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Ziele', apflora.ziel.id, 'Berichte', apflora.zielber.id]::text[] AS url,
  ARRAY[concat('Ziel (Jahr): ', apflora.ziel.jahr), concat('Ziel-Bericht (Jahr): ', apflora.zielber.jahr)]::text[] AS text,
  apflora.zielber.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    apflora.ziel
    INNER JOIN
      apflora.zielber
      ON apflora.ziel.id = apflora.zielber.ziel_id
    ON apflora.ap."ApArtId" = apflora.ziel.ap_id
WHERE
  apflora.zielber.erreichung IS NULL
  AND apflora.zielber.jahr IS NOT NULL
ORDER BY
  apflora.ziel.jahr,
  apflora.ziel.id,
  apflora.zielber.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_zielber_ohnejahr;
CREATE OR REPLACE VIEW apflora.v_qk2_zielber_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Ziel-Bericht ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Ziele', apflora.ziel.id, 'Berichte', apflora.zielber.id]::text[] AS url,
  ARRAY[concat('Ziel (Jahr): ', apflora.ziel.jahr), concat('Ziel-Bericht (Jahr): ', apflora.zielber.jahr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.ziel
    INNER JOIN
      apflora.zielber
      ON apflora.ziel.id = apflora.zielber.ziel_id)
    ON apflora.ap."ApArtId" = apflora.ziel.ap_id
WHERE
  apflora.zielber.jahr IS NULL
ORDER BY
  apflora.ziel.jahr,
  apflora.ziel.id,
  apflora.zielber.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_ziel_ohnejahr;
CREATE OR REPLACE VIEW apflora.v_qk2_ziel_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Ziel ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Ziele', apflora.ziel.id]::text[] AS url,
  ARRAY[concat('Ziel (id): ', apflora.ziel.id)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel.ap_id
WHERE
  apflora.ziel.jahr IS NULL
  OR apflora.ziel.jahr = 1
ORDER BY
  apflora.ziel.id;

DROP VIEW IF EXISTS apflora.v_qk2_ziel_ohnetyp;
CREATE OR REPLACE VIEW apflora.v_qk2_ziel_ohnetyp AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Ziel ohne Typ:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Ziele', apflora.ziel.id]::text[] AS url,
  ARRAY[concat('Ziel (Jahr): ', apflora.ziel.jahr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel.ap_id
WHERE
  apflora.ziel.typ IS NULL
ORDER BY
  apflora.ziel.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_ziel_ohneziel;
CREATE OR REPLACE VIEW apflora.v_qk2_ziel_ohneziel AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Ziel ohne Ziel:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Ziele', apflora.ziel.id]::text[] AS url,
  ARRAY[concat('Ziel (Jahr): ', apflora.ziel.jahr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel.ap_id
WHERE
  apflora.ziel.bezeichnung IS NULL
ORDER BY
  apflora.ziel.jahr;