/*
 * diese Views hängen von anderen ab, die in viewsGenerieren.sql erstellt werden
 * daher muss diese Date NACH viewsGenerieren.sql ausgeführt werden
 */

DROP VIEW IF EXISTS apflora.v_ap_massnjahre CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_massnjahre AS
SELECT
  apflora.ap."ApArtId",
  apflora.v_massn_jahre.jahr
FROM
  apflora.ap,
  apflora.v_massn_jahre
WHERE
  apflora.ap."ApArtId" > 0
  AND apflora.ap."ApStatus" < 4
ORDER BY
  apflora.ap."ApArtId",
  apflora.v_massn_jahre.jahr;

DROP VIEW IF EXISTS apflora.v_ap_anzmassnprojahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_anzmassnprojahr AS
SELECT
  apflora.v_ap_massnjahre."ApArtId",
  apflora.v_ap_massnjahre.jahr,
  COALESCE(apflora.v_ap_anzmassnprojahr0."AnzahlvonTPopMassnId", 0) AS "AnzahlMassnahmen"
FROM
  apflora.v_ap_massnjahre
  LEFT JOIN
    apflora.v_ap_anzmassnprojahr0
    ON
      (apflora.v_ap_massnjahre.jahr = apflora.v_ap_anzmassnprojahr0.jahr)
      AND (apflora.v_ap_massnjahre."ApArtId" = apflora.v_ap_anzmassnprojahr0."ApArtId")
ORDER BY
  apflora.v_ap_massnjahre."ApArtId",
  apflora.v_ap_massnjahre.jahr;

DROP VIEW IF EXISTS apflora.v_ap_anzmassnbisjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_anzmassnbisjahr AS
SELECT
  apflora.v_ap_massnjahre."ApArtId",
  apflora.v_ap_massnjahre.jahr,
  sum(apflora.v_ap_anzmassnprojahr."AnzahlMassnahmen") AS "AnzahlMassnahmen"
FROM
  apflora.v_ap_massnjahre
  INNER JOIN
    apflora.v_ap_anzmassnprojahr
    ON apflora.v_ap_massnjahre."ApArtId" = apflora.v_ap_anzmassnprojahr."ApArtId"
WHERE
  apflora.v_ap_anzmassnprojahr.jahr <= apflora.v_ap_massnjahre.jahr
GROUP BY
  apflora.v_ap_massnjahre."ApArtId",
  apflora.v_ap_massnjahre.jahr
ORDER BY
  apflora.v_ap_massnjahre."ApArtId",
  apflora.v_ap_massnjahre.jahr;

DROP VIEW IF EXISTS apflora.v_ap_apberundmassn CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_apberundmassn AS
SELECT
  apflora.ap."ApArtId",
  apflora.ae_eigenschaften.artname AS "Art",
  apflora.ap_bearbstand_werte.text AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP Verantwortlich",
  apflora.ap."ApArtwert" AS "Artwert",
  apflora.v_ap_anzmassnprojahr.jahr AS "Jahr",
  apflora.v_ap_anzmassnprojahr."AnzahlMassnahmen" AS "Anzahl Massnahmen",
  apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" AS "Anzahl Massnahmen bisher",
  CASE
    WHEN apflora.apber.jahr > 0
    THEN 'Ja'
    ELSE 'Nein'
  END AS "Bericht erstellt"
