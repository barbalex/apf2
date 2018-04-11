ALTER TABLE apflora.ziel_typ_werte RENAME "ZieltypId" TO code;
ALTER TABLE apflora.ziel_typ_werte RENAME "ZieltypTxt" TO text;
ALTER TABLE apflora.ziel_typ_werte RENAME "ZieltypOrd" TO sort;
ALTER TABLE apflora.ziel_typ_werte RENAME "MutWann" TO changed;
ALTER TABLE apflora.ziel_typ_werte RENAME "MutWer" TO changed_by;

ALTER TABLE apflora.ziel_typ_werte ADD COLUMN id UUID DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.ziel_typ_werte DROP CONSTRAINT ziel_typ_werte_pkey CASCADE;
ALTER TABLE apflora.ziel_typ_werte ADD PRIMARY KEY (id);
ALTER TABLE apflora.ziel_typ_werte ALTER COLUMN code DROP NOT NULL;
ALTER TABLE apflora.ziel_typ_werte ALTER COLUMN code SET DEFAULT null;
ALTER TABLE apflora.ziel_typ_werte ADD UNIQUE (code);
CREATE INDEX ON apflora.ziel_typ_werte USING btree (id);
COMMENT ON COLUMN apflora.ziel_typ_werte.id IS 'Primärschlüssel';

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- done: run migration sql in dev
-- done: restart postgrest and test app
-- done: update js and run this file on server
-- done: restart postgrest

DROP VIEW IF EXISTS apflora.v_abper_ziel;
CREATE OR REPLACE VIEW apflora.v_abper_ziel AS
SELECT
  apflora.ziel.*,
  ziel_typ_werte.text
FROM
  apflora._variable
  INNER JOIN
    (apflora.ziel
    INNER JOIN
      apflora.ziel_typ_werte
      ON apflora.ziel.typ = ziel_typ_werte.code)
    ON apflora._variable."JBerJahr" = apflora.ziel.jahr
WHERE
  apflora.ziel.typ IN(1, 2, 1170775556)
ORDER BY
  apflora.ziel_typ_werte.sort,
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
  ziel_typ_werte.text AS "Ziel Typ",
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
    ON apflora.ziel.typ = ziel_typ_werte.code
WHERE
  apflora.ziel.typ IN (1, 2, 1170775556)
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.ziel.jahr,
  ziel_typ_werte.text,
  apflora.ziel.typ;

DROP VIEW IF EXISTS apflora.v_ziel_verwaist;
CREATE OR REPLACE VIEW apflora.v_ziel_verwaist AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  apflora.ziel.id AS "Ziel Id",
  apflora.ziel.ap_id AS "Ziel ApId",
  apflora.ziel.jahr AS "Ziel Jahr",
  ziel_typ_werte.text AS "Ziel Typ",
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
    ON apflora.ziel.typ = ziel_typ_werte.code
WHERE
  apflora.ap."ApArtId" IS NULL
ORDER BY
  apflora.ziel.jahr,
  ziel_typ_werte.text,
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
  ziel_typ_werte.text AS "Ziel Typ",
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
    ON apflora.ziel.typ = ziel_typ_werte.code)
  RIGHT JOIN
    apflora.zielber
    ON apflora.ziel.id = apflora.zielber.ziel_id
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.ziel.jahr,
  ziel_typ_werte.text,
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
    ON apflora.ziel.typ = ziel_typ_werte.code)
  RIGHT JOIN
    apflora.zielber
    ON apflora.ziel.id = apflora.zielber.ziel_id
WHERE
  apflora.ziel.id IS NULL
ORDER BY
  apflora.ziel.typ,
  apflora.zielber.jahr;

DROP TRIGGER IF EXISTS ziel_typ_werte_on_update_set_mut ON apflora.ziel_typ_werte;
DROP FUNCTION IF EXISTS ziel_typ_werte_on_update_set_mut();
CREATE FUNCTION ziel_typ_werte_on_update_set_mut() RETURNS trigger AS $ziel_typ_werte_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$ziel_typ_werte_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER ziel_typ_werte_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.ziel_typ_werte
  FOR EACH ROW EXECUTE PROCEDURE ziel_typ_werte_on_update_set_mut();