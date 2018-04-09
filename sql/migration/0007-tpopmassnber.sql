ALTER TABLE apflora.tpopmassnber ADD COLUMN id UUID UNIQUE DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.tpopmassnber RENAME "TPopMassnBerId" TO id_old;
ALTER TABLE apflora.tpopmassnber RENAME "TPopId" TO tpop_id;
ALTER TABLE apflora.tpopmassnber RENAME "TPopMassnBerJahr" TO jahr;
ALTER TABLE apflora.tpopmassnber RENAME "TPopMassnBerErfolgsbeurteilung" TO beurteilung;
ALTER TABLE apflora.tpopmassnber RENAME "TPopMassnBerTxt" TO bemerkungen;
ALTER TABLE apflora.tpopmassnber RENAME "MutWann" TO changed;
ALTER TABLE apflora.tpopmassnber RENAME "MutWer" TO changed_by;

COMMENT ON COLUMN apflora.tpopmassnber.id_old IS 'frühere id';

-- change primary key
ALTER TABLE apflora.tpopmassnber DROP CONSTRAINT tpopmassnber_pkey;
ALTER TABLE apflora.tpopmassnber ADD PRIMARY KEY (id);

-- done: rename in sql
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers with tpopmassnber to this file
-- done: make sure createTable is correct
-- done: rename in js
-- done: test app
-- TODO: update js and run this file on server

-- views:
DROP TRIGGER IF EXISTS tpop_max_one_massnber_per_year ON apflora.tpopmassnber;
DROP FUNCTION IF EXISTS apflora.tpop_max_one_massnber_per_year();
CREATE FUNCTION apflora.tpop_max_one_massnber_per_year() RETURNS trigger AS $tpop_max_one_massnber_per_year$
  BEGIN
    -- check if a tpopmassnber already exists for this year
    IF
      (
        NEW.jahr > 0
        AND NEW.jahr IN
          (
            SELECT
              jahr
            FROM
              apflora.tpopmassnber
            WHERE
              tpop_id = NEW.tpop_id
              AND id <> NEW.id
          )
      )
    THEN
      RAISE EXCEPTION  'Pro Teilpopulation und Jahr darf maximal ein Massnahmenbericht erfasst werden';
    END IF;
    RETURN NEW;
  END;
$tpop_max_one_massnber_per_year$ LANGUAGE plpgsql;
CREATE TRIGGER tpop_max_one_massnber_per_year BEFORE UPDATE OR INSERT ON apflora.tpopmassnber
  FOR EACH ROW EXECUTE PROCEDURE apflora.tpop_max_one_massnber_per_year();

DROP VIEW IF EXISTS apflora.v_tpop_letztermassnber0 cascade;
CREATE OR REPLACE VIEW apflora.v_tpop_letztermassnber0 AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId",
  apflora.tpopmassnber.jahr