FROM
  apflora.ae_eigenschaften
    INNER JOIN
      ((((apflora.ap
      LEFT JOIN
        apflora.ap_bearbstand_werte
        ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
      LEFT JOIN
        apflora.ap_umsetzung_werte
        ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
      LEFT JOIN
        apflora.adresse
        ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
      INNER JOIN
        (apflora.v_ap_anzmassnprojahr
        INNER JOIN
          (apflora.v_ap_anzmassnbisjahr
          LEFT JOIN
            apflora.apber
            ON
              (apflora.v_ap_anzmassnbisjahr.jahr = apflora.apber.jahr)
              AND (apflora.v_ap_anzmassnbisjahr."ApArtId" = apflora.apber.ap_id))
          ON
            (apflora.v_ap_anzmassnprojahr.jahr = apflora.v_ap_anzmassnbisjahr.jahr)
            AND (apflora.v_ap_anzmassnprojahr."ApArtId" = apflora.v_ap_anzmassnbisjahr."ApArtId"))
        ON apflora.ap."ApArtId" = apflora.v_ap_anzmassnprojahr."ApArtId")
      ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId"
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.v_ap_anzmassnprojahr.jahr;

DROP VIEW IF EXISTS apflora.v_tpop_letztermassnber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_letztermassnber AS
SELECT
  apflora.v_tpop_letztermassnber0."ApArtId",
  apflora.v_tpop_letztermassnber0.id,
  max(apflora.v_tpop_letztermassnber0.jahr) AS "MaxvonTPopMassnBerJahr"
FROM
  apflora.v_tpop_letztermassnber0
GROUP BY
  apflora.v_tpop_letztermassnber0."ApArtId",
  apflora.v_tpop_letztermassnber0.id;

DROP VIEW IF EXISTS apflora.v_tpop_letztertpopber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_letztertpopber AS
SELECT
  apflora.v_tpop_letztertpopber0."ApArtId",
  apflora.v_tpop_letztertpopber0.id,
  max(apflora.v_tpop_letztertpopber0.tpopber_jahr) AS "MaxvonTPopBerJahr"
FROM
  apflora.v_tpop_letztertpopber0
GROUP BY
  apflora.v_tpop_letztertpopber0."ApArtId",
  apflora.v_tpop_letztertpopber0.id;

DROP VIEW IF EXISTS apflora.v_pop_letztermassnber CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_letztermassnber AS
SELECT
  apflora.v_pop_letztermassnber0."ApArtId",
  apflora.v_pop_letztermassnber0."PopId",
  max(apflora.v_pop_letztermassnber0.jahr) AS "MaxvonPopMassnBerJahr"
FROM
  apflora.v_pop_letztermassnber0
GROUP BY
  apflora.v_pop_letztermassnber0."ApArtId",
  apflora.v_pop_letztermassnber0."PopId";

-- dieser view ist für den Bericht gedacht - daher letzter popber vor jBerJahr
DROP VIEW IF EXISTS apflora.v_pop_letzterpopber CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_letzterpopber AS
SELECT
  apflora.v_pop_letzterpopber0."ApArtId",
  apflora.v_pop_letzterpopber0."PopId",
  max(apflora.v_pop_letzterpopber0.jahr) AS "MaxvonPopBerJahr"
FROM
  apflora.v_pop_letzterpopber0
GROUP BY
  apflora.v_pop_letzterpopber0."ApArtId",
  apflora.v_pop_letzterpopber0."PopId";

-- dieser view ist für die Qualitätskontrolle gedacht - daher letzter popber überhaupt
DROP VIEW IF EXISTS apflora.v_pop_letzterpopber_overall CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_letzterpopber_overall AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.v_pop_letzterpopber0_overall.jahr
FROM
  (apflora.pop
  INNER JOIN
    apflora.v_pop_letzterpopber0_overall
    ON apflora.pop."PopId" = apflora.v_pop_letzterpopber0_overall.pop_id)
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.tpop.apber_relevant = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.v_pop_letzterpopber0_overall.jahr;

DROP VIEW IF EXISTS apflora.v_apber_uebe CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebe AS
SELECT
  apflora.apber.*,
  apflora.ae_eigenschaften.artname,
  apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((apflora.ae_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
    INNER JOIN
      (apflora._variable
      INNER JOIN
        (apflora.apber
        INNER JOIN
          apflora.v_ap_anzmassnbisjahr
          ON apflora.apber.ap_id = apflora.v_ap_anzmassnbisjahr."ApArtId")
        ON apflora._variable.apber_jahr = apflora.apber.jahr)
      ON apflora.ap."ApArtId" = apflora.apber.ap_id)
    ON "tblKonstanten_1".apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.apber.beurteilung = 1
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_apber_uebe_apid CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebe_apid AS
SELECT
  apflora.ap."ApArtId"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((apflora.ae_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
    INNER JOIN
      (apflora._variable
      INNER JOIN
        (apflora.apber
        INNER JOIN
          apflora.v_ap_anzmassnbisjahr
          ON apflora.apber.ap_id = apflora.v_ap_anzmassnbisjahr."ApArtId")
        ON apflora._variable.apber_jahr = apflora.apber.jahr)
      ON apflora.ap."ApArtId" = apflora.apber.ap_id)
    ON "tblKonstanten_1".apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.apber.beurteilung = 1
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3;

DROP VIEW IF EXISTS apflora.v_apber_uebkm CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebkm AS
SELECT
  apflora.ae_eigenschaften.artname,
  CASE
    WHEN apflora.ae_eigenschaften.kefart = -1
    THEN 'Ja'
    ELSE ''
  END AS "FnsKefArt2",
  CASE
    WHEN Round((apflora._variable.apber_jahr - apflora.ae_eigenschaften.kefkontrolljahr) / 4,0) = (apflora._variable.apber_jahr - apflora.ae_eigenschaften.kefkontrolljahr) / 4
    THEN 'Ja'
    ELSE ''
  END AS "FnsKefKontrJahr2"
FROM
  (apflora.ae_eigenschaften
    INNER JOIN
      ((apflora.v_ap_anzmassnbisjahr AS "vApAnzMassnBisJahr_1"
      INNER JOIN
        apflora.ap
        ON "vApAnzMassnBisJahr_1"."ApArtId" = apflora.ap."ApArtId")
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
    INNER JOIN
      (apflora.apber
      INNER JOIN
        apflora._variable
        ON apflora.apber.jahr = apflora._variable.apber_jahr)
      ON
        (apflora._variable.apber_jahr = "vApAnzMassnBisJahr_1".jahr)
        AND (apflora.ap."ApArtId" = apflora.apber.ap_id)
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
  AND "vApAnzMassnBisJahr_1"."AnzahlMassnahmen" = '0'
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_apber_uebma CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebma AS
SELECT
  apflora.ae_eigenschaften.artname,
  apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen"
FROM
  apflora._variable
  INNER JOIN
    ((apflora.ae_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
    INNER JOIN
      apflora.v_ap_anzmassnbisjahr
      ON apflora.ap."ApArtId" = apflora.v_ap_anzmassnbisjahr."ApArtId")
    ON apflora._variable.apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_apber_uebma_apid CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebma_apid AS
SELECT
  apflora.ap."ApArtId"
FROM
  apflora._variable
  INNER JOIN
    ((apflora.ae_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
    INNER JOIN
      apflora.v_ap_anzmassnbisjahr
      ON apflora.ap."ApArtId" = apflora.v_ap_anzmassnbisjahr."ApArtId")
    ON apflora._variable.apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3;

DROP VIEW IF EXISTS apflora.v_apber_uebme CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebme AS
SELECT
  apflora.apber.*,
  apflora.ae_eigenschaften.artname
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((apflora.ae_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber.ap_id = apflora.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber.jahr = apflora._variable.apber_jahr)
      ON apflora.ap."ApArtId" = apflora.apber.ap_id)
    ON "tblKonstanten_1".apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.apber.beurteilung = 5
  AND apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_apber_uebme_apid CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebme_apid AS
SELECT
  apflora.ap."ApArtId"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((apflora.ae_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber.ap_id = apflora.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber.jahr = apflora._variable.apber_jahr)
      ON apflora.ap."ApArtId" = apflora.apber.ap_id)
    ON "tblKonstanten_1".apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.apber.beurteilung = 5
  AND apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3;

DROP VIEW IF EXISTS apflora.v_apber_uebne CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebne AS
SELECT
  apflora.apber.*,
  apflora.ae_eigenschaften.artname
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((apflora.ae_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber.ap_id = apflora.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber.jahr = apflora._variable.apber_jahr)
      ON apflora.ap."ApArtId" = apflora.apber.ap_id)
    ON "tblKonstanten_1".apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.apber.beurteilung = 3
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3
  AND apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_apber_uebne_apid CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebne_apid AS
SELECT
  apflora.ap."ApArtId"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((apflora.ae_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber.ap_id = apflora.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber.jahr = apflora._variable.apber_jahr)
      ON apflora.ap."ApArtId" = apflora.apber.ap_id)
    ON "tblKonstanten_1".apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.apber.beurteilung = 3
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3
  AND apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0;

DROP VIEW IF EXISTS apflora.v_apber_uebse CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebse AS
SELECT
  apflora.apber.*,
  apflora.ae_eigenschaften.artname
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((apflora.ae_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber.ap_id = apflora.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber.jahr = apflora._variable.apber_jahr)
    ON apflora.ap."ApArtId" = apflora.apber.ap_id)
  ON "tblKonstanten_1".apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.apber.beurteilung = 4
  AND apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_apber_uebse_apid CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebse_apid AS
SELECT
  apflora.ap."ApArtId"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((apflora.ae_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber.ap_id = apflora.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber.jahr = apflora._variable.apber_jahr)
    ON apflora.ap."ApArtId" = apflora.apber.ap_id)
  ON "tblKonstanten_1".apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.apber.beurteilung = 4
  AND apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3;

DROP VIEW IF EXISTS apflora.v_apber_uebun CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebun AS
SELECT
  apflora.apber.*,
  apflora.ae_eigenschaften.artname
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((apflora.ae_eigenschaften
    INNER JOIN
      (apflora.ap INNER JOIN apflora.v_ap_apberrelevant ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber.ap_id = apflora.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber.jahr = apflora._variable.apber_jahr)
    ON apflora.ap."ApArtId" = apflora.apber.ap_id)
  ON "tblKonstanten_1".apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.apber.beurteilung = 1168274204
  AND apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_apber_uebun_apid CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebun_apid AS
SELECT
  apflora.ap."ApArtId"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((apflora.ae_eigenschaften
    INNER JOIN
      (apflora.ap INNER JOIN apflora.v_ap_apberrelevant ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber.ap_id = apflora.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber.jahr = apflora._variable.apber_jahr)
    ON apflora.ap."ApArtId" = apflora.apber.ap_id)
  ON "tblKonstanten_1".apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.apber.beurteilung = 1168274204
  AND apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3;

DROP VIEW IF EXISTS apflora.v_apber_uebwe CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebwe AS
SELECT
  apflora.apber.*,
  apflora.ae_eigenschaften.artname
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((apflora.ae_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber.ap_id = apflora.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber.jahr = apflora._variable.apber_jahr)
      ON apflora.ap."ApArtId" = apflora.apber.ap_id)
    ON "tblKonstanten_1".apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.apber.beurteilung = 6
  AND apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_apber_uebwe_apid CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebwe_apid AS
SELECT
  apflora.ap."ApArtId"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((apflora.ae_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber.ap_id = apflora.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber.jahr = apflora._variable.apber_jahr)
      ON apflora.ap."ApArtId" = apflora.apber.ap_id)
    ON "tblKonstanten_1".apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.apber.beurteilung = 6
  AND apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3;

DROP VIEW IF EXISTS apflora.v_apber_uebnb000 CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebnb000 AS
SELECT
  apflora.ap."ApArtId",
  apflora.apber.jahr
FROM
  (((apflora.ap
  INNER JOIN
    apflora.v_ap_anzmassnbisjahr
    ON apflora.ap."ApArtId" = apflora.v_ap_anzmassnbisjahr."ApArtId")
  INNER JOIN
    apflora.v_ap_apberrelevant
    ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
  LEFT JOIN
    apflora.apber
    ON apflora.ap."ApArtId" = apflora.apber.ap_id)
  INNER JOIN
    apflora._variable
    ON apflora.v_ap_anzmassnbisjahr.jahr = apflora._variable.apber_jahr
WHERE
  apflora.apber.ap_id IS NULL
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3;

DROP VIEW IF EXISTS apflora.v_apber_uebnb00 CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebnb00 AS
SELECT
  apflora.ap."ApArtId",
  apflora.apber.jahr
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    (((apflora.ap
    INNER JOIN
      apflora.v_ap_anzmassnbisjahr
      ON apflora.ap."ApArtId" = apflora.v_ap_anzmassnbisjahr."ApArtId")
    INNER JOIN
      apflora.v_ap_apberrelevant
      ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
    INNER JOIN
      (apflora.apber
      INNER JOIN
        apflora._variable
        ON apflora.apber.jahr = apflora._variable.apber_jahr)
      ON apflora.ap."ApArtId" = apflora.apber.ap_id)
    ON "tblKonstanten_1".apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
  AND apflora.apber.beurteilung IS NULL;

DROP VIEW IF EXISTS apflora.v_apber_uebnb0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebnb0 AS
SELECT
  "ApArtId",
  jahr
FROM
  apflora.v_apber_uebnb000
UNION SELECT
  "ApArtId",
  jahr
FROM
  apflora.v_apber_uebnb00;

DROP VIEW IF EXISTS apflora.v_apber_uebnb CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebnb AS
SELECT
 apflora.ap."ApArtId",
  apflora.ae_eigenschaften.artname
FROM
  apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
  AND apflora.ap."ApArtId" NOT IN (SELECT * FROM apflora.v_apber_uebse_apid)
  AND apflora.ap."ApArtId" NOT IN (SELECT * FROM apflora.v_apber_uebe_apid)
  AND apflora.ap."ApArtId" NOT IN (SELECT * FROM apflora.v_apber_uebme_apid)
  AND apflora.ap."ApArtId" NOT IN (SELECT * FROM apflora.v_apber_uebwe_apid)
  AND apflora.ap."ApArtId" NOT IN (SELECT * FROM apflora.v_apber_uebne_apid)
  AND apflora.ap."ApArtId" NOT IN (SELECT * FROM apflora.v_apber_uebun_apid)
  AND apflora.ap."ApArtId" IN (SELECT * FROM apflora.v_apber_uebma_apid)
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_apber_uet01 CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uet01 AS
SELECT
  apflora.ap."ApArtId",
  apflora.ae_eigenschaften.artname,
  CASE
    WHEN apflora.ap."ApArtId" NOT IN (SELECT * FROM apflora.v_apber_uebma_apid)
    THEN 1
    ELSE 0
  END AS "keineMassnahmen",
  CASE
    WHEN apflora.ae_eigenschaften.kefart = -1
    THEN 1
    ELSE 0
  END AS "FnsKefArt",
  CASE
    WHEN Round((apflora._variable.apber_jahr - apflora.ae_eigenschaften.kefkontrolljahr) / 4, 0) = (apflora._variable.apber_jahr - apflora.ae_eigenschaften.kefkontrolljahr) / 4
    THEN 1
    ELSE 0
  END AS "FnsKefKontrJahr"
FROM
  apflora.ae_eigenschaften
  INNER JOIN
    ((apflora.ap
    INNER JOIN
      (apflora.v_ap_anzmassnbisjahr
      INNER JOIN
        apflora._variable
        ON apflora.v_ap_anzmassnbisjahr.jahr = apflora._variable.apber_jahr)
      ON apflora.ap."ApArtId" = apflora.v_ap_anzmassnbisjahr."ApArtId")
    INNER JOIN
      apflora.v_ap_apberrelevant
      ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_apber_uet_veraengegenvorjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uet_veraengegenvorjahr AS
SELECT
  apflora.ap."ApArtId",
  apflora.apber.veraenderung_zum_vorjahr,
  apflora.apber.jahr
FROM
  apflora.ap
  LEFT JOIN
    apflora.apber
    ON apflora.ap."ApArtId" = apflora.apber.ap_id
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
  AND (
    apflora.apber.jahr IN (SELECT apflora._variable.apber_jahr FROM apflora._variable)
    Or apflora.apber.jahr IS NULL
  );

DROP VIEW IF EXISTS apflora.v_tpop_statuswidersprichtbericht CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_statuswidersprichtbericht AS
SELECT
  apflora.ae_eigenschaften.artname AS "Art",
  apflora.ap_bearbstand_werte.text AS "Bearbeitungsstand AP",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname,
  apflora.tpop.status,
  apflora.tpopber.entwicklung AS "TPopBerEntwicklung",
  apflora.tpopber.jahr AS tpopber_jahr
FROM
  ((apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopber
        INNER JOIN
          apflora.v_tpopber_letzterber
          ON
            (apflora.tpopber.tpop_id = apflora.v_tpopber_letzterber.tpop_id)
            AND (apflora.tpopber.jahr = apflora.v_tpopber_letzterber.jahr))
        ON apflora.tpop.id = apflora.tpopber.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  INNER JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code
WHERE
  (
    apflora.ap."ApStatus" < 4
    AND (
      apflora.tpop.status = 101
      OR apflora.tpop.status = 202
    )
    AND apflora.tpopber.entwicklung <> 8
  )
  OR (
    apflora.ap."ApStatus" < 4
    AND apflora.tpop.status NOT IN (101, 202)
    AND apflora.tpopber.entwicklung = 8
  )
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname;

-- im Gebrauch (Access):
DROP VIEW IF EXISTS apflora.v_apber_injahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_injahr AS
SELECT
  apflora.ap.*,
  apflora.ae_eigenschaften.artname,
  apflora.apber.*,
  concat(apflora.adresse."AdrName", ', ', apflora.adresse."AdrAdresse") AS bearbeiter_decodiert,
  apflora.apberuebersicht.jahr AS apberuebersicht_jahr,
  apflora.apberuebersicht.bemerkungen,
  apflora.v_erstemassnproap."MinvonTPopMassnJahr" AS "ErsteMassnahmeImJahr"
FROM
  (apflora.ae_eigenschaften
  INNER JOIN
    (apflora.ap
    LEFT JOIN
      apflora.v_erstemassnproap
      ON apflora.ap."ApArtId" = apflora.v_erstemassnproap."ApArtId")
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  INNER JOIN
    (((apflora.apber
    LEFT JOIN
      apflora.adresse
      ON apflora.apber.bearbeiter = apflora.adresse."AdrId")
    LEFT JOIN
      apflora.apberuebersicht
      ON apflora.apber.jahr = apflora.apberuebersicht.jahr)
    INNER JOIN
      apflora._variable
      ON apflora.apber.jahr = apflora._variable.apber_jahr)
    ON apflora.ap."ApArtId" = apflora.apber.ap_id
WHERE
  apflora.ap."ApStatus" < 4
  --AND apflora.ap."ApArtId" > 150
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_apber_b2rpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b2rpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  ((apflora.v_pop_letzterpopber
  INNER JOIN
    apflora.pop
    ON apflora.v_pop_letzterpopber."ApArtId" = apflora.pop."ApArtId")
  INNER JOIN
    apflora.popber
    ON
      (apflora.pop."PopId" = apflora.popber.pop_id)
      AND (apflora.v_pop_letzterpopber."PopId" = apflora.popber.pop_id)
      AND (apflora.v_pop_letzterpopber."MaxvonPopBerJahr" = apflora.popber.jahr))
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.popber.entwicklung = 3
  AND apflora.tpop.apber_relevant = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_b3rpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b3rpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  ((apflora.v_pop_letzterpopber
  INNER JOIN
    apflora.pop
    ON apflora.v_pop_letzterpopber."ApArtId" = apflora.pop."ApArtId")
  INNER JOIN
    apflora.popber
    ON
      (apflora.pop."PopId" = apflora.popber.pop_id)
      AND (apflora.v_pop_letzterpopber."PopId" = apflora.popber.pop_id)
      AND (apflora.v_pop_letzterpopber."MaxvonPopBerJahr" = apflora.popber.jahr))
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.popber.entwicklung = 2
  AND apflora.tpop.apber_relevant = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_b4rpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b4rpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  ((apflora.v_pop_letzterpopber
  INNER JOIN
    apflora.pop
    ON apflora.v_pop_letzterpopber."ApArtId" = apflora.pop."ApArtId")
  INNER JOIN
    apflora.popber
    ON
      (apflora.pop."PopId" = apflora.popber.pop_id)
      AND (apflora.v_pop_letzterpopber."PopId" = apflora.popber.pop_id)
      AND (apflora.v_pop_letzterpopber."MaxvonPopBerJahr" = apflora.popber.jahr))
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.popber.entwicklung = 1
  AND apflora.tpop.apber_relevant = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_b5rpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b5rpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  ((apflora.v_pop_letzterpopber
  INNER JOIN
    apflora.pop
    ON apflora.v_pop_letzterpopber."ApArtId" = apflora.pop."ApArtId")
  INNER JOIN
    apflora.popber
    ON
      (apflora.pop."PopId" = apflora.popber.pop_id)
      AND (apflora.v_pop_letzterpopber."PopId" = apflora.popber.pop_id)
      AND (apflora.v_pop_letzterpopber."MaxvonPopBerJahr" = apflora.popber.jahr))
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  (
    apflora.popber.entwicklung = 4
    OR apflora.popber.entwicklung = 9
  )
  AND apflora.tpop.apber_relevant = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_b6rpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b6rpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  ((apflora.v_pop_letzterpopber
  INNER JOIN
    apflora.pop
    ON apflora.v_pop_letzterpopber."ApArtId" = apflora.pop."ApArtId")
  INNER JOIN
    apflora.popber
    ON
      (apflora.pop."PopId" = apflora.popber.pop_id)
      AND (apflora.v_pop_letzterpopber."PopId" = apflora.popber.pop_id)
      AND (apflora.v_pop_letzterpopber."MaxvonPopBerJahr" = apflora.popber.jahr))
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.popber.entwicklung = 8
  AND apflora.tpop.apber_relevant = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_b2rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b2rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop.id
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
        (apflora.tpopber.tpop_id = apflora.v_tpop_letztertpopber.id)
        AND (apflora.tpopber.jahr = apflora.v_tpop_letztertpopber."MaxvonTPopBerJahr"))
    ON
      (apflora.tpop.pop_id = apflora.pop."PopId")
      AND (apflora.tpop.id = apflora.tpopber.tpop_id)
WHERE
  apflora.tpopber.entwicklung = 3
  AND apflora.tpop.apber_relevant = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_b3rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b3rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop.id
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
        (apflora.tpopber.tpop_id = apflora.v_tpop_letztertpopber.id)
        AND (apflora.tpopber.jahr = apflora.v_tpop_letztertpopber."MaxvonTPopBerJahr"))
    ON
      (apflora.tpop.pop_id = apflora.pop."PopId")
      AND (apflora.tpop.id = apflora.tpopber.tpop_id)
WHERE
  apflora.tpopber.entwicklung = 2
  AND apflora.tpop.apber_relevant = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_b4rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b4rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop.id
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
        (apflora.tpopber.tpop_id = apflora.v_tpop_letztertpopber.id)
        AND (apflora.tpopber.jahr = apflora.v_tpop_letztertpopber."MaxvonTPopBerJahr"))
    ON
      (apflora.tpop.pop_id = apflora.pop."PopId")
      AND (apflora.tpop.id = apflora.tpopber.tpop_id)
WHERE
  apflora.tpopber.entwicklung = 1
  AND apflora.tpop.apber_relevant = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_b5rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b5rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop.id
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
        (apflora.tpopber.tpop_id = apflora.v_tpop_letztertpopber.id)
        AND (apflora.tpopber.jahr = apflora.v_tpop_letztertpopber."MaxvonTPopBerJahr"))
    ON
      (apflora.tpop.pop_id = apflora.pop."PopId")
      AND (apflora.tpop.id = apflora.tpopber.tpop_id)
WHERE
  apflora.tpopber.entwicklung = 4
  AND apflora.tpop.apber_relevant = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_b6rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b6rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop.id
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
        (apflora.tpopber.tpop_id = apflora.v_tpop_letztertpopber.id)
        AND (apflora.tpopber.jahr = apflora.v_tpop_letztertpopber."MaxvonTPopBerJahr"))
    ON
      (apflora.tpop.pop_id = apflora.pop."PopId")
      AND (apflora.tpop.id = apflora.tpopber.tpop_id)
WHERE
  apflora.tpopber.entwicklung = 8
  AND apflora.tpop.apber_relevant = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_c1rpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c1rpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  apflora._variable,
  (apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id)
  INNER JOIN
    apflora.tpopmassn
    ON apflora.tpop.id = apflora.tpopmassn.tpop_id
WHERE
  apflora.tpopmassn.jahr <= apflora._variable.apber_jahr
  AND apflora.tpop.apber_relevant = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_c3rpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c3rpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.v_pop_letztermassnber
  INNER JOIN
    apflora.pop
    ON apflora.v_pop_letztermassnber."ApArtId" = apflora.pop."ApArtId")
  INNER JOIN
    apflora.popmassnber
    ON
      (apflora.pop."PopId" = apflora.popmassnber.pop_id)
      AND (apflora.v_pop_letztermassnber."MaxvonPopMassnBerJahr" = apflora.popmassnber.jahr)
      AND (apflora.v_pop_letztermassnber."PopId" = apflora.popmassnber.pop_id)
WHERE
  apflora.popmassnber.beurteilung = 1
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_c4rpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c4rpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.v_pop_letztermassnber
  INNER JOIN
    apflora.pop
    ON apflora.v_pop_letztermassnber."ApArtId" = apflora.pop."ApArtId")
  INNER JOIN
    apflora.popmassnber
    ON
      (apflora.pop."PopId" = apflora.popmassnber.pop_id)
      AND (apflora.v_pop_letztermassnber."MaxvonPopMassnBerJahr" = apflora.popmassnber.jahr)
      AND (apflora.v_pop_letztermassnber."PopId" = apflora.popmassnber.pop_id)
WHERE
  apflora.popmassnber.beurteilung = 2
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_c5rpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c5rpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.v_pop_letztermassnber
  INNER JOIN
    apflora.pop
    ON apflora.v_pop_letztermassnber."ApArtId" = apflora.pop."ApArtId")
  INNER JOIN
    apflora.popmassnber
    ON
      (apflora.pop."PopId" = apflora.popmassnber.pop_id)
      AND (apflora.v_pop_letztermassnber."MaxvonPopMassnBerJahr" = apflora.popmassnber.jahr)
      AND (apflora.v_pop_letztermassnber."PopId" = apflora.popmassnber.pop_id)
WHERE
  apflora.popmassnber.beurteilung = 3
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_c6rpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c6rpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.v_pop_letztermassnber
  INNER JOIN
    apflora.pop
    ON apflora.v_pop_letztermassnber."ApArtId" = apflora.pop."ApArtId")
  INNER JOIN
    apflora.popmassnber
    ON
      (apflora.pop."PopId" = apflora.popmassnber.pop_id)
      AND (apflora.v_pop_letztermassnber."PopId" = apflora.popmassnber.pop_id)
      AND (apflora.v_pop_letztermassnber."MaxvonPopMassnBerJahr" = apflora.popmassnber.jahr)
WHERE
  apflora.popmassnber.beurteilung = 4
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_c7rpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c7rpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.v_pop_letztermassnber
  INNER JOIN
    apflora.pop
    ON apflora.v_pop_letztermassnber."ApArtId" = apflora.pop."ApArtId")
  INNER JOIN
    apflora.popmassnber
    ON
      (apflora.pop."PopId" = apflora.popmassnber.pop_id)
      AND (apflora.v_pop_letztermassnber."PopId" = apflora.popmassnber.pop_id)
      AND (apflora.v_pop_letztermassnber."MaxvonPopMassnBerJahr" = apflora.popmassnber.jahr)
WHERE
  apflora.popmassnber.beurteilung = 5
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_c3rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c3rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop.id
FROM
  apflora.pop
  INNER JOIN
    ((apflora.v_tpop_letztermassnber
    INNER JOIN
      apflora.tpopmassnber
      ON
        (apflora.v_tpop_letztermassnber.id = apflora.tpopmassnber.tpop_id)
        AND (apflora.v_tpop_letztermassnber."MaxvonTPopMassnBerJahr" = apflora.tpopmassnber.jahr))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber.tpop_id = apflora.tpop.id)
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.tpopmassnber.beurteilung = 1
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_c4rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c4rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop.id
FROM
  apflora.pop
  INNER JOIN
    ((apflora.v_tpop_letztermassnber
    INNER JOIN
      apflora.tpopmassnber
      ON
        (apflora.v_tpop_letztermassnber.id = apflora.tpopmassnber.tpop_id)
        AND (apflora.v_tpop_letztermassnber."MaxvonTPopMassnBerJahr" = apflora.tpopmassnber.jahr))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber.tpop_id = apflora.tpop.id)
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  (apflora.tpopmassnber.beurteilung = 2)
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_c5rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c5rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop.id
FROM
  apflora.pop
  INNER JOIN
    ((apflora.v_tpop_letztermassnber
    INNER JOIN
      apflora.tpopmassnber
      ON
        (apflora.v_tpop_letztermassnber.id = apflora.tpopmassnber.tpop_id)
        AND (apflora.v_tpop_letztermassnber."MaxvonTPopMassnBerJahr" = apflora.tpopmassnber.jahr))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber.tpop_id = apflora.tpop.id)
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.tpopmassnber.beurteilung = 3
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_c6rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c6rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop.id
FROM
  apflora.pop
  INNER JOIN
    ((apflora.v_tpop_letztermassnber
    INNER JOIN
      apflora.tpopmassnber
      ON
        (apflora.v_tpop_letztermassnber.id = apflora.tpopmassnber.tpop_id)
        AND (apflora.v_tpop_letztermassnber."MaxvonTPopMassnBerJahr" = apflora.tpopmassnber.jahr))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber.tpop_id = apflora.tpop.id)
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.tpopmassnber.beurteilung = 4
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_c7rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c7rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop.id
FROM
  apflora.pop
  INNER JOIN
    ((apflora.v_tpop_letztermassnber
    INNER JOIN
      apflora.tpopmassnber
      ON
        (apflora.v_tpop_letztermassnber.id = apflora.tpopmassnber.tpop_id)
        AND (apflora.v_tpop_letztermassnber."MaxvonTPopMassnBerJahr" = apflora.tpopmassnber.jahr))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber.tpop_id = apflora.tpop.id)
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.tpopmassnber.beurteilung = 5
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_pop_popberundmassnber CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_popberundmassnber AS
SELECT
  apflora.ae_eigenschaften.taxid AS "AP ApArtId",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte.text AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.pop."MutWann" AS "Datensatz zuletzt geaendert",
  apflora.pop."MutWer" AS "Datensatz zuletzt geaendert von",
  apflora.v_pop_berundmassnjahre."Jahr",
  apflora.popber.id AS "PopBer Id",
  apflora.popber.jahr AS "PopBer Jahr",
  tpop_entwicklung_werte.text AS "PopBer Entwicklung",
  apflora.popber.bemerkungen AS "PopBer Bemerkungen",
  apflora.popber.changed AS "PopBer MutWann",
  apflora.popber.changed_by AS "PopBer MutWer",
  apflora.popmassnber.id AS "PopMassnBer Id",
  apflora.popmassnber.jahr AS "PopMassnBer Jahr",
  tpopmassn_erfbeurt_werte.text AS "PopMassnBer Entwicklung",
  apflora.popmassnber.bemerkungen AS "PopMassnBer Interpretation",
  apflora.popmassnber.changed AS "PopMassnBer MutWann",
  apflora.popmassnber.changed_by AS "PopMassnBer MutWer"
FROM
  apflora.ae_eigenschaften
  INNER JOIN
    (((apflora.ap
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
    INNER JOIN
      (((apflora.pop
      LEFT JOIN
        (apflora.v_pop_berundmassnjahre
        LEFT JOIN
          (apflora.popmassnber
          LEFT JOIN
            apflora.tpopmassn_erfbeurt_werte
            ON apflora.popmassnber.beurteilung = tpopmassn_erfbeurt_werte.code)
          ON
            (apflora.v_pop_berundmassnjahre."Jahr" = apflora.popmassnber.jahr)
            AND (apflora.v_pop_berundmassnjahre."PopId" = apflora.popmassnber.pop_id))
        ON apflora.pop."PopId" = apflora.v_pop_berundmassnjahre."PopId")
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop."PopHerkunft" = pop_status_werte.code)
      LEFT JOIN
        (apflora.popber
        LEFT JOIN
          apflora.tpop_entwicklung_werte
          ON apflora.popber.entwicklung = tpop_entwicklung_werte.code)
        ON
          (apflora.v_pop_berundmassnjahre."Jahr" = apflora.popber.jahr)
          AND (apflora.v_pop_berundmassnjahre."PopId" = apflora.popber.pop_id))
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId"
WHERE
  apflora.ae_eigenschaften.taxid > 150
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.v_pop_berundmassnjahre."Jahr";

DROP VIEW IF EXISTS apflora.v_pop_mit_letzter_popber CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_mit_letzter_popber AS
SELECT
  apflora.ae_eigenschaften.taxid AS "AP ApArtId",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte.text AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.pop."MutWann" AS "Datensatz zuletzt geaendert",
  apflora.pop."MutWer" AS "Datensatz zuletzt geaendert von",
  apflora.popber.id AS "PopBer Id",
  apflora.popber.jahr AS "PopBer Jahr",
  tpop_entwicklung_werte.text AS "PopBer Entwicklung",
  apflora.popber.bemerkungen AS "PopBer Bemerkungen",
  apflora.popber.changed AS "PopBer MutWann",
  apflora.popber.changed_by AS "PopBer MutWer"
FROM
  apflora.ae_eigenschaften
  INNER JOIN
    (((apflora.ap
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
    INNER JOIN
      ((apflora.pop
      LEFT JOIN
        (apflora.v_pop_letzterpopber0_overall
        LEFT JOIN
          (apflora.popber
          LEFT JOIN
            apflora.tpop_entwicklung_werte
            ON apflora.popber.entwicklung = tpop_entwicklung_werte.code)
          ON
            (apflora.v_pop_letzterpopber0_overall.jahr = apflora.popber.jahr)
            AND (apflora.v_pop_letzterpopber0_overall.pop_id = apflora.popber.pop_id))
        ON apflora.pop."PopId" = apflora.v_pop_letzterpopber0_overall.pop_id)
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop."PopHerkunft" = pop_status_werte.code)
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId"
WHERE
  apflora.ae_eigenschaften.taxid > 150
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.v_pop_letzterpopber0_overall.jahr;

DROP VIEW IF EXISTS apflora.v_pop_mit_letzter_popmassnber CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_mit_letzter_popmassnber AS
SELECT
  apflora.ae_eigenschaften.taxid AS "AP ApArtId",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte.text AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.pop."MutWann" AS "Datensatz zuletzt geaendert",
  apflora.pop."MutWer" AS "Datensatz zuletzt geaendert von",
  apflora.popmassnber.id AS "PopMassnBer Id",
  apflora.popmassnber.jahr AS "PopMassnBer Jahr",
  tpopmassn_erfbeurt_werte.text AS "PopMassnBer Entwicklung",
  apflora.popmassnber.bemerkungen AS "PopMassnBer Interpretation",
  apflora.popmassnber.changed AS "PopMassnBer MutWann",
  apflora.popmassnber.changed_by AS "PopMassnBer MutWer"
FROM
  apflora.ae_eigenschaften
  INNER JOIN
    (((apflora.ap
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
    INNER JOIN
      ((apflora.pop
      LEFT JOIN
        (apflora.v_pop_letzterpopbermassn
        LEFT JOIN
          (apflora.popmassnber
          LEFT JOIN
            apflora.tpopmassn_erfbeurt_werte
            ON apflora.popmassnber.beurteilung = tpopmassn_erfbeurt_werte.code)
          ON
            (apflora.v_pop_letzterpopbermassn.jahr = apflora.popmassnber.jahr)
            AND (apflora.v_pop_letzterpopbermassn."PopId" = apflora.popmassnber.pop_id))
        ON apflora.pop."PopId" = apflora.v_pop_letzterpopbermassn."PopId")
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop."PopHerkunft" = pop_status_werte.code)
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId"
WHERE
  apflora.ae_eigenschaften.taxid > 150
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.v_pop_letzterpopbermassn.jahr;

DROP VIEW IF EXISTS apflora.v_tpop_popberundmassnber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_popberundmassnber AS
SELECT
  apflora.ae_eigenschaften.taxid AS "ApArtId",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte.text AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.tpop.id AS tpop_id,
  apflora.tpop.nr AS "TPop Nr",
  apflora.tpop.gemeinde AS "TPop Gemeinde",
  apflora.tpop.flurname AS "TPop Flurname",
  "domPopHerkunft_1".text AS "TPop Status",
  apflora.tpop.bekannt_seit AS "TPop bekannt seit",
  apflora.tpop.status_unklar AS "TPop Status unklar",
  apflora.tpop.status_unklar_grund AS "TPop Begruendung fuer unklaren Status",
  apflora.tpop.x AS "TPop X-Koordinaten",
  apflora.tpop.y AS "TPop Y-Koordinaten",
  apflora.tpop.radius AS "TPop Radius (m)",
  apflora.tpop.hoehe AS "TPop Hoehe",
  apflora.tpop.exposition AS "TPop Exposition",
  apflora.tpop.klima AS "TPop Klima",
  apflora.tpop.neigung AS "TPop Hangneigung",
  apflora.tpop.beschreibung AS "TPop Beschreibung",
  apflora.tpop.kataster_nr AS "TPop Kataster-Nr",
  apflora.tpop.apber_relevant AS "TPop fuer AP-Bericht relevant",
  apflora.tpop.eigentuemer AS "TPop EigentuemerIn",
  apflora.tpop.kontakt AS "TPop Kontakt vor Ort",
  apflora.tpop.nutzungszone AS "TPop Nutzungszone",
  apflora.tpop.bewirtschafter AS "TPop BewirtschafterIn",
  apflora.tpop.bewirtschaftung AS "TPop Bewirtschaftung",
  apflora.v_tpop_berjahrundmassnjahr."Jahr",
  apflora.tpopber.id AS "TPopBer Id",
  apflora.tpopber.jahr AS "TPopBer Jahr",
  tpop_entwicklung_werte.text AS "TPopBer Entwicklung",
  apflora.tpopber.bemerkungen AS "TPopBer Bemerkungen",
  apflora.tpopber.changed AS "TPopBer MutWann",
  apflora.tpopber.changed_by AS "TPopBer MutWer",
  apflora.tpopmassnber.jahr AS "TPopMassnBer Jahr",
  tpopmassn_erfbeurt_werte.text AS "TPopMassnBer Entwicklung",
  apflora.tpopmassnber.bemerkungen AS "TPopMassnBer Interpretation",
  apflora.tpopmassnber.changed AS "TPopMassnBer MutWann",
  apflora.tpopmassnber.changed_by AS "TPopMassnBer MutWer"
FROM
  ((((((((((apflora.ae_eigenschaften
  RIGHT JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  RIGHT JOIN
    (apflora.pop
    RIGHT JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.pop_status_werte ON apflora.pop."PopHerkunft" = pop_status_werte.code)
  LEFT JOIN
    apflora.pop_status_werte AS "domPopHerkunft_1"
    ON apflora.tpop.status = "domPopHerkunft_1".code)
  LEFT JOIN
    apflora.v_tpop_berjahrundmassnjahr
    ON apflora.tpop.id = apflora.v_tpop_berjahrundmassnjahr.id)
  LEFT JOIN
    apflora.tpopmassnber
    ON
      (apflora.v_tpop_berjahrundmassnjahr.id = apflora.tpopmassnber.tpop_id)
      AND (apflora.v_tpop_berjahrundmassnjahr."Jahr" = apflora.tpopmassnber.jahr))
  LEFT JOIN
    apflora.tpopmassn_erfbeurt_werte
    ON apflora.tpopmassnber.beurteilung = tpopmassn_erfbeurt_werte.code)
  LEFT JOIN
    apflora.tpopber
    ON
      (apflora.v_tpop_berjahrundmassnjahr."Jahr" = apflora.tpopber.jahr)
      AND (apflora.v_tpop_berjahrundmassnjahr.id = apflora.tpopber.tpop_id))
  LEFT JOIN
    apflora.tpop_entwicklung_werte
    ON apflora.tpopber.entwicklung = tpop_entwicklung_werte.code
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.v_tpop_berjahrundmassnjahr."Jahr";

DROP VIEW IF EXISTS apflora.v_pop_berjahrundmassnjahrvontpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_berjahrundmassnjahrvontpop AS
SELECT
  apflora.tpop.pop_id,
  apflora.v_tpop_berjahrundmassnjahr."Jahr"
FROM
  apflora.v_tpop_berjahrundmassnjahr
  INNER JOIN
    apflora.tpop
    ON apflora.v_tpop_berjahrundmassnjahr.id = apflora.tpop.id
GROUP BY
  apflora.tpop.pop_id,
  apflora.v_tpop_berjahrundmassnjahr."Jahr";

DROP VIEW IF EXISTS apflora.v_tpopber_mitletzterid CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopber_mitletzterid AS
SELECT
  apflora.tpopber.tpop_id,
  apflora.v_tpopber_letzteid."AnzTPopBer",
  apflora.tpopber.id,
  apflora.tpopber.jahr AS "TPopBer Jahr",
  apflora.tpop_entwicklung_werte.text AS "TPopBer Entwicklung",
  apflora.tpopber.bemerkungen AS "TPopBer Bemerkungen",
  apflora.tpopber.changed AS "TPopBer MutWann",
  apflora.tpopber.changed_by AS "TPopBer MutWer"
FROM
  apflora.v_tpopber_letzteid
  INNER JOIN
    apflora.tpopber
    ON
      (apflora.v_tpopber_letzteid."MaxTPopBerId" = apflora.tpopber.id)
      AND (apflora.v_tpopber_letzteid.tpop_id = apflora.tpopber.tpop_id)
  LEFT JOIN
    apflora.tpop_entwicklung_werte
    ON apflora.tpopber.entwicklung = tpop_entwicklung_werte.code;

-- funktioniert nicht, wenn letzeKontrolle als Unterabfrage eingebunden wird.
-- Grund: Unterabfragen in der FROM-Klausel duerfen keine korrellierten Unterabfragen sein
DROP VIEW IF EXISTS apflora.v_tpop_anzkontrinklletzter CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_anzkontrinklletzter AS
SELECT
  apflora.v_tpop_letzteKontrId.id,
  apflora.v_tpop."ApArtId",
  apflora.v_tpop."Familie",
  apflora.v_tpop."AP Art",
  apflora.v_tpop."AP Status",
  apflora.v_tpop."AP Start im Jahr",
  apflora.v_tpop."AP Stand Umsetzung",
  apflora.v_tpop."AP verantwortlich",
  apflora.v_tpop."PopId",
  apflora.v_tpop."Pop Guid",
  apflora.v_tpop."Pop Nr",
  apflora.v_tpop."Pop Name",
  apflora.v_tpop."Pop Status",
  apflora.v_tpop."Pop bekannt seit",
  apflora.v_tpop."Pop Status unklar",
  apflora.v_tpop."Pop Begruendung fuer unklaren Status",
  apflora.v_tpop."Pop X-Koordinaten",
  apflora.v_tpop."Pop Y-Koordinaten",
  apflora.v_tpop."TPop ID",
  apflora.v_tpop."TPop Nr",
  apflora.v_tpop."TPop Gemeinde",
  apflora.v_tpop."TPop Flurname",
  apflora.v_tpop."TPop Status",
  apflora.v_tpop."TPop bekannt seit",
  apflora.v_tpop."TPop Status unklar",
  apflora.v_tpop."TPop Begruendung fuer unklaren Status",
  apflora.v_tpop."TPop X-Koordinaten",
  apflora.v_tpop."TPop Y-Koordinaten",
  apflora.v_tpop."TPop Radius (m)",
  apflora.v_tpop."TPop Hoehe",
  apflora.v_tpop."TPop Exposition",
  apflora.v_tpop."TPop Klima",
  apflora.v_tpop."TPop Hangneigung",
  apflora.v_tpop."TPop Beschreibung",
  apflora.v_tpop."TPop Kataster-Nr",
  apflora.v_tpop."TPop fuer AP-Bericht relevant",
  apflora.v_tpop."TPop EigentuemerIn",
  apflora.v_tpop."TPop Kontakt vor Ort",
  apflora.v_tpop."TPop Nutzungszone",
  apflora.v_tpop."TPop BewirtschafterIn",
  apflora.v_tpop."TPop Bewirtschaftung",
  apflora.v_tpop."Teilpopulation zuletzt geaendert",
  apflora.v_tpop."Teilpopulation zuletzt geaendert von",
  apflora.v_tpop_letzteKontrId."AnzTPopKontr" AS "TPop Anzahl Kontrollen",
  apflora.v_tpopkontr.id as "Kontr id",
  apflora.v_tpopkontr."Kontr Jahr",
  apflora.v_tpopkontr."Kontr Datum",
  apflora.v_tpopkontr."Kontr Typ",
  apflora.v_tpopkontr."Kontr BearbeiterIn",
  apflora.v_tpopkontr."Kontr Ueberlebensrate",
  apflora.v_tpopkontr."Kontr Vitalitaet",
  apflora.v_tpopkontr."Kontr Entwicklung",
  apflora.v_tpopkontr."Kontr Ursachen",
  apflora.v_tpopkontr."Kontr Erfolgsbeurteilung",
  apflora.v_tpopkontr."Kontr Aenderungs-Vorschlaege Umsetzung",
  apflora.v_tpopkontr."Kontr Aenderungs-Vorschlaege Kontrolle",
  apflora.v_tpopkontr."Kontr X-Koord",
  apflora.v_tpopkontr."Kontr Y-Koord",
  apflora.v_tpopkontr."Kontr Bemerkungen",
  apflora.v_tpopkontr."Kontr Lebensraum Delarze",
  apflora.v_tpopkontr."Kontr angrenzender Lebensraum Delarze",
  apflora.v_tpopkontr."Kontr Vegetationstyp",
  apflora.v_tpopkontr."Kontr Konkurrenz",
  apflora.v_tpopkontr."Kontr Moosschicht",
  apflora.v_tpopkontr."Kontr Krautschicht",
  apflora.v_tpopkontr."Kontr Strauchschicht",
  apflora.v_tpopkontr."Kontr Baumschicht",
  apflora.v_tpopkontr."Kontr Bodentyp",
  apflora.v_tpopkontr."Kontr Boden Kalkgehalt",
  apflora.v_tpopkontr."Kontr Boden Durchlaessigkeit",
  apflora.v_tpopkontr."Kontr Boden Humusgehalt",
  apflora.v_tpopkontr."Kontr Boden Naehrstoffgehalt",
  apflora.v_tpopkontr."Kontr Oberbodenabtrag",
  apflora.v_tpopkontr."Kontr Wasserhaushalt",
  apflora.v_tpopkontr."Kontr Uebereinstimmung mit Idealbiotop",
  apflora.v_tpopkontr."Kontr Handlungsbedarf",
  apflora.v_tpopkontr."Kontr Ueberpruefte Flaeche",
  apflora.v_tpopkontr."Kontr Flaeche der Teilpopulation m2",
  apflora.v_tpopkontr."Kontr auf Plan eingezeichnet",
  apflora.v_tpopkontr."Kontr Deckung durch Vegetation",
  apflora.v_tpopkontr."Kontr Deckung nackter Boden",
  apflora.v_tpopkontr."Kontr Deckung durch ueberpruefte Art",
  apflora.v_tpopkontr."Kontr auch junge Pflanzen",
  apflora.v_tpopkontr."Kontr maximale Veg-hoehe cm",
  apflora.v_tpopkontr."Kontr mittlere Veg-hoehe cm",
  apflora.v_tpopkontr."Kontr Gefaehrdung",
  apflora.v_tpopkontr."Kontrolle zuletzt geaendert",
  apflora.v_tpopkontr."Kontrolle zuletzt geaendert von",
  apflora.v_tpopkontr."Zaehlungen Anzahlen",
  apflora.v_tpopkontr."Zaehlungen Einheiten",
  apflora.v_tpopkontr."Zaehlungen Methoden"
FROM
  (apflora.v_tpop_letzteKontrId
  LEFT JOIN
    apflora.v_tpopkontr
    ON apflora.v_tpop_letzteKontrId."MaxTPopKontrId" = apflora.v_tpopkontr.id::text)
  INNER JOIN
    apflora.v_tpop
    ON apflora.v_tpop_letzteKontrId.id = apflora.v_tpop."TPop ID";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_erloschenundrelevantaberletztebeobvor1950 CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_erloschenundrelevantaberletztebeobvor1950 AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'erloschene Teilpopulation "Fuer AP-Bericht relevant" aber letzte Beobachtung vor 1950:' AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop.status IN (101, 202, 211)
  AND apflora.tpop.apber_relevant = 1
  AND apflora.tpop.id NOT IN (
    SELECT DISTINCT
      apflora.tpopkontr.tpop_id
    FROM
      apflora.tpopkontr
      INNER JOIN
        apflora.tpopkontrzaehl
        ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id
    WHERE
      apflora.tpopkontr.typ NOT IN ('Zwischenziel', 'Ziel')
      AND apflora.tpopkontrzaehl.anzahl > 0
  )
  AND apflora.tpop.id IN (
    SELECT apflora.tpopbeob.tpop_id
    FROM
      apflora.tpopbeob
      INNER JOIN
        apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr
        ON apflora.tpopbeob.tpop_id = apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr.id
    WHERE
      apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr."MaxJahr" < 1950
  )
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopberaktuell CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenletzterpopberaktuell AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "erloschen", der letzte Populations-Bericht meldet aber "aktuell":' AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
    INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.popber
      INNER JOIN
        apflora.v_pop_letzterpopber0_overall
        ON
          (v_pop_letzterpopber0_overall.jahr = apflora.popber.jahr)
          AND (v_pop_letzterpopber0_overall.pop_id = apflora.popber.pop_id))
      ON apflora.popber.pop_id = apflora.pop."PopId")
    INNER JOIN
      apflora.tpop
      ON apflora.tpop.pop_id = apflora.pop."PopId"
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.popber.entwicklung < 8
  AND apflora.pop."PopHerkunft" IN (101, 202, 211)
  AND apflora.tpop.apber_relevant = 1;

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletzterpopberaktuell CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletzterpopberaktuell AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Teilpopulation: Status ist "erloschen", der letzte Teilpopulations-Bericht meldet aber "aktuell":' AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr)]::text[] AS text
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
            (v_tpop_letztertpopber0_overall.tpopber_jahr = apflora.tpopber.jahr)
            AND (v_tpop_letztertpopber0_overall.tpop_id = apflora.tpopber.tpop_id))
        ON apflora.tpopber.tpop_id = apflora.tpop.id)
      ON apflora.tpop.pop_id = apflora.pop."PopId"
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.tpopber.entwicklung < 8
  AND apflora.tpop.status IN (101, 202, 211)
  AND apflora.tpop.id NOT IN (
    -- Ansiedlungen since apflora.tpopber.jahr
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop.id
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > apflora.tpopber.jahr
  );

DROP VIEW IF EXISTS apflora.v_exportevab_beob CASCADE;
CREATE OR REPLACE VIEW apflora.v_exportevab_beob AS
SELECT
  apflora.tpopkontr.zeit_id AS "fkZeitpunkt",
  apflora.tpopkontr.id AS "idBeobachtung",
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
    WHEN apflora.tpop.status < 200 THEN 4
    WHEN EXISTS(
      SELECT
        apflora.tpopmassn.tpop_id
      FROM
        apflora.tpopmassn
      WHERE
        apflora.tpopmassn.tpop_id = apflora.tpopkontr.tpop_id
        AND apflora.tpopmassn.typ BETWEEN 1 AND 3
        AND apflora.tpopmassn.jahr <= apflora.tpopkontr.jahr
    ) THEN 6
    WHEN apflora.tpop.status_unklar = 1 THEN 3
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
          apflora.tpopber.tpop_id = apflora.tpopkontr.tpop_id
          AND apflora.tpopber.entwicklung = 8
          AND apflora.tpopber.jahr = apflora.tpopkontr.jahr
      )
    ) THEN 2
    WHEN apflora.v_tpopkontr_maxanzahl.anzahl = 0 THEN 3
    ELSE 1
  END AS "fkAAPRESENCE",
  apflora.tpopkontr.gefaehrdung AS "MENACES",
  substring(apflora.tpopkontr.vitalitaet from 1 for 200) AS "VITALITE_PLANTE",
  substring(apflora.tpop.beschreibung from 1 for 244) AS "STATION",
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
          ON apflora.tpopkontr.bearbeiter = apflora.adresse."AdrId")
        INNER JOIN
          apflora.v_tpopkontr_maxanzahl
          ON apflora.v_tpopkontr_maxanzahl.id = apflora.tpopkontr.id)
        LEFT JOIN
          ((apflora.tpopkontrzaehl
          LEFT JOIN
            apflora.tpopkontrzaehl_einheit_werte
            ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code)
          LEFT JOIN
            apflora.tpopkontrzaehl_methode_werte
            ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code)
          ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  -- keine Testarten
  apflora.ap."ApArtId" > 150
  AND apflora.ap."ApArtId" < 1000000
  -- nur Kontrollen, deren Teilpopulationen Koordinaten besitzen
  AND apflora.tpop.x IS NOT NULL
  AND apflora.tpop.y IS NOT NULL
  AND apflora.tpopkontr.typ IN ('Ausgangszustand', 'Zwischenbeurteilung', 'Freiwilligen-Erfolgskontrolle')
  -- keine Ansaatversuche
  AND apflora.tpop.status <> 201
  -- nur wenn Kontrolljahr existiert
  AND apflora.tpopkontr.jahr IS NOT NULL
  -- keine Kontrollen aus dem aktuellen Jahr - die wurden ev. noch nicht verifiziert
  AND apflora.tpopkontr.jahr <> date_part('year', CURRENT_DATE)
  -- nur wenn erfasst ist, seit wann die TPop bekannt ist
  AND apflora.tpop.bekannt_seit IS NOT NULL
  AND (
    -- die Teilpopulation ist ursprünglich
    apflora.tpop.status IN (100, 101)
    -- oder bei Ansiedlungen: die Art war mindestens 5 Jahre vorhanden
    OR (apflora.tpopkontr.jahr - apflora.tpop.bekannt_seit) > 5
  )
  AND apflora.tpop.flurname IS NOT NULL
  AND apflora.ap."ApGuid" IN (Select "idProjekt" FROM apflora.v_exportevab_projekt)
  AND apflora.pop."PopGuid" IN (SELECT "idRaum" FROM apflora.v_exportevab_raum)
  AND apflora.tpop.id IN (SELECT "idOrt" FROM apflora.v_exportevab_ort)
  AND apflora.tpopkontr.zeit_id IN (SELECT "idZeitpunkt" FROM apflora.v_exportevab_zeit)
GROUP BY
  apflora.tpopkontr.zeit_id,
  apflora.tpopkontr.tpop_id,
  apflora.tpopkontr.id,
  apflora.tpopkontr.jahr,
  apflora.adresse."EvabIdPerson",
  apflora.ap."ApArtId",
  "fkAAINTRODUIT",
  apflora.v_tpopkontr_maxanzahl.anzahl,
  apflora.tpopkontr.gefaehrdung,
  apflora.tpopkontr.vitalitaet,
  apflora.tpop.beschreibung,
  "tblAdresse_2"."EvabIdPerson",
  "tblAdresse_2"."AdrName";

DROP VIEW IF EXISTS apflora.v_popmassnber_anzmassn CASCADE;
CREATE OR REPLACE VIEW apflora.v_popmassnber_anzmassn AS
SELECT
  apflora.ae_eigenschaften.taxid AS "AP ApArtId",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte.text AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.pop."MutWann" AS "Datensatz zuletzt geaendert",
  apflora.pop."MutWer" AS "Datensatz zuletzt geaendert von",
  apflora.popmassnber.id AS "PopMassnBer Id",
  apflora.popmassnber.jahr AS "PopMassnBer Jahr",
  tpopmassn_erfbeurt_werte.text AS "PopMassnBer Entwicklung",
  apflora.popmassnber.bemerkungen AS "PopMassnBer Interpretation",
  apflora.popmassnber.changed AS "PopMassnBer MutWann",
  apflora.popmassnber.changed_by AS "PopMassnBer MutWer",
  apflora.v_popmassnber_anzmassn0."AnzahlMassnahmen"
FROM
  ((((((apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte.code)
  INNER JOIN
    apflora.popmassnber
      LEFT JOIN
      apflora.v_popmassnber_anzmassn0
      on apflora.v_popmassnber_anzmassn0.pop_id = apflora.popmassnber.pop_id and apflora.v_popmassnber_anzmassn0.jahr = apflora.popmassnber.jahr
    ON apflora.pop."PopId" = apflora.popmassnber.pop_id)
  LEFT JOIN
    apflora.tpopmassn_erfbeurt_werte
    ON apflora.popmassnber.beurteilung = tpopmassn_erfbeurt_werte.code
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr";