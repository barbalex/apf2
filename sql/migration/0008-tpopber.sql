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
-- done: run migration sql in dev
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

DROP VIEW IF EXISTS apflora.v_tpop_letztertpopber0 cascade;
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
        ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopber.jahr <= apflora._variable."JBerJahr"
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300;

DROP VIEW IF EXISTS apflora.v_pop_letztermassnber0 cascade;
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

DROP VIEW IF EXISTS apflora.v_pop_letztermassnber;
CREATE OR REPLACE VIEW apflora.v_pop_letztermassnber AS
SELECT
  apflora.v_pop_letztermassnber0."ApArtId",
  apflora.v_pop_letztermassnber0."PopId",
  max(apflora.v_pop_letztermassnber0."PopMassnBerJahr") AS "MaxvonPopMassnBerJahr"
FROM
  apflora.v_pop_letztermassnber0
GROUP BY
  apflora.v_pop_letztermassnber0."ApArtId",
  apflora.v_pop_letztermassnber0."PopId";

-- dieser view ist für die Qualitätskontrolle gedacht - daher letzter tpopber überhaupt
DROP VIEW IF EXISTS apflora.v_tpop_letztertpopber0_overall CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_letztertpopber0_overall AS
SELECT
  tpop_id AS "TPopId",
  max(jahr) AS "TPopBerJahr"
FROM
  apflora.tpopber
WHERE
  jahr IS NOT NULL
GROUP BY
  tpop_id;

DROP VIEW IF EXISTS apflora.v_tpopber_letzterber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopber_letzterber AS
SELECT
  apflora.tpopber.tpop_id AS "TPopId",
  max(apflora.tpopber.jahr) AS "MaxvonTPopBerJahr"
FROM
  apflora.tpopber
GROUP BY
  apflora.tpopber.tpop_id;

DROP VIEW IF EXISTS apflora.v_apber_b1rtpop;
CREATE OR REPLACE VIEW apflora.v_apber_b1rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpopber.tpop_id AS "TPopId"
FROM
  apflora._variable,
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      apflora.tpopber
      ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
  AND apflora.tpopber.jahr <= apflora._variable."JBerJahr"
  AND apflora.tpopber.entwicklung in (1, 2, 3, 4, 8)
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpopber.tpop_id;

DROP VIEW IF EXISTS apflora.v_apber_b1ltpop;
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
      ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b2ltpop;
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
      ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopber.entwicklung = 3
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b3ltpop;
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
      ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopber.entwicklung = 2
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b4ltpop;
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
      ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopber.entwicklung = 1
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b5ltpop;
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
      ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopber.entwicklung = 4
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b6ltpop;
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
      ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopber.entwicklung = 8
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_tpopber_letzteid cascade;
CREATE OR REPLACE VIEW apflora.v_tpopber_letzteid AS
SELECT
  apflora.tpopkontr."TPopId",
  (
    select id
    from apflora.tpopber
    where tpop_id = apflora.tpopkontr."TPopId"
    order by changed desc
    limit 1
  ) AS "MaxTPopBerId",
  max(apflora.tpopber.jahr) AS "MaxTPopBerJahr",
  count(apflora.tpopber.id) AS "AnzTPopBer"
FROM
  apflora.tpopkontr
  INNER JOIN
    apflora.tpopber
    ON apflora.tpopkontr."TPopId" = apflora.tpopber.tpop_id
WHERE
  apflora.tpopkontr."TPopKontrTyp" NOT IN ('Ziel', 'Zwischenziel')
  AND apflora.tpopber.jahr IS NOT NULL
GROUP BY
  apflora.tpopkontr."TPopId";

DROP VIEW IF EXISTS apflora.v_tpopber;
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
          ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
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
  INNER JOIN apflora.tpopber ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id
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

DROP VIEW IF EXISTS apflora.v_tpop_kontrjahrundberjahrundmassnjahr;
CREATE OR REPLACE VIEW apflora.v_tpop_kontrjahrundberjahrundmassnjahr AS
SELECT
  apflora.tpop."TPopId",
  apflora.tpopber.jahr AS "Jahr"
FROM
  apflora.tpop
  INNER JOIN apflora.tpopber ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id
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

DROP VIEW IF EXISTS apflora.v_qk2_tpopber_ohnejahr;
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
        ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopber.jahr IS NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopber.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_tpopber_ohneentwicklung;
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
        ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopber.entwicklung IS NULL
  AND apflora.tpopber.jahr IS NOT NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopber.jahr;
DROP VIEW IF EXISTS apflora.v_qk2_pop_mit_ber_zunehmend_ohne_tpopber_zunehmend;
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
      ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id
    WHERE
      apflora.tpopber.entwicklung = 3
      AND apflora.tpopber.jahr = apflora.popber."PopBerJahr"
  )
ORDER BY
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber."PopBerJahr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_mit_ber_abnehmend_ohne_tpopber_abnehmend;
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
      ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id
    WHERE
      apflora.tpopber.entwicklung = 1
      AND apflora.tpopber.jahr = apflora.popber."PopBerJahr"
  )
ORDER BY
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber."PopBerJahr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_mit_ber_erloschen_ohne_tpopber_erloschen;
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
      ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id
    WHERE
      apflora.tpopber.entwicklung = 8
      AND apflora.tpopber.jahr = apflora.popber."PopBerJahr"
  )
ORDER BY
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber."PopBerJahr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_mit_ber_erloschen_und_tpopber_nicht_erloschen;
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
      ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id
    WHERE
      apflora.tpopber.entwicklung < 8
      AND apflora.tpopber.jahr = apflora.popber."PopBerJahr"
  )
ORDER BY
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber."PopBerJahr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statusaktuellletztertpopbererloschen;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statusaktuellletztertpopbererloschen AS
WITH lasttpopber AS (
  SELECT DISTINCT ON (tpop_id)
    tpop_id,
    jahr,
    entwicklung
  FROM
    apflora.tpopber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    tpop_id,
    jahr DESC
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
        ON apflora.tpop."TPopId" = lasttpopber.tpop_id
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (100, 200, 210, 300)
  AND lasttpopber.entwicklung = 8
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
      AND apflora.tpopmassn.jahr > lasttpopber.jahr
  );


-- TODO

DROP VIEW IF EXISTS apflora.v_qk2_tpop_popnrtpopnrmehrdeutig CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_popnrtpopnrmehrdeutig AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Die TPop.-Nr. ist mehrdeutig:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.tpop."PopId" = apflora.pop."PopId"
      ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
    ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."PopId" IN (
    SELECT DISTINCT "PopId"
    FROM apflora.tpop
    GROUP BY "PopId", "TPopNr"
    HAVING COUNT(*) > 1
  ) AND
  apflora.tpop."TPopNr" IN (
    SELECT "TPopNr"
    FROM apflora.tpop
    GROUP BY "PopId", "TPopNr"
    HAVING COUNT(*) > 1
  )
ORDER BY
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_popnrmehrdeutig CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_popnrmehrdeutig AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Die Nr. ist mehrdeutig:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
    ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."ApArtId" IN (
    SELECT DISTINCT "ApArtId"
    FROM apflora.pop
    GROUP BY "ApArtId", "PopNr"
    HAVING COUNT(*) > 1
  ) AND
  apflora.pop."PopNr" IN (
    SELECT DISTINCT "PopNr"
    FROM apflora.pop
    GROUP BY "ApArtId", "PopNr"
    HAVING COUNT(*) > 1
  )