FROM
  apflora._variable,
  ((apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId")
  INNER JOIN
    apflora.tpopmassnber
    ON apflora.tpop."TPopId" = apflora.tpopmassnber.tpop_id)
  INNER JOIN
    apflora.tpopmassn
    ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
WHERE
  apflora.tpopmassnber.jahr <= apflora._variable."JBerJahr"
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.tpopmassn.jahr <= apflora._variable."JBerJahr"
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpopmassnber.beurteilung BETWEEN 1 AND 5;

DROP VIEW IF EXISTS apflora.v_tpopmassnber_fueraktap0;
CREATE OR REPLACE VIEW apflora.v_tpopmassnber_fueraktap0 AS
SELECT
  apflora.ap."ApArtId",
  apflora.adb_eigenschaften."Artname" AS "Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "Aktionsplan-Status",
  apflora.ap."ApJahr" AS "Aktionsplan-Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "Aktionsplan-Umsetzung",
  apflora.pop."PopNr" AS "Population-Nr",
  apflora.pop."PopName" AS "Population-Name",
  pop_status_werte."HerkunftTxt" AS "Population-Herkunft",
  apflora.pop."PopBekanntSeit" AS "Population - bekannt seit",
  apflora.tpop."TPopNr" AS "Teilpopulation-Nr",
  apflora.tpop."TPopGemeinde" AS "Teilpopulation-Gemeinde",
  apflora.tpop."TPopFlurname" AS "Teilpopulation-Flurname",
  apflora.tpop."TPopXKoord" AS "Teilpopulation-X-Koodinate",
  apflora.tpop."TPopYKoord" AS "Teilpopulation-Y-Koordinate",
  apflora.tpop."TPopRadius" AS "Teilpopulation-Radius",
  apflora.tpop."TPopHoehe" AS "Teilpopulation-Hoehe",
  apflora.tpop."TPopBeschr" AS "Teilpopulation-Beschreibung",
  apflora.tpop."TPopKatNr" AS "Teilpopulation-Kataster-Nr",
  "domPopHerkunft_1"."HerkunftTxt" AS "Teilpopulation-Herkunft",
  apflora.tpop."TPopHerkunftUnklar" AS "Teilpopulation - Herkunft unklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "Teilpopulation - Herkunft unklar Begruendung",
  apflora.tpop_apberrelevant_werte."DomainTxt" AS "Teilpopulation - Fuer Bericht relevant",
  apflora.tpop."TPopBekanntSeit" AS "Teilpopulation - bekannt seit",
  apflora.tpop."TPopEigen" AS "Teilpopulation-Eigentuemer",
  apflora.tpop."TPopKontakt" AS "Teilpopulation-Kontakt",
  apflora.tpop."TPopNutzungszone" AS "Teilpopulation-Nutzungszone",
  apflora.tpop."TPopBewirtschafterIn" AS "Teilpopulation-Bewirtschafter",
  apflora.tpop."TPopBewirtschaftung" AS "Teilpopulation-Bewirtschaftung",
  apflora.tpop."TPopTxt" AS "Teilpopulation-Bemerkungen",
  apflora.tpopmassnber.jahr AS "Massnahmenbericht-Jahr",
  tpopmassn_erfbeurt_werte.text AS "Massnahmenbericht-Erfolgsberuteilung",
  apflora.tpopmassnber.bemerkungen AS "Massnahmenbericht-Interpretation"
FROM
  (((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  INNER JOIN
    (((apflora.pop
    LEFT JOIN
      apflora.pop_status_werte
      ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
    INNER JOIN
      ((apflora.tpop
      LEFT JOIN
        apflora.pop_status_werte
        AS "domPopHerkunft_1" ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1"."HerkunftId")
      LEFT JOIN
        apflora.tpop_apberrelevant_werte
        ON apflora.tpop."TPopApBerichtRelevant"  = apflora.tpop_apberrelevant_werte."DomainCode")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    INNER JOIN
      (apflora.tpopmassnber
      INNER JOIN
        apflora.tpopmassn_erfbeurt_werte
        ON apflora.tpopmassnber.beurteilung = tpopmassn_erfbeurt_werte.code)
      ON apflora.tpop."TPopId" = apflora.tpopmassnber.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassnber.jahr;

DROP VIEW IF EXISTS apflora.v_tpopmassnber;
CREATE OR REPLACE VIEW apflora.v_tpopmassnber AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte."HerkunftTxt" AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.tpop."TPopId",
  apflora.tpop."TPopId" AS "TPop ID",
  apflora.tpop."TPopGuid" AS "TPop Guid",
  apflora.tpop."TPopNr" AS "TPop Nr",
  apflora.tpop."TPopGemeinde" AS "TPop Gemeinde",
  apflora.tpop."TPopFlurname" AS "TPop Flurname",
  "tpopHerkunft"."HerkunftTxt" AS "TPop Status",
  apflora.tpop."TPopBekanntSeit" AS "TPop bekannt seit",
  apflora.tpop."TPopHerkunftUnklar" AS "TPop Status unklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "TPop Begruendung fuer unklaren Status",
  apflora.tpop."TPopXKoord" AS "TPop X-Koordinaten",
  apflora.tpop."TPopYKoord" AS "TPop Y-Koordinaten",
  apflora.tpop."TPopRadius" AS "TPop Radius (m)",
  apflora.tpop."TPopHoehe" AS "TPop Hoehe",
  apflora.tpop."TPopExposition" AS "TPop Exposition",
  apflora.tpop."TPopKlima" AS "TPop Klima",
  apflora.tpop."TPopNeigung" AS "TPop Hangneigung",
  apflora.tpop."TPopBeschr" AS "TPop Beschreibung",
  apflora.tpop."TPopKatNr" AS "TPop Kataster-Nr",
  apflora.tpop."TPopApBerichtRelevant" AS "TPop fuer AP-Bericht relevant",
  apflora.tpop."TPopEigen" AS "TPop EigentuemerIn",
  apflora.tpop."TPopKontakt" AS "TPop Kontakt vor Ort",
  apflora.tpop."TPopNutzungszone" AS "TPop Nutzungszone",
  apflora.tpop."TPopBewirtschafterIn" AS "TPop BewirtschafterIn",
  apflora.tpop."TPopBewirtschaftung" AS "TPop Bewirtschaftung",
  apflora.tpopmassnber.id AS "TPopMassnBer Id",
  apflora.tpopmassnber.jahr AS "TPopMassnBer Jahr",
  tpopmassn_erfbeurt_werte.text AS "TPopMassnBer Entwicklung",
  apflora.tpopmassnber.bemerkungen AS "TPopMassnBer Interpretation",
  apflora.tpopmassnber.changed AS "TPopMassnBer MutWann",
  apflora.tpopmassnber.changed_by AS "TPopMassnBer MutWer"
FROM
  apflora.adb_eigenschaften
  INNER JOIN
    (((apflora.ap
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
    INNER JOIN
      ((apflora.pop
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
      INNER JOIN
        ((apflora.tpop
        LEFT JOIN
          apflora.pop_status_werte AS "tpopHerkunft"
          ON apflora.tpop."TPopHerkunft" = "tpopHerkunft"."HerkunftId")
        INNER JOIN
          (apflora.tpopmassnber
          LEFT JOIN
            apflora.tpopmassn_erfbeurt_werte
            ON apflora.tpopmassnber.beurteilung = tpopmassn_erfbeurt_werte.code)
          ON apflora.tpop."TPopId" = apflora.tpopmassnber.tpop_id)
        ON apflora.pop."PopId" = apflora.tpop."PopId")
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassnber.jahr;

DROP VIEW IF EXISTS apflora.v_tpop_berjahrundmassnjahr cascade;
CREATE OR REPLACE VIEW apflora.v_tpop_berjahrundmassnjahr AS
SELECT
  apflora.tpop."TPopId",
  apflora.tpopber."TPopBerJahr" as "Jahr"
FROM
  apflora.tpop
  INNER JOIN apflora.tpopber ON apflora.tpop."TPopId" = apflora.tpopber."TPopId"
UNION DISTINCT SELECT
  apflora.tpop."TPopId",
  apflora.tpopmassnber.jahr as "Jahr"
FROM
  apflora.tpop
  INNER JOIN
    apflora.tpopmassnber
    ON apflora.tpop."TPopId" = apflora.tpopmassnber.tpop_id
ORDER BY
  "Jahr";

DROP VIEW IF EXISTS apflora.v_tpop_kontrjahrundberjahrundmassnjahr;
CREATE OR REPLACE VIEW apflora.v_tpop_kontrjahrundberjahrundmassnjahr AS
SELECT
  apflora.tpop."TPopId",
  apflora.tpopber."TPopBerJahr" AS "Jahr"
FROM
  apflora.tpop
  INNER JOIN apflora.tpopber ON apflora.tpop."TPopId" = apflora.tpopber."TPopId"
UNION DISTINCT SELECT
  apflora.tpop."TPopId",
  apflora.tpopmassnber.jahr AS "Jahr"
FROM
  apflora.tpop
  INNER JOIN
    apflora.tpopmassnber
    ON apflora.tpop."TPopId" = apflora.tpopmassnber.tpop_id
UNION DISTINCT SELECT
  apflora.tpop."TPopId",
  apflora.tpopkontr."TPopKontrJahr" AS "Jahr"
FROM
  apflora.tpop
  INNER JOIN apflora.tpopkontr ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId"
ORDER BY
  "Jahr";

DROP VIEW IF EXISTS apflora.v_qk2_massnber_ohnejahr;
CREATE OR REPLACE VIEW apflora.v_qk2_massnber_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Massnahmen-Bericht ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Massnahmen-Berichte', apflora.tpopmassnber.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Massnahmen-Bericht (Jahr): ', apflora.tpopmassnber.jahr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopmassnber
        ON apflora.tpop."TPopId" = apflora.tpopmassnber.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopmassnber.jahr IS NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassnber.jahr,
  apflora.tpopmassnber.id;

DROP VIEW IF EXISTS apflora.v_qk2_massnber_ohneerfbeurt;
CREATE OR REPLACE VIEW apflora.v_qk2_massnber_ohneerfbeurt AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Massnahmen-Bericht ohne Entwicklung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Massnahmen-Berichte', apflora.tpopmassnber.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Massnahmen-Bericht (Jahr): ', apflora.tpopmassnber.jahr)]::text[] AS text,
  apflora.tpopmassnber.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopmassnber
        ON apflora.tpop."TPopId" = apflora.tpopmassnber.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopmassnber.beurteilung IS NULL
  AND apflora.tpopmassnber.jahr IS NOT NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassnber.jahr;

DROP VIEW IF EXISTS apflora.v_tpop_popberundmassnber;
CREATE OR REPLACE VIEW apflora.v_tpop_popberundmassnber AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte."HerkunftTxt" AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.tpop."TPopId",
  apflora.tpop."TPopGuid" AS "TPop Guid",
  apflora.tpop."TPopNr" AS "TPop Nr",
  apflora.tpop."TPopGemeinde" AS "TPop Gemeinde",
  apflora.tpop."TPopFlurname" AS "TPop Flurname",
  "domPopHerkunft_1"."HerkunftTxt" AS "TPop Status",
  apflora.tpop."TPopBekanntSeit" AS "TPop bekannt seit",
  apflora.tpop."TPopHerkunftUnklar" AS "TPop Status unklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "TPop Begruendung fuer unklaren Status",
  apflora.tpop."TPopXKoord" AS "TPop X-Koordinaten",
  apflora.tpop."TPopYKoord" AS "TPop Y-Koordinaten",
  apflora.tpop."TPopRadius" AS "TPop Radius (m)",
  apflora.tpop."TPopHoehe" AS "TPop Hoehe",
  apflora.tpop."TPopExposition" AS "TPop Exposition",
  apflora.tpop."TPopKlima" AS "TPop Klima",
  apflora.tpop."TPopNeigung" AS "TPop Hangneigung",
  apflora.tpop."TPopBeschr" AS "TPop Beschreibung",
  apflora.tpop."TPopKatNr" AS "TPop Kataster-Nr",
  apflora.tpop."TPopApBerichtRelevant" AS "TPop fuer AP-Bericht relevant",
  apflora.tpop."TPopEigen" AS "TPop EigentuemerIn",
  apflora.tpop."TPopKontakt" AS "TPop Kontakt vor Ort",
  apflora.tpop."TPopNutzungszone" AS "TPop Nutzungszone",
  apflora.tpop."TPopBewirtschafterIn" AS "TPop BewirtschafterIn",
  apflora.tpop."TPopBewirtschaftung" AS "TPop Bewirtschaftung",
  apflora.v_tpop_berjahrundmassnjahr."Jahr",
  apflora.tpopber."TPopBerId" AS "TPopBer Id",
  apflora.tpopber."TPopBerJahr" AS "TPopBer Jahr",
  pop_entwicklung_werte."EntwicklungTxt" AS "TPopBer Entwicklung",
  apflora.tpopber."TPopBerTxt" AS "TPopBer Bemerkungen",
  apflora.tpopber."MutWann" AS "TPopBer MutWann",
  apflora.tpopber."MutWer" AS "TPopBer MutWer",
  apflora.tpopmassnber.jahr AS "TPopMassnBer Jahr",
  tpopmassn_erfbeurt_werte.text AS "TPopMassnBer Entwicklung",
  apflora.tpopmassnber.bemerkungen AS "TPopMassnBer Interpretation",
  apflora.tpopmassnber.changed AS "TPopMassnBer MutWann",
  apflora.tpopmassnber.changed_by AS "TPopMassnBer MutWer"
FROM
  ((((((((((apflora.adb_eigenschaften
  RIGHT JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  RIGHT JOIN
    (apflora.pop
    RIGHT JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.pop_status_werte ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
  LEFT JOIN
    apflora.pop_status_werte AS "domPopHerkunft_1"
    ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1"."HerkunftId")
  LEFT JOIN
    apflora.v_tpop_berjahrundmassnjahr
    ON apflora.tpop."TPopId" = apflora.v_tpop_berjahrundmassnjahr."TPopId")
  LEFT JOIN
    apflora.tpopmassnber
    ON
      (apflora.v_tpop_berjahrundmassnjahr."TPopId" = apflora.tpopmassnber.tpop_id)
      AND (apflora.v_tpop_berjahrundmassnjahr."Jahr" = apflora.tpopmassnber.jahr))
  LEFT JOIN
    apflora.tpopmassn_erfbeurt_werte
    ON apflora.tpopmassnber.beurteilung = tpopmassn_erfbeurt_werte.code)
  LEFT JOIN
    apflora.tpopber
    ON
      (apflora.v_tpop_berjahrundmassnjahr."Jahr" = apflora.tpopber."TPopBerJahr")
      AND (apflora.v_tpop_berjahrundmassnjahr."TPopId" = apflora.tpopber."TPopId"))
  LEFT JOIN
    apflora.pop_entwicklung_werte
    ON apflora.tpopber."TPopBerEntwicklung" = pop_entwicklung_werte."EntwicklungId"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.v_tpop_berjahrundmassnjahr."Jahr";

CREATE OR REPLACE FUNCTION apflora.qk2_tpop_ohne_massnber(apid integer, berichtjahr integer)
  RETURNS table("ProjId" integer, "ApArtId" integer, hw text, url text[], text text[]) AS
  $$
  -- 4. "TPop ohne verlangten Massnahmen-Bericht im Berichtjahr" ermitteln und in Qualitätskontrollen auflisten:
  SELECT DISTINCT
    1 AS "ProjId",
    apflora.pop."ApArtId",
    'Teilpopulation mit Ansiedlung (vor dem Berichtjahr) und Kontrolle (im Berichtjahr) aber ohne Massnahmen-Bericht (im Berichtjahr):' AS hw,
    ARRAY['Projekte', 1 , 'Arten', apflora.pop."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url",
    ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
  FROM
    apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId"
  WHERE
    apflora.tpop."TPopApBerichtRelevant" = 1
    AND apflora.tpop."TPopId" IN (
      -- 1. "TPop mit Ansiedlungen/Ansaaten vor dem Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.tpopmassn.tpop_id
      FROM
        apflora.tpopmassn
      WHERE
        apflora.tpopmassn.typ IN (1, 2, 3)
        AND apflora.tpopmassn.jahr < $2
    )
    AND apflora.tpop."TPopId" IN (
      -- 2. "TPop mit Kontrolle im Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.tpopkontr."TPopId"
      FROM
        apflora.tpopkontr
      WHERE
        apflora.tpopkontr."TPopKontrTyp" NOT IN ('Zwischenziel', 'Ziel')
        AND apflora.tpopkontr."TPopKontrJahr" = $2
    )
    AND apflora.tpop."TPopId" NOT IN (
      -- 3. "TPop mit TPopMassnBer im Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.tpopmassnber.tpop_id
      FROM
        apflora.tpopmassnber
      WHERE
        apflora.tpopmassnber.jahr = $2
    )
    AND apflora.pop."ApArtId" = $1
  $$
  LANGUAGE sql STABLE;
ALTER FUNCTION apflora.qk2_tpop_ohne_massnber(apid integer, berichtjahr integer)
  OWNER TO postgres;

DROP TRIGGER IF EXISTS tpopmassnber_on_update_set_mut ON apflora.tpopmassnber;
DROP FUNCTION IF EXISTS tpopmassnber_on_update_set_mut();
CREATE FUNCTION tpopmassnber_on_update_set_mut() RETURNS trigger AS $tpopmassnber_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$tpopmassnber_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER tpopmassnber_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.tpopmassnber
  FOR EACH ROW EXECUTE PROCEDURE tpopmassnber_on_update_set_mut();

DROP VIEW IF EXISTS apflora.v_tpop_letztermassnber;
CREATE OR REPLACE VIEW apflora.v_tpop_letztermassnber AS
SELECT
  apflora.v_tpop_letztermassnber0."ApArtId",
  apflora.v_tpop_letztermassnber0."TPopId",
  max(apflora.v_tpop_letztermassnber0.jahr) AS "MaxvonTPopMassnBerJahr"
FROM
  apflora.v_tpop_letztermassnber0
GROUP BY
  apflora.v_tpop_letztermassnber0."ApArtId",
  apflora.v_tpop_letztermassnber0."TPopId";

DROP VIEW IF EXISTS apflora.v_pop_berjahrundmassnjahrvontpop;
CREATE OR REPLACE VIEW apflora.v_pop_berjahrundmassnjahrvontpop AS
SELECT
  apflora.tpop."PopId",
  apflora.v_tpop_berjahrundmassnjahr."Jahr"
FROM
  apflora.v_tpop_berjahrundmassnjahr
  INNER JOIN
    apflora.tpop
    ON apflora.v_tpop_berjahrundmassnjahr."TPopId" = apflora.tpop."TPopId"
GROUP BY
  apflora.tpop."PopId",
  apflora.v_tpop_berjahrundmassnjahr."Jahr";

DROP VIEW IF EXISTS apflora.v_apber_c3rtpop;
CREATE OR REPLACE VIEW apflora.v_apber_c3rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    ((apflora.v_tpop_letztermassnber
    INNER JOIN
      apflora.tpopmassnber
      ON
        (apflora.v_tpop_letztermassnber."TPopId" = apflora.tpopmassnber.tpop_id)
        AND (apflora.v_tpop_letztermassnber."MaxvonTPopMassnBerJahr" = apflora.tpopmassnber.jahr))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber.tpop_id = apflora.tpop."TPopId")
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopmassnber.beurteilung = 1
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";
  

DROP VIEW IF EXISTS apflora.v_apber_c4rtpop;
CREATE OR REPLACE VIEW apflora.v_apber_c4rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    ((apflora.v_tpop_letztermassnber
    INNER JOIN
      apflora.tpopmassnber
      ON
        (apflora.v_tpop_letztermassnber."TPopId" = apflora.tpopmassnber.tpop_id)
        AND (apflora.v_tpop_letztermassnber."MaxvonTPopMassnBerJahr" = apflora.tpopmassnber.jahr))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber.tpop_id = apflora.tpop."TPopId")
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  (apflora.tpopmassnber.beurteilung = 2)
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_c5rtpop;
CREATE OR REPLACE VIEW apflora.v_apber_c5rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    ((apflora.v_tpop_letztermassnber
    INNER JOIN
      apflora.tpopmassnber
      ON
        (apflora.v_tpop_letztermassnber."TPopId" = apflora.tpopmassnber.tpop_id)
        AND (apflora.v_tpop_letztermassnber."MaxvonTPopMassnBerJahr" = apflora.tpopmassnber.jahr))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber.tpop_id = apflora.tpop."TPopId")
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopmassnber.beurteilung = 3
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_c6rtpop;
CREATE OR REPLACE VIEW apflora.v_apber_c6rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    ((apflora.v_tpop_letztermassnber
    INNER JOIN
      apflora.tpopmassnber
      ON
        (apflora.v_tpop_letztermassnber."TPopId" = apflora.tpopmassnber.tpop_id)
        AND (apflora.v_tpop_letztermassnber."MaxvonTPopMassnBerJahr" = apflora.tpopmassnber.jahr))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber.tpop_id = apflora.tpop."TPopId")
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopmassnber.beurteilung = 4
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_c7rtpop;
CREATE OR REPLACE VIEW apflora.v_apber_c7rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    ((apflora.v_tpop_letztermassnber
    INNER JOIN
      apflora.tpopmassnber
      ON
        (apflora.v_tpop_letztermassnber."TPopId" = apflora.tpopmassnber.tpop_id)
        AND (apflora.v_tpop_letztermassnber."MaxvonTPopMassnBerJahr" = apflora.tpopmassnber.jahr))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber.tpop_id = apflora.tpop."TPopId")
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopmassnber.beurteilung = 5
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";