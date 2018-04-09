ALTER TABLE apflora.tpopber ADD COLUMN id UUID UNIQUE DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.tpopber RENAME "TPopBerId" TO id_old;
ALTER TABLE apflora.tpopber RENAME "TPopId" TO tpop_id;
ALTER TABLE apflora.tpopber RENAME "TPopBerJahr" TO jahr;
ALTER TABLE apflora.tpopber RENAME "TPopBerEntwicklung" TO entwicklung;
ALTER TABLE apflora.tpopber RENAME "TPopBerTxt" TO bemerkungen;
ALTER TABLE apflora.tpopber RENAME "MutWann" TO changed;
ALTER TABLE apflora.tpopber RENAME "MutWer" TO changed_by;

COMMENT ON COLUMN apflora.tpopber.id_old IS 'frühere id';

-- change primary key
ALTER TABLE apflora.tpopber DROP CONSTRAINT tpopber_pkey;
ALTER TABLE apflora.tpopber ADD PRIMARY KEY (id);

-- done: make sure createTable is correct
-- done: rename in sql
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers with tpopmassnber to this file
-- done: rename in js
-- TODO: run migration sql in dev
-- TODO: test app
-- TODO: update js and run this file on server




DROP TRIGGER IF EXISTS tpop_max_one_tpopber_per_year ON apflora.tpopber;
DROP FUNCTION IF EXISTS apflora.tpop_max_one_tpopber_per_year();
CREATE FUNCTION apflora.tpop_max_one_tpopber_per_year() RETURNS trigger AS $tpop_max_one_tpopber_per_year$
  BEGIN
    -- check if a tpopber already exists for this year
    IF
      (
        NEW.jahr > 0
        AND NEW.jahr IN
        (
          SELECT
            jahr
          FROM
            apflora.tpopber
          WHERE
            tpop_id = NEW.tpop_id
            AND id <> NEW.id
        )
      )
    THEN
      RAISE EXCEPTION 'Pro Teilpopulation und Jahr darf maximal ein Teilpopulationsbericht erfasst werden';
    END IF;
    RETURN NEW;
  END;
$tpop_max_one_tpopber_per_year$ LANGUAGE plpgsql;

CREATE TRIGGER tpop_max_one_tpopber_per_year BEFORE UPDATE OR INSERT ON apflora.tpopber
  FOR EACH ROW EXECUTE PROCEDURE apflora.tpop_max_one_tpopber_per_year();

DROP VIEW IF EXISTS apflora.v_tpop_letztertpopber0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_letztertpopber0 AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId",
  apflora.tpopber.jahr AS "TPopBerJahr"
FROM
  apflora._variable,
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN (apflora.tpop
      INNER JOIN
        apflora.tpopber
        ON apflora.tpop."TPopId" = apflora.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopber.jahr <= apflora._variable."JBerJahr"
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300;

DROP VIEW IF EXISTS apflora.v_pop_letztermassnber0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_letztermassnber0 AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.popmassnber."PopMassnBerJahr"
FROM
  apflora._variable,
  ((apflora.pop
  INNER JOIN
    apflora.popmassnber
    ON apflora.pop."PopId" = apflora.popmassnber."PopId")
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId")
  INNER JOIN
    apflora.tpopmassn
    ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
WHERE
  apflora.popmassnber."PopMassnBerJahr" <= apflora._variable."JBerJahr"
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.tpopmassn.jahr <= apflora._variable."JBerJahr"
  AND apflora.pop."PopHerkunft" <> 300;

-- dieser view ist für die Qualitätskontrolle gedacht - daher letzter tpopber überhaupt
DROP VIEW IF EXISTS apflora.v_tpop_letztertpopber0_overall CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_letztertpopber0_overall AS
SELECT
  "TPopId",
  max(jahr) AS "TPopBerJahr"
FROM
  apflora.tpopber
WHERE
  jahr IS NOT NULL
GROUP BY
  "TPopId";

DROP VIEW IF EXISTS apflora.v_tpopber_letzterber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopber_letzterber AS
SELECT
  apflora.tpop_id AS "TPopId",
  max(apflora.tpopber.jahr) AS "MaxvonTPopBerJahr"
FROM
  apflora.tpopber
GROUP BY
  apflora.tpop_id;

DROP VIEW IF EXISTS apflora.v_apber_b1rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b1rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop_id AS "TPopId"
FROM
  apflora._variable,
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      apflora.tpopber
      ON apflora.tpop."TPopId" = apflora.tpop_id)
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
  AND apflora.tpopber.jahr <= apflora._variable."JBerJahr"
  AND apflora.tpopber.entwicklung in (1, 2, 3, 4, 8)
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop_id;

DROP VIEW IF EXISTS apflora.v_apber_b1ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b1ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        apflora._variable
        ON apflora.tpopber.jahr = apflora._variable."JBerJahr")
      ON apflora.tpop."TPopId" = apflora.tpop_id)
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b2ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b2ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        apflora._variable
        ON apflora.tpopber.jahr = apflora._variable."JBerJahr")
      ON apflora.tpop."TPopId" = apflora.tpop_id)
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopber.entwicklung = 3
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b3ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b3ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        apflora._variable
        ON apflora.tpopber.jahr = apflora._variable."JBerJahr")
      ON apflora.tpop."TPopId" = apflora.tpop_id)
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopber.entwicklung = 2
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b4ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b4ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        apflora._variable
        ON apflora.tpopber.jahr = apflora._variable."JBerJahr")
      ON apflora.tpop."TPopId" = apflora.tpop_id)
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopber.entwicklung = 1
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b5ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b5ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        apflora._variable
        ON apflora.tpopber.jahr = apflora._variable."JBerJahr")
      ON apflora.tpop."TPopId" = apflora.tpop_id)
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopber.entwicklung = 4
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b6ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b6ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        apflora._variable
        ON apflora.tpopber.jahr = apflora._variable."JBerJahr")
      ON apflora.tpop."TPopId" = apflora.tpop_id)
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopber.entwicklung = 8
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_tpopber_letzteid CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopber_letzteid AS
SELECT
  apflora.tpopkontr."TPopId",
  max(apflora.tpopber.id) AS "MaxTPopBerId",
  max(apflora.tpopber.jahr) AS "MaxTPopBerJahr",
  count(apflora.tpopber.id) AS "AnzTPopBer"
FROM
  apflora.tpopkontr
  INNER JOIN
    apflora.tpopber
    ON apflora.tpopkontr."TPopId" = apflora.tpop_id
WHERE
  apflora.tpopkontr."TPopKontrTyp" NOT IN ('Ziel', 'Zwischenziel')
  AND apflora.tpopber.jahr IS NOT NULL
GROUP BY
  apflora.tpopkontr."TPopId";

DROP VIEW IF EXISTS apflora.v_tpopber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopber AS
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
  apflora.tpopber.id AS "TPopBer Id",
  apflora.tpopber.jahr AS "TPopBer Jahr",
  pop_entwicklung_werte."EntwicklungTxt" AS "TPopBer Entwicklung",
  apflora.tpopber.bemerkungen AS "TPopBer Bemerkungen",
  apflora.tpopber.changed AS "TPopBer MutWann",
  apflora.tpopber.changed_by AS "TPopBer MutWer"
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
        RIGHT JOIN
          (apflora.tpopber
          LEFT JOIN
            apflora.pop_entwicklung_werte
            ON apflora.tpopber.entwicklung = pop_entwicklung_werte."EntwicklungId")
          ON apflora.tpop."TPopId" = apflora.tpop_id)
        ON apflora.pop."PopId" = apflora.tpop."PopId")
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopber.jahr,
  pop_entwicklung_werte."EntwicklungTxt";

DROP VIEW IF EXISTS apflora.v_tpop_berjahrundmassnjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_berjahrundmassnjahr AS
SELECT
  apflora.tpop."TPopId",
  apflora.tpopber.jahr as "Jahr"
FROM
  apflora.tpop
  INNER JOIN apflora.tpopber ON apflora.tpop."TPopId" = apflora.tpop_id
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

DROP VIEW IF EXISTS apflora.v_tpop_kontrjahrundberjahrundmassnjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_kontrjahrundberjahrundmassnjahr AS
SELECT
  apflora.tpop."TPopId",
  apflora.tpopber.jahr AS "Jahr"
FROM
  apflora.tpop
  INNER JOIN apflora.tpopber ON apflora.tpop."TPopId" = apflora.tpop_id
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

DROP VIEW IF EXISTS apflora.v_qk2_tpopber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpopber_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulations-Bericht ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Kontroll-Berichte', apflora.tpopber.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Teilpopulations-Bericht (id): ', apflora.tpopber.id)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopber
        ON apflora.tpop."TPopId" = apflora.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopber.jahr IS NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopber.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_tpopber_ohneentwicklung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpopber_ohneentwicklung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulations-Bericht ohne Entwicklung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Kontroll-Berichte', apflora.tpopber.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Teilpopulations-Bericht (Jahr): ', apflora.tpopber.jahr)]::text[] AS text,
  apflora.tpopber.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    INNER JOIN
      apflora.tpop
      INNER JOIN
        apflora.tpopber
        ON apflora.tpop."TPopId" = apflora.tpop_id
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopber.entwicklung IS NULL
  AND apflora.tpopber.jahr IS NOT NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopber.jahr;
DROP VIEW IF EXISTS apflora.v_qk2_pop_mit_ber_zunehmend_ohne_tpopber_zunehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_mit_ber_zunehmend_ohne_tpopber_zunehmend AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber."PopBerJahr" AS "Berichtjahr",
  'Populationen mit Bericht "zunehmend" ohne Teil-Population mit Bericht "zunehmend":'::text AS hw,
  ARRAY['Projekte', apflora.ap."ProjId" , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
  apflora.pop
    INNER JOIN apflora.popber
    ON apflora.pop."PopId" = apflora.popber."PopId"
  ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.popber."PopBerEntwicklung" = 3
  AND apflora.popber."PopId" NOT IN (
    SELECT DISTINCT apflora.tpop."PopId"
    FROM
      apflora.tpop
      INNER JOIN apflora.tpopber
      ON apflora.tpop."TPopId" = apflora.tpop_id
    WHERE
      apflora.tpopber.entwicklung = 3
      AND apflora.tpopber.jahr = apflora.popber."PopBerJahr"
  )
ORDER BY
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber."PopBerJahr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_mit_ber_abnehmend_ohne_tpopber_abnehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_mit_ber_abnehmend_ohne_tpopber_abnehmend AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber."PopBerJahr" AS "Berichtjahr",
  'Populationen mit Bericht "abnehmend" ohne Teil-Population mit Bericht "abnehmend":'::text AS hw,
  ARRAY['Projekte', apflora.ap."ProjId" , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
  apflora.pop
    INNER JOIN apflora.popber
    ON apflora.pop."PopId" = apflora.popber."PopId"
  ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.popber."PopBerEntwicklung" = 1
  AND apflora.popber."PopId" NOT IN (
    SELECT DISTINCT apflora.tpop."PopId"
    FROM
      apflora.tpop
      INNER JOIN apflora.tpopber
      ON apflora.tpop."TPopId" = apflora.tpop_id
    WHERE
      apflora.tpopber.entwicklung = 1
      AND apflora.tpopber.jahr = apflora.popber."PopBerJahr"
  )
ORDER BY
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber."PopBerJahr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_mit_ber_erloschen_ohne_tpopber_erloschen CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_mit_ber_erloschen_ohne_tpopber_erloschen AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber."PopBerJahr" AS "Berichtjahr",
  'Populationen mit Bericht "erloschen" ohne Teil-Population mit Bericht "erloschen":'::text AS hw,
  ARRAY['Projekte', apflora.ap."ProjId" , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
  apflora.pop
    INNER JOIN apflora.popber
    ON apflora.pop."PopId" = apflora.popber."PopId"
  ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.popber."PopBerEntwicklung" = 8
  AND apflora.popber."PopId" NOT IN (
    SELECT DISTINCT apflora.tpop."PopId"
    FROM
      apflora.tpop
      INNER JOIN apflora.tpopber
      ON apflora.tpop."TPopId" = apflora.tpop_id
    WHERE
      apflora.tpopber.entwicklung = 8
      AND apflora.tpopber.jahr = apflora.popber."PopBerJahr"
  )
ORDER BY
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber."PopBerJahr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_mit_ber_erloschen_und_tpopber_nicht_erloschen CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_mit_ber_erloschen_und_tpopber_nicht_erloschen AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber."PopBerJahr" AS "Berichtjahr",
  'Populationen mit Bericht "erloschen" und mindestens einer gemäss Bericht nicht erloschenen Teil-Population:'::text AS hw,
  ARRAY['Projekte', apflora.ap."ProjId" , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
  apflora.pop
    INNER JOIN apflora.popber
    ON apflora.pop."PopId" = apflora.popber."PopId"
  ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.popber."PopBerEntwicklung" = 8
  AND apflora.popber."PopId" IN (
    SELECT DISTINCT apflora.tpop."PopId"
    FROM
      apflora.tpop
      INNER JOIN apflora.tpopber
      ON apflora.tpop."TPopId" = apflora.tpop_id
    WHERE
      apflora.tpopber.entwicklung < 8
      AND apflora.tpopber.jahr = apflora.popber."PopBerJahr"
  )
ORDER BY
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber."PopBerJahr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statusaktuellletztertpopbererloschen CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statusaktuellletztertpopbererloschen AS
WITH lasttpopber AS (
  SELECT DISTINCT ON ("TPopId")
    "TPopId",
    "TPopBerJahr",
    "TPopBerEntwicklung"
  FROM
    apflora.tpopber
  WHERE
    "TPopBerJahr" IS NOT NULL
  ORDER BY
    "TPopId",
    "TPopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Status ist "aktuell" (ursprünglich oder angesiedelt) oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "erloschen" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop."TPopId" = lasttpopber."TPopId"
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (100, 200, 210, 300)
  AND lasttpopber."TPopBerEntwicklung" = 8
  AND apflora.tpop."TPopId" NOT IN (
    -- Ansiedlungen since apflora.tpopber.jahr
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop."TPopId"
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > lasttpopber."TPopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopberzunehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletztertpopberzunehmend AS
WITH lasttpopber AS (
  SELECT DISTINCT ON ("TPopId")
    "TPopId",
    "TPopBerJahr",
    "TPopBerEntwicklung"
  FROM
    apflora.tpopber
  WHERE
    "TPopBerJahr" IS NOT NULL
  ORDER BY
    "TPopId",
    "TPopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "zunehmend" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop."TPopId" = lasttpopber."TPopId"
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 201, 202, 211, 300)
  AND lasttpopber."TPopBerEntwicklung" = 3
  AND apflora.tpop."TPopId" NOT IN (
    -- Ansiedlungen since apflora.tpopber."TPopBerJahr"
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop."TPopId"
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > lasttpopber."TPopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopberstabil CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletztertpopberstabil AS
WITH lasttpopber AS (
  SELECT DISTINCT ON ("TPopId")
    "TPopId",
    "TPopBerJahr",
    "TPopBerEntwicklung"
  FROM
    apflora.tpopber
  WHERE
    "TPopBerJahr" IS NOT NULL
  ORDER BY
    "TPopId",
    "TPopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "stabil" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop."TPopId" = lasttpopber."TPopId"
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 201, 202, 211, 300)
  AND lasttpopber."TPopBerEntwicklung" = 2
  AND apflora.tpop."TPopId" NOT IN (
    -- Ansiedlungen since apflora.tpopber."TPopBerJahr"
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop."TPopId"
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > lasttpopber."TPopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopberabnehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletztertpopberabnehmend AS
WITH lasttpopber AS (
  SELECT DISTINCT ON ("TPopId")
    "TPopId",
    "TPopBerJahr",
    "TPopBerEntwicklung"
  FROM
    apflora.tpopber
  WHERE
    "TPopBerJahr" IS NOT NULL
  ORDER BY
    "TPopId",
    "TPopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "abnehmend" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop."TPopId" = lasttpopber."TPopId"
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 201, 202, 211, 300)
  AND lasttpopber."TPopBerEntwicklung" = 1
  AND apflora.tpop."TPopId" NOT IN (
    -- Ansiedlungen since apflora.tpopber."TPopBerJahr"
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop."TPopId"
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > lasttpopber."TPopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopberunsicher CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletztertpopberunsicher AS
WITH lasttpopber AS (
  SELECT DISTINCT ON ("TPopId")
    "TPopId",
    "TPopBerJahr",
    "TPopBerEntwicklung"
  FROM
    apflora.tpopber
  WHERE
    "TPopBerJahr" IS NOT NULL
  ORDER BY
    "TPopId",
    "TPopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt) oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "unsicher" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop."TPopId" = lasttpopber."TPopId"
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 202, 211, 300)
  AND lasttpopber."TPopBerEntwicklung" = 4
  AND apflora.tpop."TPopId" NOT IN (
    -- Ansiedlungen since "TPopBerJahr"
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop."TPopId"
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > lasttpopber."TPopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopbererloschenmitansiedlung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletztertpopbererloschenmitansiedlung AS
WITH lasttpopber AS (
  SELECT DISTINCT ON ("TPopId")
    "TPopId",
    "TPopBerJahr",
    "TPopBerEntwicklung"
  FROM
    apflora.tpopber
  WHERE
    "TPopBerJahr" IS NOT NULL
  ORDER BY
    "TPopId",
    "TPopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt); der letzte Teilpopulations-Bericht meldet "erloschen". Seither gab es aber eine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop."TPopId" = lasttpopber."TPopId"
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 202, 211)
  AND lasttpopber."TPopBerEntwicklung" = 8
  AND apflora.tpop."TPopId" IN (
    -- Ansiedlungen since apflora.tpopber."TPopBerJahr"
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop."TPopId"
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > lasttpopber."TPopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_tpop_statuswidersprichtbericht CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_statuswidersprichtbericht AS
SELECT
  apflora.adb_eigenschaften."Artname" AS "Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "Bearbeitungsstand AP",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname",
  apflora.tpop."TPopHerkunft",
  apflora.tpopber.entwicklung AS "TPopBerEntwicklung",
  apflora.tpopber.jahr AS "TPopBerJahr"
FROM
  ((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopber
        INNER JOIN
          apflora.v_tpopber_letzterber
          ON
            (apflora.tpop_id = apflora.v_tpopber_letzterber."TPopId")
            AND (apflora.tpopber.jahr = apflora.v_tpopber_letzterber."MaxvonTPopBerJahr"))
        ON apflora.tpop."TPopId" = apflora.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  INNER JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode"
WHERE
  (
    apflora.ap."ApStatus" < 4
    AND (
      apflora.tpop."TPopHerkunft" = 101
      OR apflora.tpop."TPopHerkunft" = 202
    )
    AND apflora.tpopber.entwicklung <> 8
  )
  OR (
    apflora.ap."ApStatus" < 4
    AND apflora.tpop."TPopHerkunft" NOT IN (101, 202)
    AND apflora.tpopber.entwicklung = 8
  )
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname";

DROP VIEW IF EXISTS apflora.v_apber_b2rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b2rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.tpop
  INNER JOIN
    (apflora.tpopber
    INNER JOIN
      (apflora.pop
      INNER JOIN
        apflora.v_tpop_letztertpopber
        ON apflora.pop."ApArtId" = apflora.v_tpop_letztertpopber."ApArtId")
      ON
        (apflora.tpop_id = apflora.v_tpop_letztertpopber."TPopId")
        AND (apflora.tpopber.jahr = apflora.v_tpop_letztertpopber."MaxvonTPopBerJahr"))
    ON
      (apflora.tpop."PopId" = apflora.pop."PopId")
      AND (apflora.tpop."TPopId" = apflora.tpop_id)
WHERE
  apflora.tpopber.entwicklung = 3
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b3rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b3rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.tpop
  INNER JOIN
    (apflora.tpopber
    INNER JOIN
      (apflora.pop
      INNER JOIN
        apflora.v_tpop_letztertpopber
        ON apflora.pop."ApArtId" = apflora.v_tpop_letztertpopber."ApArtId")
      ON
        (apflora.tpop_id = apflora.v_tpop_letztertpopber."TPopId")
        AND (apflora.tpopber.jahr = apflora.v_tpop_letztertpopber."MaxvonTPopBerJahr"))
    ON
      (apflora.tpop."PopId" = apflora.pop."PopId")
      AND (apflora.tpop."TPopId" = apflora.tpop_id)
WHERE
  apflora.tpopber.entwicklung = 2
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b4rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b4rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.tpop
  INNER JOIN
    (apflora.tpopber
    INNER JOIN
      (apflora.pop
      INNER JOIN
        apflora.v_tpop_letztertpopber
        ON apflora.pop."ApArtId" = apflora.v_tpop_letztertpopber."ApArtId")
      ON
        (apflora.tpop_id = apflora.v_tpop_letztertpopber."TPopId")
        AND (apflora.tpopber.jahr = apflora.v_tpop_letztertpopber."MaxvonTPopBerJahr"))
    ON
      (apflora.tpop."PopId" = apflora.pop."PopId")
      AND (apflora.tpop."TPopId" = apflora.tpop_id)
WHERE
  apflora.tpopber.entwicklung = 1
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b5rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b5rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.tpop
  INNER JOIN
    (apflora.tpopber
    INNER JOIN
      (apflora.pop
      INNER JOIN
        apflora.v_tpop_letztertpopber
        ON apflora.pop."ApArtId" = apflora.v_tpop_letztertpopber."ApArtId")
      ON
        (apflora.tpop_id = apflora.v_tpop_letztertpopber."TPopId")
        AND (apflora.tpopber.jahr = apflora.v_tpop_letztertpopber."MaxvonTPopBerJahr"))
    ON
      (apflora.tpop."PopId" = apflora.pop."PopId")
      AND (apflora.tpop."TPopId" = apflora.tpop_id)
WHERE
  apflora.tpopber.entwicklung = 4
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b6rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b6rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.tpop
  INNER JOIN
    (apflora.tpopber
    INNER JOIN
      (apflora.pop
      INNER JOIN
        apflora.v_tpop_letztertpopber
        ON apflora.pop."ApArtId" = apflora.v_tpop_letztertpopber."ApArtId")
      ON
        (apflora.tpop_id = apflora.v_tpop_letztertpopber."TPopId")
        AND (apflora.tpopber.jahr = apflora.v_tpop_letztertpopber."MaxvonTPopBerJahr"))
    ON
      (apflora.tpop."PopId" = apflora.pop."PopId")
      AND (apflora.tpop."TPopId" = apflora.tpop_id)
WHERE
  apflora.tpopber.entwicklung = 8
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_tpop_popberundmassnber CASCADE;
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
  apflora.tpopber.id AS "TPopBer Id",
  apflora.tpopber.jahr AS "TPopBer Jahr",
  pop_entwicklung_werte."EntwicklungTxt" AS "TPopBer Entwicklung",
  apflora.tpopber.bemerkungen AS "TPopBer Bemerkungen",
  apflora.tpopber.changed AS "TPopBer MutWann",
  apflora.tpopber.changed_by AS "TPopBer MutWer",
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
      (apflora.v_tpop_berjahrundmassnjahr."Jahr" = apflora.tpopber.jahr)
      AND (apflora.v_tpop_berjahrundmassnjahr."TPopId" = apflora.tpop_id))
  LEFT JOIN
    apflora.pop_entwicklung_werte
    ON apflora.tpopber.entwicklung = pop_entwicklung_werte."EntwicklungId"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.v_tpop_berjahrundmassnjahr."Jahr";

DROP VIEW IF EXISTS apflora.v_tpopber_mitletzterid CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopber_mitletzterid AS
SELECT
  apflora.tpop_id AS "TPopId",
  apflora.v_tpopber_letzteid."AnzTPopBer",
  apflora.tpopber.id,
  apflora.tpopber.jahr AS "TPopBer Jahr",
  apflora.pop_entwicklung_werte."EntwicklungTxt" AS "TPopBer Entwicklung",
  apflora.tpopber.bemerkungen AS "TPopBer Bemerkungen",
  apflora.tpopber.changed AS "TPopBer MutWann",
  apflora.tpopber.changed_by AS "TPopBer MutWer"
FROM
  apflora.v_tpopber_letzteid
  INNER JOIN
    apflora.tpopber
    ON
      (apflora.v_tpopber_letzteid."MaxTPopBerId" = apflora.tpopber.id)
      AND (apflora.v_tpopber_letzteid."TPopId" = apflora.tpop_id)
  LEFT JOIN
    apflora.pop_entwicklung_werte
    ON apflora.tpopber.entwicklung = pop_entwicklung_werte."EntwicklungId";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletzterpopberaktuell CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletzterpopberaktuell AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Teilpopulation: Status ist "erloschen", der letzte Teilpopulations-Bericht meldet aber "aktuell":' AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.ap
    INNER JOIN
    apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopber
        INNER JOIN
          apflora.v_tpop_letztertpopber0_overall
          ON
            (v_tpop_letztertpopber0_overall."TPopBerJahr" = apflora.tpopber.jahr)
            AND (v_tpop_letztertpopber0_overall."TPopId" = apflora.tpop_id))
        ON apflora.tpop_id = apflora.tpop."TPopId")
      ON apflora.tpop."PopId" = apflora.pop."PopId"
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.tpopber.entwicklung < 8
  AND apflora.tpop."TPopHerkunft" IN (101, 202, 211)
  AND apflora.tpop."TPopId" NOT IN (
    -- Ansiedlungen since apflora.tpopber.jahr
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop."TPopId"
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > apflora.tpopber.jahr
  );

DROP VIEW IF EXISTS apflora.v_exportevab_beob CASCADE;
CREATE OR REPLACE VIEW apflora.v_exportevab_beob AS
SELECT
  apflora.tpopkontr."ZeitGuid" AS "fkZeitpunkt",
  apflora.tpopkontr."TPopKontrGuid" AS "idBeobachtung",
  -- TODO: should EvabIdPerson be real uuid?
  COALESCE(apflora.adresse."EvabIdPerson", '{7C71B8AF-DF3E-4844-A83B-55735F80B993}'::uuid) AS fkAutor,
  apflora.ap."ApArtId" AS fkArt,
  18 AS fkArtgruppe,
  1 AS fkAA1,
  /*
  Status in EvAB (offizielle Ansiedlung / inoffiziell):
  - Status ist ursprünglich (< 200):
    4 (N) (Natürliches Vorkommen (indigene Arten) oder eingebürgertes Vorkommen (Neophyten))
  - Vor der Kontrolle existiert eine Ansiedlung:
    6 (R) (Offizielle Wiederansiedlung/Populationsverstärkung (Herkunft bekannt))
  - Status ist angesiedelt (>= 200), es gibt keine Ansiedlung und Status ist unklar:
    3 (I) (Herkunft unklar, Verdacht auf Ansiedlung/Ansalbung,Einsaat/Anpflanzung oder sonstwie anthropogen unterstütztes Auftreten)
    Ideal wäre: Neues Feld Herkunft uklar, Anwesenheit unklar. Hier nur Herkunft berücksichtigen
  - Status ist angesiedelt (>= 200), es gibt keine Ansiedlung und Status ist klar:
    5 (O) (Inoffizielle Ansiedlung (offensichtlich gepflanzt/angesalbt oder eingesät, Herkunft unbekannt))
  */
   CASE
    WHEN apflora.tpop."TPopHerkunft" < 200 THEN 4
    WHEN EXISTS(
      SELECT
        apflora.tpopmassn.tpop_id
      FROM
        apflora.tpopmassn
      WHERE
        apflora.tpopmassn.tpop_id = apflora.tpopkontr."TPopId"
        AND apflora.tpopmassn.typ BETWEEN 1 AND 3
        AND apflora.tpopmassn.jahr <= apflora.tpopkontr."TPopKontrJahr"
    ) THEN 6
    WHEN apflora.tpop."TPopHerkunftUnklar" = 1 THEN 3
    ELSE 5
  END AS "fkAAINTRODUIT",
  /*
  Präsenz:
  - wenn 0 gezählt wurden und der Bericht aus demselben Jahr erloschen meldet:
    2 (erloschen/zerstört)
  - wenn 0 gezählt wurden und der Bericht aus demselben Jahr nicht erloschen meldet:
    3 (nicht festgestellt/gesehen (ohne Angabe der Wahrscheinlichkeit))
  - sonst
    1 (vorhanden)
  */
  CASE
    WHEN (
      apflora.v_tpopkontr_maxanzahl.anzahl = 0
      AND EXISTS (
        SELECT
          "TPopId"
        FROM
          apflora.tpopber
        WHERE
          apflora.tpop_id = apflora.tpopkontr."TPopId"
          AND apflora.tpopber.entwicklung = 8
          AND apflora.tpopber.jahr = apflora.tpopkontr."TPopKontrJahr"
      )
    ) THEN 2
    WHEN apflora.v_tpopkontr_maxanzahl.anzahl = 0 THEN 3
    ELSE 1
  END AS "fkAAPRESENCE",
  apflora.tpopkontr."TPopKontrGefaehrdung" AS "MENACES",
  substring(apflora.tpopkontr."TPopKontrVitalitaet" from 1 for 200) AS "VITALITE_PLANTE",
  substring(apflora.tpop."TPopBeschr" from 1 for 244) AS "STATION",
  /*
   * Zählungen auswerten für ABONDANCE
   */
  substring(
    concat(
      'Anzahlen: ',
      array_to_string(array_agg(apflora.tpopkontrzaehl.anzahl), ', '),
      ', Zaehleinheiten: ',
      string_agg(apflora.tpopkontrzaehl_einheit_werte.text, ', '),
      ', Methoden: ',
      string_agg(apflora.tpopkontrzaehl_methode_werte.text, ', ')
      )
    from 1 for 160
  ) AS "ABONDANCE",
  'C'::TEXT AS "EXPERTISE_INTRODUIT",
  /*
   * AP-Verantwortliche oder topos als EXPERTISE_INTRODUITE_NOM setzen
   */
  CASE
    WHEN "tblAdresse_2"."EvabIdPerson" IS NOT NULL
    THEN "tblAdresse_2"."AdrName"
    ELSE 'topos Marti & Müller AG Zürich'
  END AS "EXPERTISE_INTRODUITE_NOM"
FROM
  (apflora.ap
  LEFT JOIN
    apflora.adresse AS "tblAdresse_2"
    ON apflora.ap."ApBearb" = "tblAdresse_2"."AdrId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (((apflora.tpopkontr
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr."TPopKontrBearb" = apflora.adresse."AdrId")
        INNER JOIN
          apflora.v_tpopkontr_maxanzahl
          ON apflora.v_tpopkontr_maxanzahl."TPopKontrId" = apflora.tpopkontr."TPopKontrId")
        LEFT JOIN
          ((apflora.tpopkontrzaehl
          LEFT JOIN
            apflora.tpopkontrzaehl_einheit_werte
            ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code)
          LEFT JOIN
            apflora.tpopkontrzaehl_methode_werte
            ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code)
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  -- keine Testarten
  apflora.ap."ApArtId" > 150
  AND apflora.ap."ApArtId" < 1000000
  -- nur Kontrollen, deren Teilpopulationen Koordinaten besitzen
  AND apflora.tpop."TPopXKoord" IS NOT NULL
  AND apflora.tpop."TPopYKoord" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" IN ('Ausgangszustand', 'Zwischenbeurteilung', 'Freiwilligen-Erfolgskontrolle')
  -- keine Ansaatversuche
  AND apflora.tpop."TPopHerkunft" <> 201
  -- nur wenn Kontrolljahr existiert
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  -- keine Kontrollen aus dem aktuellen Jahr - die wurden ev. noch nicht verifiziert
  AND apflora.tpopkontr."TPopKontrJahr" <> date_part('year', CURRENT_DATE)
  -- nur wenn erfasst ist, seit wann die TPop bekannt ist
  AND apflora.tpop."TPopBekanntSeit" IS NOT NULL
  AND (
    -- die Teilpopulation ist ursprünglich
    apflora.tpop."TPopHerkunft" IN (100, 101)
    -- oder bei Ansiedlungen: die Art war mindestens 5 Jahre vorhanden
    OR (apflora.tpopkontr."TPopKontrJahr" - apflora.tpop."TPopBekanntSeit") > 5
  )
  AND apflora.tpop."TPopFlurname" IS NOT NULL
  AND apflora.ap."ApGuid" IN (Select "idProjekt" FROM apflora.v_exportevab_projekt)
  AND apflora.pop."PopGuid" IN (SELECT "idRaum" FROM apflora.v_exportevab_raum)
  AND apflora.tpop."TPopGuid" IN (SELECT "idOrt" FROM apflora.v_exportevab_ort)
  AND apflora.tpopkontr."ZeitGuid" IN (SELECT "idZeitpunkt" FROM apflora.v_exportevab_zeit)
GROUP BY
  apflora.tpopkontr."ZeitGuid",
  apflora.tpopkontr."TPopId",
  apflora.tpopkontr."TPopKontrGuid",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.adresse."EvabIdPerson",
  apflora.ap."ApArtId",
  "fkAAINTRODUIT",
  apflora.v_tpopkontr_maxanzahl.anzahl,
  apflora.tpopkontr."TPopKontrGefaehrdung",
  apflora.tpopkontr."TPopKontrVitalitaet",
  apflora.tpop."TPopBeschr",
  "tblAdresse_2"."EvabIdPerson",
  "tblAdresse_2"."AdrName";

CREATE OR REPLACE FUNCTION apflora.qk2_tpop_ohne_tpopber(apid integer, berichtjahr integer)
  RETURNS table("ProjId" integer, "ApArtId" integer, hw text, url text[], text text[]) AS
  $$
  -- 3. "TPop ohne verlangten TPop-Bericht im Berichtjahr" ermitteln und in Qualitätskontrollen auflisten:
  SELECT DISTINCT
    apflora.ap."ProjId",
    apflora.pop."ApArtId",
    'Teilpopulation mit Kontrolle (im Berichtjahr) aber ohne Teilpopulations-Bericht (im Berichtjahr):' AS hw,
    ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url",
    ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
  FROM
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
  WHERE
    apflora.tpop."TPopApBerichtRelevant" = 1
    AND apflora.tpop."TPopId" IN (
      -- 1. "TPop mit Kontrolle im Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.tpopkontr."TPopId"
      FROM
        apflora.tpopkontr
      WHERE
        apflora.tpopkontr."TPopKontrTyp" NOT IN ('Zwischenziel', 'Ziel')
        AND apflora.tpopkontr."TPopKontrJahr" = $2
    )
    AND apflora.tpop."TPopId" NOT IN (
      -- 2. "TPop mit TPopBer im Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.tpop_id
      FROM
        apflora.tpopber
      WHERE
        apflora.tpopber.jahr = $2
    )
    AND apflora.pop."ApArtId" = $1
  $$
  LANGUAGE sql STABLE;
ALTER FUNCTION apflora.qk2_tpop_ohne_tpopber(apid integer, berichtjahr integer)
  OWNER TO postgres;

DROP TRIGGER IF EXISTS tpopber_on_update_set_mut ON apflora.tpopber;
DROP FUNCTION IF EXISTS tpopber_on_update_set_mut();
CREATE FUNCTION tpopber_on_update_set_mut() RETURNS trigger AS $tpopber_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$tpopber_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER tpopber_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.tpopber
  FOR EACH ROW EXECUTE PROCEDURE tpopber_on_update_set_mut();