ORDER BY
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnekoord CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_ohnekoord AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population: Mindestens eine Koordinate fehlt:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.pop."PopXKoord" IS NULL
  OR apflora.pop."PopYKoord" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnepopnr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_ohnepopnr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population ohne Nr.:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Name): ', apflora.pop."PopName")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.pop."PopNr" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopName";

DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnepopname CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_ohnepopname AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population ohne Name:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population: ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.pop."PopName" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnepopstatus CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_ohnepopstatus AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population ohne Status:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.pop."PopHerkunft" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnebekanntseit CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_ohnebekanntseit AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population ohne "bekannt seit":'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.pop."PopBekanntSeit" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_mitstatusunklarohnebegruendung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_mitstatusunklarohnebegruendung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population mit "Status unklar", ohne Begruendung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.pop."PopHerkunftUnklar" = 1
  AND apflora.pop."PopHerkunftUnklarBegruendung" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnetpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_ohnetpop AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population ohne Teilpopulation:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    LEFT JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopId" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohnenr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_ohnenr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation ohne Nr.:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopNr" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohneflurname CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_ohneflurname AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation ohne Flurname:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopFlurname" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohnestatus CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_ohnestatus AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation ohne Status:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopHerkunft" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohnebekanntseit CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_ohnebekanntseit AS
SELECT
  apflora.ap."ApArtId",
  'Teilpopulation ohne "bekannt seit":'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopBekanntSeit" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohneapberrelevant CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_ohneapberrelevant AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation ohne "Fuer AP-Bericht relevant":'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopApBerichtRelevant" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuspotentiellfuerapberrelevant CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuspotentiellfuerapberrelevant AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation mit Status "potenzieller Wuchs-/Ansiedlungsort" und "Fuer AP-Bericht relevant?" = ja:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopHerkunft" = 300
  AND apflora.tpop."TPopApBerichtRelevant" = 1
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_mitstatusunklarohnebegruendung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_mitstatusunklarohnebegruendung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation mit "Status unklar", ohne Begruendung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopHerkunftUnklar" = 1
  AND apflora.tpop."TPopHerkunftUnklarBegruendung" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohnekoordinaten CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_ohnekoordinaten AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Mindestens eine Koordinate fehlt:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopXKoord" IS NULL
  OR apflora.tpop."TPopYKoord" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_massn_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_massn_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Massnahme ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Massnahmen', apflora.tpopmassn.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Massnahme: ', apflora.tpopmassn.jahr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopmassn.jahr IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassn.id;

DROP VIEW IF EXISTS apflora.v_qk2_massn_ohnebearb CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_massn_ohnebearb AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Massnahme ohne BearbeiterIn:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Massnahmen', apflora.tpopmassn.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Massnahme (id): ', apflora.tpopmassn.id)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopmassn.bearbeiter IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassn.id;

DROP VIEW IF EXISTS apflora.v_qk2_massn_ohnetyp CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_massn_ohnetyp AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Massnahmen ohne Typ:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Massnahmen', apflora.tpopmassn.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Massnahme (Jahr): ', apflora.tpopmassn.jahr)]::text[] AS text,
  apflora.tpopmassn.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopmassn.typ IS NULL
  AND apflora.tpopmassn.jahr IS NOT NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassn.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_massnber_ohnejahr CASCADE;
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

DROP VIEW IF EXISTS apflora.v_qk2_massnber_ohneerfbeurt CASCADE;
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

DROP VIEW IF EXISTS apflora.v_qk2_feldkontr_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontr_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Feldkontrolle ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr."TPopKontrId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr."TPopKontrJahr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontr."TPopKontrJahr" IS NULL
  AND apflora.tpopkontr."TPopKontrTyp" <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

DROP VIEW IF EXISTS apflora.v_qk2_feldkontr_ohnebearb CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontr_ohnebearb AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Feldkontrolle ohne BearbeiterIn:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr."TPopKontrId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Kontrolle (id): ', apflora.tpopkontr."TPopKontrId")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontr."TPopKontrBearb" IS NULL
  AND apflora.tpopkontr."TPopKontrTyp" <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrId";

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontr_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontr_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Freiwilligen-Kontrolle ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Freiwilligen-Kontrollen', apflora.tpopkontr."TPopKontrId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (id): ', apflora.tpopkontr."TPopKontrId")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontr."TPopKontrJahr" IS NULL
  AND apflora.tpopkontr."TPopKontrTyp" = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontr_ohnebearb CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontr_ohnebearb AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Freiwilligen-Kontrolle ohne BearbeiterIn:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Freiwilligen-Kontrollen', apflora.tpopkontr."TPopKontrId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (id): ', apflora.tpopkontr."TPopKontrId")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontr."TPopKontrBearb" IS NULL
  AND apflora.tpopkontr."TPopKontrTyp" = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrBearb";

DROP VIEW IF EXISTS apflora.v_qk2_feldkontr_ohnetyp CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontr_ohnetyp AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Feldkontrolle ohne Typ:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr."TPopKontrId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr."TPopKontrJahr")]::text[] AS text,
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  (
    apflora.tpopkontr."TPopKontrTyp" IS NULL
    OR apflora.tpopkontr."TPopKontrTyp" = 'Erfolgskontrolle'
  )
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

DROP VIEW IF EXISTS apflora.v_qk2_feldkontr_ohnezaehlung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontr_ohnezaehlung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Feldkontrolle ohne Zaehlung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr."TPopKontrId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr."TPopKontrJahr")]::text[] AS text,
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        LEFT JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopkontr."TPopKontrId",
  apflora.tpopkontrzaehl.id
HAVING
  apflora.tpopkontrzaehl.id IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontr_ohnezaehlung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontr_ohnezaehlung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Freiwilligen-Kontrolle ohne Zaehlung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Freiwilligen-Kontrollen', apflora.tpopkontr."TPopKontrId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr."TPopKontrJahr")]::text[] AS text,
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        LEFT JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopkontr."TPopKontrId",
  apflora.tpopkontrzaehl.id
HAVING
  apflora.tpopkontrzaehl.id IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

DROP VIEW IF EXISTS apflora.v_qk2_feldkontrzaehlung_ohneeinheit CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontrzaehlung_ohneeinheit AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Zaehleinheit (Feldkontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr."TPopKontrId", 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr."TPopKontrJahr"), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        INNER JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.einheit IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontrzaehlung_ohneeinheit CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontrzaehlung_ohneeinheit AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Zaehleinheit (Freiwilligen-Kontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Freiwilligen-Kontrollen', apflora.tpopkontr."TPopKontrId", 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr."TPopKontrJahr"), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        INNER JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.einheit IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

DROP VIEW IF EXISTS apflora.v_qk2_feldkontrzaehlung_ohnemethode CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontrzaehlung_ohnemethode AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Methode (Feldkontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr."TPopKontrId", 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr."TPopKontrJahr"), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        INNER JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.methode IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontrzaehlung_ohnemethode CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontrzaehlung_ohnemethode AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Methode (Freiwilligen-Kontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Freiwilligen-Kontrollen', apflora.tpopkontr."TPopKontrId", 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr."TPopKontrJahr"), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        INNER JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.methode IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

DROP VIEW IF EXISTS apflora.v_qk2_feldkontrzaehlung_ohneanzahl CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontrzaehlung_ohneanzahl AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Anzahl (Feldkontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr."TPopKontrId", 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr."TPopKontrJahr"), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        INNER JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.anzahl IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontrzaehlung_ohneanzahl CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontrzaehlung_ohneanzahl AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Anzahl (Freiwilligen-Kontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Freiwilligen-Kontrollen', apflora.tpopkontr."TPopKontrId", 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr."TPopKontrJahr"), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        INNER JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.anzahl IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

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
        ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
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
        ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopber.entwicklung IS NULL
  AND apflora.tpopber.jahr IS NOT NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopber.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_popber_ohneentwicklung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_popber_ohneentwicklung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Populations-Bericht ohne Entwicklung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Kontroll-Berichte', apflora.popber."PopBerId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Populations-Bericht (Jahr): ', apflora.popber."PopBerJahr")]::text[] AS text,
  apflora.popber."PopBerJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    INNER JOIN
      apflora.popber
      ON apflora.pop."PopId" = apflora.popber."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.popber."PopBerEntwicklung" IS NULL
  AND apflora.popber."PopBerJahr" IS NOT NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.popber."PopBerJahr";

DROP VIEW IF EXISTS apflora.v_qk2_popber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_popber_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Populations-Bericht ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Kontroll-Berichte', apflora.popber."PopBerId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Populations-Bericht (Jahr): ', apflora.popber."PopBerJahr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    INNER JOIN
      apflora.popber
      ON apflora.pop."PopId" = apflora.popber."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.popber."PopBerJahr" IS NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.popber."PopBerJahr";

DROP VIEW IF EXISTS apflora.v_qk2_popmassnber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_popmassnber_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Populations-Massnahmen-Bericht ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Massnahmen-Berichte', apflora.popmassnber."PopMassnBerId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Populations-Massnahmen-Bericht (Jahr): ', apflora.popmassnber."PopMassnBerJahr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    INNER JOIN
      apflora.popmassnber
      ON apflora.pop."PopId" = apflora.popmassnber."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.popmassnber."PopMassnBerJahr" IS NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.popmassnber."PopMassnBerJahr";

DROP VIEW IF EXISTS apflora.v_qk2_popmassnber_ohneentwicklung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_popmassnber_ohneentwicklung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Populations-Massnahmen-Bericht ohne Entwicklung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Massnahmen-Berichte', apflora.popmassnber."PopMassnBerId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Populations-Massnahmen-Bericht (Jahr): ', apflora.popmassnber."PopMassnBerJahr")]::text[] AS text,
  apflora.popmassnber."PopMassnBerJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    INNER JOIN
      apflora.popmassnber
      ON apflora.pop."PopId" = apflora.popmassnber."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.popmassnber."PopMassnBerErfolgsbeurteilung" IS NULL
  AND apflora.popmassnber."PopMassnBerJahr" IS NOT NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.popmassnber."PopMassnBerJahr";

DROP VIEW IF EXISTS apflora.v_qk2_zielber_ohneentwicklung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_zielber_ohneentwicklung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Ziel-Bericht ohne Entwicklung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Ziele', apflora.ziel."ZielId", 'Berichte', apflora.zielber."ZielBerId"]::text[] AS url,
  ARRAY[concat('Ziel (Jahr): ', apflora.ziel."ZielJahr"), concat('Ziel-Bericht (Jahr): ', apflora.zielber."ZielBerJahr")]::text[] AS text,
  apflora.zielber."ZielBerJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    apflora.ziel
    INNER JOIN
      apflora.zielber
      ON apflora.ziel."ZielId" = apflora.zielber."ZielId"
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId"
WHERE
  apflora.zielber."ZielBerErreichung" IS NULL
  AND apflora.zielber."ZielBerJahr" IS NOT NULL
ORDER BY
  apflora.ziel."ZielJahr",
  apflora.ziel."ZielId",
  apflora.zielber."ZielBerJahr";

DROP VIEW IF EXISTS apflora.v_qk2_zielber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_zielber_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Ziel-Bericht ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Ziele', apflora.ziel."ZielId", 'Berichte', apflora.zielber."ZielBerId"]::text[] AS url,
  ARRAY[concat('Ziel (Jahr): ', apflora.ziel."ZielJahr"), concat('Ziel-Bericht (Jahr): ', apflora.zielber."ZielBerJahr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.ziel
    INNER JOIN
      apflora.zielber
      ON apflora.ziel."ZielId" = apflora.zielber."ZielId")
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId"
WHERE
  apflora.zielber."ZielBerJahr" IS NULL
ORDER BY
  apflora.ziel."ZielJahr",
  apflora.ziel."ZielId",
  apflora.zielber."ZielBerJahr";

DROP VIEW IF EXISTS apflora.v_qk2_ziel_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_ziel_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Ziel ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Ziele', apflora.ziel."ZielId"]::text[] AS url,
  ARRAY[concat('Ziel (id): ', apflora.ziel."ZielId")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId"
WHERE
  apflora.ziel."ZielJahr" IS NULL
  OR apflora.ziel."ZielJahr" = 1
ORDER BY
  apflora.ziel."ZielId";

DROP VIEW IF EXISTS apflora.v_qk2_ziel_ohnetyp CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_ziel_ohnetyp AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Ziel ohne Typ:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Ziele', apflora.ziel."ZielId"]::text[] AS url,
  ARRAY[concat('Ziel (Jahr): ', apflora.ziel."ZielJahr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId"
WHERE
  apflora.ziel."ZielTyp" IS NULL
ORDER BY
  apflora.ziel."ZielJahr";

DROP VIEW IF EXISTS apflora.v_qk2_ziel_ohneziel CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_ziel_ohneziel AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Ziel ohne Ziel:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Ziele', apflora.ziel."ZielId"]::text[] AS url,
  ARRAY[concat('Ziel (Jahr): ', apflora.ziel."ZielJahr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId"
WHERE
  apflora.ziel."ZielBezeichnung" IS NULL
ORDER BY
  apflora.ziel."ZielJahr";

DROP VIEW IF EXISTS apflora.v_qk2_erfkrit_ohnebeurteilung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_erfkrit_ohnebeurteilung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Erfolgskriterium ohne Beurteilung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Erfolgskriterien', apflora.erfkrit."ErfkritId"]::text[] AS url,
  ARRAY[concat('Erfolgskriterium (id): ', apflora.erfkrit."ErfkritId")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.erfkrit
    ON apflora.ap."ApArtId" = apflora.erfkrit."ApArtId"
WHERE
  apflora.erfkrit."ErfkritErreichungsgrad" IS NULL
ORDER BY
  apflora.erfkrit."ErfkritId";

DROP VIEW IF EXISTS apflora.v_qk2_erfkrit_ohnekriterien CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_erfkrit_ohnekriterien AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Erfolgskriterium ohne Kriterien:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Erfolgskriterien', apflora.erfkrit."ErfkritId"]::text[] AS url,
  ARRAY[concat('Erfolgskriterium (id): ', apflora.erfkrit."ErfkritId")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.erfkrit
    ON apflora.ap."ApArtId" = apflora.erfkrit."ApArtId"
WHERE
  apflora.erfkrit."ErfkritTxt" IS NULL
ORDER BY
  apflora.erfkrit."ErfkritId";

DROP VIEW IF EXISTS apflora.v_qk2_apber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_apber_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'AP-Bericht ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'AP-Berichte', apflora.apber."JBerId"]::text[] AS url,
  ARRAY[concat('AP-Bericht (id): ', apflora.apber."JBerId")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.apber
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.apber."JBerId"
HAVING
  apflora.apber."JBerJahr" IS NULL
ORDER BY
  apflora.apber."JBerId";

DROP VIEW IF EXISTS apflora.v_qk2_apber_ohnevergleichvorjahrgesamtziel CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_apber_ohnevergleichvorjahrgesamtziel AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'AP-Bericht ohne Vergleich Vorjahr - Gesamtziel:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'AP-Berichte', apflora.apber."JBerId"]::text[] AS url,
  ARRAY[concat('AP-Bericht (Jahr): ', apflora.apber."JBerJahr")]::text[] AS text,
  apflora.apber."JBerJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    apflora.apber
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId"
WHERE
  apflora.apber."JBerVergleichVorjahrGesamtziel" IS NULL
  AND apflora.apber."JBerJahr" IS NOT NULL
ORDER BY
  apflora.apber."JBerJahr";

DROP VIEW IF EXISTS apflora.v_qk2_apber_ohnebeurteilung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_apber_ohnebeurteilung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'AP-Bericht ohne Beurteilung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'AP-Berichte', apflora.apber."JBerId"]::text[] AS url,
  ARRAY[concat('AP-Bericht (Jahr): ', apflora.apber."JBerJahr")]::text[] AS text,
  apflora.apber."JBerJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    apflora.apber
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId"
WHERE
  apflora.apber."JBerBeurteilung" IS NULL
  AND apflora.apber."JBerJahr" IS NOT NULL
ORDER BY
  apflora.apber."JBerJahr";

DROP VIEW IF EXISTS apflora.v_qk2_assozart_ohneart CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_assozart_ohneart AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Assoziierte Art ohne Art:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'assoziierte-Arten', apflora.assozart."AaId"]::text[] AS url,
  ARRAY[concat('Assoziierte Art (id): ', apflora.assozart."AaId")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.assozart
    ON apflora.ap."ApArtId" = apflora.assozart."AaApArtId"
WHERE
  apflora.assozart."AaSisfNr" IS NULL
  OR apflora.assozart."AaSisfNr" = 0
ORDER BY
  apflora.assozart."AaId";

DROP VIEW IF EXISTS apflora.v_qk2_pop_koordentsprechenkeinertpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_koordentsprechenkeinertpop AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Koordinaten entsprechen keiner Teilpopulation:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr): ', apflora.pop."PopNr")]::text[] AS text,
  apflora.pop."PopXKoord" AS "XKoord",
  apflora.pop."PopYKoord" AS "YKoord"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopXKoord" Is NOT Null
  AND apflora.pop."PopYKoord" IS NOT NULL
  AND apflora.pop."PopId" NOT IN (
    SELECT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopXKoord" = "PopXKoord"
      AND apflora.tpop."TPopYKoord" = "PopYKoord"
  )
  ORDER BY
    apflora.ap."ProjId",
    apflora.pop."ApArtId";

DROP VIEW IF EXISTS apflora.v_qk2_pop_statusansaatversuchmitaktuellentpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statusansaatversuchmitaktuellentpop AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "angesiedelt, Ansaatversuch", es gibt aber eine aktuelle Teilpopulation oder eine ursprüngliche erloschene:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" = 201
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" IN (100, 101, 200, 210)
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statusansaatversuchalletpoperloschen CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statusansaatversuchalletpoperloschen AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "angesiedelt, Ansaatversuch", alle Teilpopulationen sind gemäss Status erloschen:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
    INNER JOIN apflora.pop
      INNER JOIN apflora.tpop
      ON apflora.tpop."PopId" = apflora.pop."PopId"
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" = 201
  AND EXISTS (
    SELECT
      1
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" IN (101, 202, 211)
      AND apflora.tpop."PopId" = apflora.pop."PopId"
  )
  AND NOT EXISTS (
    SELECT
      1
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" NOT IN (101, 202, 211)
      AND apflora.tpop."PopId" = apflora.pop."PopId"
  );

  DROP VIEW IF EXISTS apflora.v_qk2_pop_statusansaatversuchmittpopursprerloschen CASCADE;
  CREATE OR REPLACE VIEW apflora.v_qk2_pop_statusansaatversuchmittpopursprerloschen AS
  SELECT DISTINCT
    apflora.ap."ProjId",
    apflora.pop."ApArtId",
    'Population: Status ist "angesiedelt, Ansaatversuch", es gibt aber eine Teilpopulation mit Status "urspruenglich, erloschen":'::text AS hw,
    ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr): ', apflora.pop."PopNr")]::text[] AS text
  FROM
    apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
  WHERE
    apflora.pop."PopHerkunft" = 201
    AND apflora.pop."PopId" IN (
      SELECT DISTINCT
        apflora.tpop."PopId"
      FROM
        apflora.tpop
      WHERE
        apflora.tpop."TPopHerkunft" = 101
    );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenmittpopaktuell CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenmittpopaktuell AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "erloschen" (urspruenglich oder angesiedelt), es gibt aber eine Teilpopulation mit Status "aktuell" (urspruenglich oder angesiedelt):'::text AS hw,
    ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" IN (101, 202, 211)
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" IN (100, 200, 210)
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenmittpopansaatversuch CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenmittpopansaatversuch AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "erloschen" (urspruenglich oder angesiedelt), es gibt aber eine Teilpopulation mit Status "angesiedelt, Ansaatversuch":'::text AS hw,
    ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" IN (101, 202, 211)
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" = 201
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statusangesiedeltmittpopurspruenglich CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statusangesiedeltmittpopurspruenglich AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "angesiedelt", es gibt aber eine Teilpopulation mit Status "urspruenglich":'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" IN (200, 201, 202, 210, 211)
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" = 100
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuspotwuchsortmittpopanders CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuspotwuchsortmittpopanders AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "potenzieller Wuchs-/Ansiedlungsort", es gibt aber eine Teilpopulation mit Status "angesiedelt" oder "urspruenglich":'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" = 300
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" < 300
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_mitstatusansaatversuchundzaehlungmitanzahl CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_mitstatusansaatversuchundzaehlungmitanzahl AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  'Teilpopulation mit Status "Ansaatversuch", bei denen in der letzten Kontrolle eine Anzahl festgestellt wurde:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.tpop."PopId" = apflora.pop."PopId"
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.tpop."TPopHerkunft" = 201
  AND apflora.tpop."TPopId" IN (
    SELECT DISTINCT
      apflora.tpopkontr."TPopId"
    FROM
      (apflora.tpopkontr
      INNER JOIN
        apflora.tpopkontrzaehl
        ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
      INNER JOIN
        apflora.v_tpopkontr_letzteid
        ON
          (
            apflora.v_tpopkontr_letzteid."TPopId" = apflora.tpopkontr."TPopId"
            AND apflora.v_tpopkontr_letzteid."MaxTPopKontrId" = apflora.tpopkontr."TPopKontrId"
          )
    WHERE
      apflora.tpopkontr."TPopKontrTyp" NOT IN ('Zwischenziel', 'Ziel')
      AND apflora.tpopkontrzaehl.anzahl > 0
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_mitstatuspotentiellundzaehlungmitanzahl CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_mitstatuspotentiellundzaehlungmitanzahl AS
SELECT DISTINCT
  apflora.projekt."ProjId",
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  'Teilpopulation mit Status "potentieller Wuchs-/Ansiedlungsort", bei denen in einer Kontrolle eine Anzahl festgestellt wurde:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.tpop."PopId" = apflora.pop."PopId"
      ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
    ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" = 300
  AND apflora.tpop."TPopId" IN (
    SELECT DISTINCT
      apflora.tpopkontr."TPopId"
    FROM
      apflora.tpopkontr
      INNER JOIN
        apflora.tpopkontrzaehl
        ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id
    WHERE
      apflora.tpopkontr."TPopKontrTyp" NOT IN ('Zwischenziel', 'Ziel')
      AND apflora.tpopkontrzaehl.anzahl > 0
  )
ORDER BY
  apflora.pop."PopId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_mitstatuspotentiellundmassnansiedlung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_mitstatuspotentiellundmassnansiedlung AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  'Teilpopulation mit Status "potentieller Wuchs-/Ansiedlungsort", bei der eine Massnahme des Typs "Ansiedlung" existiert:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.tpop."PopId" = apflora.pop."PopId"
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.tpop."TPopHerkunft" = 300
  AND apflora.tpop."TPopId" IN (
    SELECT DISTINCT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.typ < 4
  );

-- wozu wird das benutzt?
DROP VIEW IF EXISTS apflora.v_qk_tpop_mitstatusaktuellundtpopbererloschen_maxtpopberjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_tpop_mitstatusaktuellundtpopbererloschen_maxtpopberjahr AS
SELECT
  apflora.tpopber.tpop_id,
  max(apflora.tpopber.jahr) AS "MaxTPopBerJahr"
FROM
  apflora.tpopber
GROUP BY
  apflora.tpopber.tpop_id;

DROP VIEW IF EXISTS apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr AS
SELECT
 apflora.beobzuordnung."TPopId",
  max(
    date_part('year', apflora.beob."Datum")
  ) AS "MaxJahr"
FROM
  apflora.beobzuordnung
INNER JOIN
  apflora.beob
  ON apflora.beobzuordnung."BeobId" = apflora.beob.id
WHERE
  apflora.beob."Datum" IS NOT NULL AND
  apflora.beobzuordnung."TPopId" IS NOT NULL
GROUP BY
  apflora.beobzuordnung."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_pop_uebersicht CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_pop_uebersicht AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  apflora.adb_eigenschaften."Artname" AS "Art",
  (
    SELECT
      COUNT(*)
    FROM
      apflora.pop
    WHERE
      apflora.pop."ApArtId" = apflora.adb_eigenschaften."TaxonomieId"
      AND apflora.pop."PopHerkunft" IN (100)
      AND apflora.pop."PopId" IN(
        SELECT
          apflora.tpop."PopId"
        FROM
          apflora.tpop
        WHERE
          apflora.tpop."TPopApBerichtRelevant" = 1
      )
  ) AS "aktuellUrspruenglich",
  (
    SELECT
      COUNT(*)
    FROM
      apflora.pop
    WHERE
      apflora.pop."ApArtId" = apflora.adb_eigenschaften."TaxonomieId"
      AND apflora.pop."PopHerkunft" IN (200, 210)
      AND apflora.pop."PopId" IN(
        SELECT
          apflora.tpop."PopId"
        FROM
          apflora.tpop
        WHERE
          apflora.tpop."TPopApBerichtRelevant" = 1
      )
  ) AS "aktuellAngesiedelt",
  (
    SELECT
      COUNT(*)
    FROM
      apflora.pop
    WHERE
      apflora.pop."ApArtId" = apflora.adb_eigenschaften."TaxonomieId"
      AND apflora.pop."PopHerkunft" IN (100, 200, 210)
      AND apflora.pop."PopId" IN(
        SELECT
          apflora.tpop."PopId"
        FROM
          apflora.tpop
        WHERE
          apflora.tpop."TPopApBerichtRelevant" = 1
      )
  ) AS "aktuell"
FROM
  apflora.adb_eigenschaften
  INNER JOIN
    (apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
GROUP BY
  apflora.adb_eigenschaften."TaxonomieId",
  apflora.adb_eigenschaften."Artname"
ORDER BY
  apflora.adb_eigenschaften."Artname";

-- new views beginning 2017.10.04
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
      ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id
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
      ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id
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
      ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id
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
      ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id
    WHERE
      apflora.tpopber.entwicklung < 8
      AND apflora.tpopber.jahr = apflora.popber."PopBerJahr"
  )
ORDER BY
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber."PopBerJahr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statusaktuellletztertpopbererloschen;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statusaktuellletztertpopbererloschen AS
WITH lasttpopber AS (
  SELECT DISTINCT ON (tpop_id)
    tpop_id,
    jahr,
    entwicklung
  FROM
    apflora.tpopber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    tpop_id,
    jahr DESC
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
        ON apflora.tpop."TPopId" = lasttpopber.tpop_id
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (100, 200, 210, 300)
  AND lasttpopber.entwicklung = 8
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
      AND apflora.tpopmassn.jahr > lasttpopber.jahr
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statusaktuellletzterpopbererloschen CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statusaktuellletzterpopbererloschen AS
WITH lastpopber AS (
  SELECT DISTINCT ON ("PopId")
    "PopId",
    "PopBerJahr",
    "PopBerEntwicklung"
  FROM
    apflora.popber
  WHERE
    "PopBerJahr" IS NOT NULL
  ORDER BY
    "PopId",
    "PopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "aktuell" (ursprünglich oder angesiedelt) oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "erloschen" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN lastpopber
      ON apflora.pop."PopId" = lastpopber."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" IN (100, 200, 210, 300)
  AND lastpopber."PopBerEntwicklung" = 8
  AND apflora.pop."PopId" NOT IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr > lastpopber."PopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopberzunehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletztertpopberzunehmend AS
WITH lasttpopber AS (
  SELECT DISTINCT ON (tpop_id)
    tpop_id,
    jahr,
    entwicklung
  FROM
    apflora.tpopber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    tpop_id,
    jahr DESC
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
        ON apflora.tpop."TPopId" = lasttpopber.tpop_id
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 201, 202, 211, 300)
  AND lasttpopber.entwicklung = 3
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
      AND apflora.tpopmassn.jahr > lasttpopber.jahr
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopberzunehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenletzterpopberzunehmend AS
WITH lastpopber AS (
  SELECT DISTINCT ON ("PopId")
    "PopId",
    "PopBerJahr",
    "PopBerEntwicklung"
  FROM
    apflora.popber
  WHERE
    "PopBerJahr" IS NOT NULL
  ORDER BY
    "PopId",
    "PopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "zunehmend" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN lastpopber
      ON apflora.pop."PopId" = lastpopber."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" IN (101, 201, 202, 211, 300)
  AND lastpopber."PopBerEntwicklung" = 3
  AND apflora.pop."PopId" NOT IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr > lastpopber."PopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopberstabil CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletztertpopberstabil AS
WITH lasttpopber AS (
  SELECT DISTINCT ON (tpop_id)
    tpop_id,
    jahr,
    entwicklung
  FROM
    apflora.tpopber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    tpop_id,
    jahr DESC
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
        ON apflora.tpop."TPopId" = lasttpopber.tpop_id
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 201, 202, 211, 300)
  AND lasttpopber.entwicklung = 2
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
      AND apflora.tpopmassn.jahr > lasttpopber.jahr
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopberstabil CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenletzterpopberstabil AS
WITH lastpopber AS (
  SELECT DISTINCT ON ("PopId")
    "PopId",
    "PopBerJahr",
    "PopBerEntwicklung"
  FROM
    apflora.popber
  WHERE
    "PopBerJahr" IS NOT NULL
  ORDER BY
    "PopId",
    "PopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "stabil" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN lastpopber
      ON apflora.pop."PopId" = lastpopber."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" IN (101, 201, 202, 211, 300)
  AND lastpopber."PopBerEntwicklung" = 2
  AND apflora.pop."PopId" NOT IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr > lastpopber."PopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopberabnehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletztertpopberabnehmend AS
WITH lasttpopber AS (
  SELECT DISTINCT ON (tpop_id)
    tpop_id,
    jahr,
    entwicklung
  FROM
    apflora.tpopber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    tpop_id,
    jahr DESC
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
        ON apflora.tpop."TPopId" = lasttpopber.tpop_id
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 201, 202, 211, 300)
  AND lasttpopber.entwicklung = 1
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
      AND apflora.tpopmassn.jahr > lasttpopber.jahr
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopberabnehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenletzterpopberabnehmend AS
WITH lastpopber AS (
  SELECT DISTINCT ON ("PopId")
    "PopId",
    "PopBerJahr",
    "PopBerEntwicklung"
  FROM
    apflora.popber
  WHERE
    "PopBerJahr" IS NOT NULL
  ORDER BY
    "PopId",
    "PopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "abnehmend" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN lastpopber
      ON apflora.pop."PopId" = lastpopber."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" IN (101, 201, 202, 211, 300)
  AND lastpopber."PopBerEntwicklung" = 1
  AND apflora.pop."PopId" NOT IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr > lastpopber."PopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopberunsicher CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletztertpopberunsicher AS
WITH lasttpopber AS (
  SELECT DISTINCT ON (tpop_id)
    tpop_id,
    jahr,
    entwicklung
  FROM
    apflora.tpopber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    tpop_id,
    jahr DESC
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
        ON apflora.tpop."TPopId" = lasttpopber.tpop_id
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 202, 211, 300)
  AND lasttpopber.entwicklung = 4
  AND apflora.tpop."TPopId" NOT IN (
    -- Ansiedlungen since jahr
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop."TPopId"
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > lasttpopber.jahr
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopberunsicher CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenletzterpopberunsicher AS
WITH lastpopber AS (
  SELECT DISTINCT ON ("PopId")
    "PopId",
    "PopBerJahr",
    "PopBerEntwicklung"
  FROM
    apflora.popber
  WHERE
    "PopBerJahr" IS NOT NULL
  ORDER BY
    "PopId",
    "PopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "erloschen" (ursprünglich oder angesiedelt) oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "unsicher" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN lastpopber
      ON apflora.pop."PopId" = lastpopber."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" IN (101, 202, 211, 300)
  AND lastpopber."PopBerEntwicklung" = 4
  AND apflora.pop."PopId" NOT IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr > lastpopber."PopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnetpopmitgleichemstatus CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_ohnetpopmitgleichemstatus AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Keine Teil-Population hat den Status der Population:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  --why was this here? deactivated 2017-11-03
  --apflora.pop."PopHerkunft" = 210
  apflora.pop."PopId" NOT IN (
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."PopId" = apflora.pop."PopId"
      AND (
          apflora.tpop."TPopHerkunft" = apflora.pop."PopHerkunft"
          -- problem: the values for erloschen and aktuell can vary
          -- depending on bekannt seit
          -- even though they are same value in status field of form
          OR (apflora.tpop."TPopHerkunft" = 200 AND apflora.pop."PopHerkunft" = 210)
          OR (apflora.tpop."TPopHerkunft" = 210 AND apflora.pop."PopHerkunft" = 200)
          OR (apflora.tpop."TPopHerkunft" = 202 AND apflora.pop."PopHerkunft" = 211)
          OR (apflora.tpop."TPopHerkunft" = 211 AND apflora.pop."PopHerkunft" = 202)
      )
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_status300tpopstatusanders CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_status300tpopstatusanders AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "potentieller Wuchs-/Ansiedlungsort". Es gibt aber Teil-Populationen mit abweichendem Status:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" = 300
  AND apflora.pop."PopId" IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."PopId" = apflora.pop."PopId"
      AND apflora.tpop."TPopHerkunft" <> 300
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_status201tpopstatusunzulaessig CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_status201tpopstatusunzulaessig AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "Ansaatversuch". Es gibt Teil-Populationen mit nicht zulässigen Stati ("ursprünglich" oder "angesiedelt, aktuell"):'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" = 201
  AND apflora.pop."PopId" IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."PopId" = apflora.pop."PopId"
      AND apflora.tpop."TPopHerkunft" IN (100, 101, 200, 210)
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_status202tpopstatusanders CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_status202tpopstatusanders AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "angesiedelt nach Beginn AP, erloschen/nicht etabliert". Es gibt Teil-Populationen mit abweichendem Status:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" = 202
  AND apflora.pop."PopId" IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."PopId" = apflora.pop."PopId"
      AND apflora.tpop."TPopHerkunft" <> 202
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_status211tpopstatusunzulaessig CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_status211tpopstatusunzulaessig AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "angesiedelt vor Beginn AP, erloschen/nicht etabliert". Es gibt Teil-Populationen mit nicht zulässigen Stati ("ursprünglich", "angesiedelt, aktuell", "Ansaatversuch", "potentieller Wuchsort"):'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" = 211
  AND apflora.pop."PopId" IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."PopId" = apflora.pop."PopId"
      AND apflora.tpop."TPopHerkunft" IN (100, 101, 210, 200, 201, 300)
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_status200tpopstatusunzulaessig CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_status200tpopstatusunzulaessig AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "angesiedelt nach Beginn AP, aktuell". Es gibt Teil-Populationen mit nicht zulässigen Stati ("ursprünglich", "angesiedelt vor Beginn AP, aktuell"):'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" = 200
  AND apflora.pop."PopId" IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."PopId" = apflora.pop."PopId"
      AND apflora.tpop."TPopHerkunft" IN (100, 101, 210)
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_status210tpopstatusunzulaessig CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_status210tpopstatusunzulaessig AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "angesiedelt vor Beginn AP, aktuell". Es gibt Teil-Populationen mit nicht zulässigen Stati ("ursprünglich"):'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" = 210
  AND apflora.pop."PopId" IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."PopId" = apflora.pop."PopId"
      AND apflora.tpop."TPopHerkunft" IN (100, 101)
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_status101tpopstatusanders CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_status101tpopstatusanders AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "ursprünglich, erloschen". Es gibt Teil-Populationen (ausser potentiellen Wuchs-/Ansiedlungsorten) mit abweichendem Status:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" = 101
  AND apflora.pop."PopId" IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."PopId" = apflora.pop."PopId"
      AND apflora.tpop."TPopHerkunft" NOT IN (101, 300)
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopbererloschenmitansiedlung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenletzterpopbererloschenmitansiedlung AS
WITH lastpopber AS (
  SELECT DISTINCT ON ("PopId")
    "PopId",
    "PopBerJahr",
    "PopBerEntwicklung"
  FROM
    apflora.popber
  WHERE
    "PopBerJahr" IS NOT NULL
  ORDER BY
    "PopId",
    "PopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "erloschen" (ursprünglich oder angesiedelt); der letzte Populations-Bericht meldet "erloschen". Seither gab es aber eine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN lastpopber
      ON apflora.pop."PopId" = lastpopber."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" IN (101, 202, 211)
  AND lastpopber."PopBerEntwicklung" = 8
  AND apflora.pop."PopId" IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr > lastpopber."PopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopbererloschenmitansiedlung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletztertpopbererloschenmitansiedlung AS
WITH lasttpopber AS (
  SELECT DISTINCT ON (tpop_id)
    tpop_id,
    jahr,
    entwicklung
  FROM
    apflora.tpopber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    tpop_id,
    jahr DESC
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
        ON apflora.tpop."TPopId" = lasttpopber.tpop_id
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 202, 211)
  AND lasttpopber.entwicklung = 8
  AND apflora.tpop."TPopId" IN (
    -- Ansiedlungen since apflora.tpopber.jahr
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop."TPopId"
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > lasttpopber.jahr
  );

DROP VIEW IF EXISTS apflora.v_tpop_statuswidersprichtbericht;
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
            (apflora.tpopber.tpop_id = apflora.v_tpopber_letzterber."TPopId")
            AND (apflora.tpopber.jahr = apflora.v_tpopber_letzterber."MaxvonTPopBerJahr"))
        ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
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

DROP VIEW IF EXISTS apflora.v_qk2_tpop_erloschenundrelevantaberletztebeobvor1950;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_erloschenundrelevantaberletztebeobvor1950 AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'erloschene Teilpopulation "Fuer AP-Bericht relevant" aber letzte Beobachtung vor 1950:' AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 202, 211)
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.tpop."TPopId" NOT IN (
    SELECT DISTINCT
      apflora.tpopkontr."TPopId"
    FROM
      apflora.tpopkontr
      INNER JOIN
        apflora.tpopkontrzaehl
        ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id
    WHERE
      apflora.tpopkontr."TPopKontrTyp" NOT IN ('Zwischenziel', 'Ziel')
      AND apflora.tpopkontrzaehl.anzahl > 0
  )
  AND apflora.tpop."TPopId" IN (
    SELECT apflora.beobzuordnung."TPopId"
    FROM
      apflora.beobzuordnung
      INNER JOIN
        apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr
        ON apflora.beobzuordnung."TPopId" = apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr."TPopId"
    WHERE
      apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr."MaxJahr" < 1950
  )
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_tpop_letztertpopber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_letztertpopber AS
SELECT
  apflora.v_tpop_letztertpopber0."ApArtId",
  apflora.v_tpop_letztertpopber0."TPopId",
  max(apflora.v_tpop_letztertpopber0."TPopBerJahr") AS "MaxvonTPopBerJahr"
FROM
  apflora.v_tpop_letztertpopber0
GROUP BY
  apflora.v_tpop_letztertpopber0."ApArtId",
  apflora.v_tpop_letztertpopber0."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b2rtpop;
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
        (apflora.tpopber.tpop_id = apflora.v_tpop_letztertpopber."TPopId")
        AND (apflora.tpopber.jahr = apflora.v_tpop_letztertpopber."MaxvonTPopBerJahr"))
    ON
      (apflora.tpop."PopId" = apflora.pop."PopId")
      AND (apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
WHERE
  apflora.tpopber.entwicklung = 3
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b3rtpop;
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
        (apflora.tpopber.tpop_id = apflora.v_tpop_letztertpopber."TPopId")
        AND (apflora.tpopber.jahr = apflora.v_tpop_letztertpopber."MaxvonTPopBerJahr"))
    ON
      (apflora.tpop."PopId" = apflora.pop."PopId")
      AND (apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
WHERE
  apflora.tpopber.entwicklung = 2
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b4rtpop;
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
        (apflora.tpopber.tpop_id = apflora.v_tpop_letztertpopber."TPopId")
        AND (apflora.tpopber.jahr = apflora.v_tpop_letztertpopber."MaxvonTPopBerJahr"))
    ON
      (apflora.tpop."PopId" = apflora.pop."PopId")
      AND (apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
WHERE
  apflora.tpopber.entwicklung = 1
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b5rtpop;
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
        (apflora.tpopber.tpop_id = apflora.v_tpop_letztertpopber."TPopId")
        AND (apflora.tpopber.jahr = apflora.v_tpop_letztertpopber."MaxvonTPopBerJahr"))
    ON
      (apflora.tpop."PopId" = apflora.pop."PopId")
      AND (apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
WHERE
  apflora.tpopber.entwicklung = 4
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b6rtpop;
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
        (apflora.tpopber.tpop_id = apflora.v_tpop_letztertpopber."TPopId")
        AND (apflora.tpopber.jahr = apflora.v_tpop_letztertpopber."MaxvonTPopBerJahr"))
    ON
      (apflora.tpop."PopId" = apflora.pop."PopId")
      AND (apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
WHERE
  apflora.tpopber.entwicklung = 8
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

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
      AND (apflora.v_tpop_berjahrundmassnjahr."TPopId" = apflora.tpopber.tpop_id))
  LEFT JOIN
    apflora.pop_entwicklung_werte
    ON apflora.tpopber.entwicklung = pop_entwicklung_werte."EntwicklungId"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.v_tpop_berjahrundmassnjahr."Jahr";

DROP VIEW IF EXISTS apflora.v_tpopber_mitletzterid;
CREATE OR REPLACE VIEW apflora.v_tpopber_mitletzterid AS
SELECT
  apflora.tpopber.tpop_id AS "TPopId",
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
      AND (apflora.v_tpopber_letzteid."TPopId" = apflora.tpopber.tpop_id)
  LEFT JOIN
    apflora.pop_entwicklung_werte
    ON apflora.tpopber.entwicklung = pop_entwicklung_werte."EntwicklungId";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletzterpopberaktuell;
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
            AND (v_tpop_letztertpopber0_overall."TPopId" = apflora.tpopber.tpop_id))
        ON apflora.tpopber.tpop_id = apflora.tpop."TPopId")
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

DROP VIEW IF EXISTS apflora.v_exportevab_beob;
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
          tpop_id
        FROM
          apflora.tpopber
        WHERE
          apflora.tpopber.tpop_id = apflora.tpopkontr."TPopId"
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
        apflora.tpopber.tpop_id
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

DROP VIEW IF EXISTS apflora.v_tpop_anzkontrinklletzterundletztertpopber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_anzkontrinklletzterundletztertpopber AS
SELECT
	apflora.v_tpop_anzkontrinklletzter."ApArtId" AS "ApArtId",
	apflora.v_tpop_anzkontrinklletzter."Familie",
	apflora.v_tpop_anzkontrinklletzter."AP Art",
	apflora.v_tpop_anzkontrinklletzter."AP Status",
	apflora.v_tpop_anzkontrinklletzter."AP Start im Jahr",
	apflora.v_tpop_anzkontrinklletzter."AP Stand Umsetzung",
	apflora.v_tpop_anzkontrinklletzter."AP verantwortlich",
	apflora.v_tpop_anzkontrinklletzter."PopId",
	apflora.v_tpop_anzkontrinklletzter."Pop Guid",
	apflora.v_tpop_anzkontrinklletzter."Pop Nr",
	apflora.v_tpop_anzkontrinklletzter."Pop Name",
	apflora.v_tpop_anzkontrinklletzter."Pop Status",
	apflora.v_tpop_anzkontrinklletzter."Pop bekannt seit",
	apflora.v_tpop_anzkontrinklletzter."TPop ID",
	apflora.v_tpop_anzkontrinklletzter."TPop Guid",
	apflora.v_tpop_anzkontrinklletzter."TPop Nr",
	apflora.v_tpop_anzkontrinklletzter."TPop Gemeinde",
	apflora.v_tpop_anzkontrinklletzter."TPop Flurname",
	apflora.v_tpop_anzkontrinklletzter."TPop Status",
	apflora.v_tpop_anzkontrinklletzter."TPop bekannt seit",
	apflora.v_tpop_anzkontrinklletzter."TPop Status unklar",
	apflora.v_tpop_anzkontrinklletzter."TPop Begruendung fuer unklaren Status",
	apflora.v_tpop_anzkontrinklletzter."TPop X-Koordinaten",
	apflora.v_tpop_anzkontrinklletzter."TPop Y-Koordinaten",
	apflora.v_tpop_anzkontrinklletzter."TPop Radius (m)",
	apflora.v_tpop_anzkontrinklletzter."TPop Hoehe",
	apflora.v_tpop_anzkontrinklletzter."TPop Exposition",
	apflora.v_tpop_anzkontrinklletzter."TPop Klima",
	apflora.v_tpop_anzkontrinklletzter."TPop Hangneigung",
	apflora.v_tpop_anzkontrinklletzter."TPop Beschreibung",
	apflora.v_tpop_anzkontrinklletzter."TPop Kataster-Nr",
	apflora.v_tpop_anzkontrinklletzter."TPop fuer AP-Bericht relevant",
	apflora.v_tpop_anzkontrinklletzter."TPop EigentuemerIn",
	apflora.v_tpop_anzkontrinklletzter."TPop Kontakt vor Ort",
	apflora.v_tpop_anzkontrinklletzter."TPop Nutzungszone",
	apflora.v_tpop_anzkontrinklletzter."TPop BewirtschafterIn",
	apflora.v_tpop_anzkontrinklletzter."TPop Bewirtschaftung",
	apflora.v_tpop_anzkontrinklletzter."TPop Anzahl Kontrollen",
	apflora.v_tpop_anzkontrinklletzter."TPopKontrId",
	apflora.v_tpop_anzkontrinklletzter."TPopId",
	apflora.v_tpop_anzkontrinklletzter."Kontr Guid",
	apflora.v_tpop_anzkontrinklletzter."Kontr Jahr",
	apflora.v_tpop_anzkontrinklletzter."Kontr Datum",
	apflora.v_tpop_anzkontrinklletzter."Kontr Typ",
	apflora.v_tpop_anzkontrinklletzter."Kontr BearbeiterIn",
	apflora.v_tpop_anzkontrinklletzter."Kontr Ueberlebensrate",
	apflora.v_tpop_anzkontrinklletzter."Kontr Vitalitaet",
	apflora.v_tpop_anzkontrinklletzter."Kontr Entwicklung",
	apflora.v_tpop_anzkontrinklletzter."Kontr Ursachen",
	apflora.v_tpop_anzkontrinklletzter."Kontr Erfolgsbeurteilung",
	apflora.v_tpop_anzkontrinklletzter."Kontr Aenderungs-Vorschlaege Umsetzung",
	apflora.v_tpop_anzkontrinklletzter."Kontr Aenderungs-Vorschlaege Kontrolle",
	apflora.v_tpop_anzkontrinklletzter."Kontr X-Koord",
	apflora.v_tpop_anzkontrinklletzter."Kontr Y-Koord",
	apflora.v_tpop_anzkontrinklletzter."Kontr Bemerkungen",
	apflora.v_tpop_anzkontrinklletzter."Kontr Lebensraum Delarze",
	apflora.v_tpop_anzkontrinklletzter."Kontr angrenzender Lebensraum Delarze",
	apflora.v_tpop_anzkontrinklletzter."Kontr Vegetationstyp",
	apflora.v_tpop_anzkontrinklletzter."Kontr Konkurrenz",
	apflora.v_tpop_anzkontrinklletzter."Kontr Moosschicht",
	apflora.v_tpop_anzkontrinklletzter."Kontr Krautschicht",
	apflora.v_tpop_anzkontrinklletzter."Kontr Strauchschicht",
	apflora.v_tpop_anzkontrinklletzter."Kontr Baumschicht",
	apflora.v_tpop_anzkontrinklletzter."Kontr Bodentyp",
	apflora.v_tpop_anzkontrinklletzter."Kontr Boden Kalkgehalt",
	apflora.v_tpop_anzkontrinklletzter."Kontr Boden Durchlaessigkeit",
	apflora.v_tpop_anzkontrinklletzter."Kontr Boden Humusgehalt",
	apflora.v_tpop_anzkontrinklletzter."Kontr Boden Naehrstoffgehalt",
	apflora.v_tpop_anzkontrinklletzter."Kontr Oberbodenabtrag",
	apflora.v_tpop_anzkontrinklletzter."Kontr Wasserhaushalt",
	apflora.v_tpop_anzkontrinklletzter."Kontr Uebereinstimmung mit Idealbiotop",
	apflora.v_tpop_anzkontrinklletzter."Kontr Handlungsbedarf",
	apflora.v_tpop_anzkontrinklletzter."Kontr Ueberpruefte Flaeche",
	apflora.v_tpop_anzkontrinklletzter."Kontr Flaeche der Teilpopulation m2",
	apflora.v_tpop_anzkontrinklletzter."Kontr auf Plan eingezeichnet",
	apflora.v_tpop_anzkontrinklletzter."Kontr Deckung durch Vegetation",
	apflora.v_tpop_anzkontrinklletzter."Kontr Deckung nackter Boden",
	apflora.v_tpop_anzkontrinklletzter."Kontr Deckung durch ueberpruefte Art",
	apflora.v_tpop_anzkontrinklletzter."Kontr auch junge Pflanzen",
	apflora.v_tpop_anzkontrinklletzter."Kontr maximale Veg-hoehe cm",
	apflora.v_tpop_anzkontrinklletzter."Kontr mittlere Veg-hoehe cm",
	apflora.v_tpop_anzkontrinklletzter."Kontr Gefaehrdung",
	apflora.v_tpop_anzkontrinklletzter."Kontrolle zuletzt geaendert",
	apflora.v_tpop_anzkontrinklletzter."Kontrolle zuletzt geaendert von",
	apflora.v_tpop_anzkontrinklletzter."Zaehlungen Anzahlen",
	apflora.v_tpop_anzkontrinklletzter."Zaehlungen Einheiten",
	apflora.v_tpop_anzkontrinklletzter."Zaehlungen Methoden",
	apflora.v_tpopber_mitletzterid."AnzTPopBer",
	apflora.v_tpopber_mitletzterid.id AS "TPopBer id",
	apflora.v_tpopber_mitletzterid."TPopBer Jahr",
	apflora.v_tpopber_mitletzterid."TPopBer Entwicklung",
	apflora.v_tpopber_mitletzterid."TPopBer Bemerkungen",
	apflora.v_tpopber_mitletzterid."TPopBer MutWann",
	apflora.v_tpopber_mitletzterid."TPopBer MutWer"
FROM
	apflora.v_tpop_anzkontrinklletzter
  LEFT JOIN
    apflora.v_tpopber_mitletzterid
    ON apflora.v_tpop_anzkontrinklletzter."TPop ID" = apflora.v_tpopber_mitletzterid."TPopId";