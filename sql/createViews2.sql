/*
 * diese Views hängen von anderen ab, die in viewsGenerieren.sql erstellt werden
 * daher muss diese Date NACH viewsGenerieren.sql ausgeführt werden
 */

DROP VIEW IF EXISTS apflora.v_ap_massnjahre CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_massnjahre AS
SELECT
  apflora.ap."ApArtId",
  apflora.v_massn_jahre."TPopMassnJahr"
FROM
  apflora.ap,
  apflora.v_massn_jahre
WHERE
  apflora.ap."ApArtId" > 0
  AND apflora.ap."ApStatus" < 4
ORDER BY
  apflora.ap."ApArtId",
  apflora.v_massn_jahre."TPopMassnJahr";

DROP VIEW IF EXISTS apflora.v_ap_anzmassnprojahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_anzmassnprojahr AS
SELECT
  apflora.v_ap_massnjahre."ApArtId",
  apflora.v_ap_massnjahre."TPopMassnJahr",
  COALESCE(apflora.v_ap_anzmassnprojahr0."AnzahlvonTPopMassnId", 0) AS "AnzahlMassnahmen"
FROM
  apflora.v_ap_massnjahre
  LEFT JOIN
    apflora.v_ap_anzmassnprojahr0
    ON
      (apflora.v_ap_massnjahre."TPopMassnJahr" = apflora.v_ap_anzmassnprojahr0."TPopMassnJahr")
      AND (apflora.v_ap_massnjahre."ApArtId" = apflora.v_ap_anzmassnprojahr0."ApArtId")
ORDER BY
  apflora.v_ap_massnjahre."ApArtId",
  apflora.v_ap_massnjahre."TPopMassnJahr";

DROP VIEW IF EXISTS apflora.v_ap_anzmassnbisjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_anzmassnbisjahr AS
SELECT
  apflora.v_ap_massnjahre."ApArtId",
  apflora.v_ap_massnjahre."TPopMassnJahr",
  sum(apflora.v_ap_anzmassnprojahr."AnzahlMassnahmen") AS "AnzahlMassnahmen"
FROM
  apflora.v_ap_massnjahre
  INNER JOIN
    apflora.v_ap_anzmassnprojahr
    ON apflora.v_ap_massnjahre."ApArtId" = apflora.v_ap_anzmassnprojahr."ApArtId"
WHERE
  apflora.v_ap_anzmassnprojahr."TPopMassnJahr" <= apflora.v_ap_massnjahre."TPopMassnJahr"
GROUP BY
  apflora.v_ap_massnjahre."ApArtId",
  apflora.v_ap_massnjahre."TPopMassnJahr"
ORDER BY
  apflora.v_ap_massnjahre."ApArtId",
  apflora.v_ap_massnjahre."TPopMassnJahr";

DROP VIEW IF EXISTS apflora.v_ap_apberundmassn CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_apberundmassn AS
SELECT
  apflora.ap."ApArtId",
  beob.adb_eigenschaften."Artname" AS "Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP Verantwortlich",
  apflora.ap."ApArtwert" AS "Artwert",
  apflora.v_ap_anzmassnprojahr."TPopMassnJahr" AS "Jahr",
  apflora.v_ap_anzmassnprojahr."AnzahlMassnahmen" AS "Anzahl Massnahmen",
  apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" AS "Anzahl Massnahmen bisher",
  CASE
    WHEN apflora.apber."JBerJahr" > 0
    THEN 'Ja'
    ELSE 'Nein'
  END AS "Bericht erstellt"
FROM
  beob.adb_eigenschaften
    INNER JOIN
      ((((apflora.ap
      LEFT JOIN
        apflora.ap_bearbstand_werte
        ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
      LEFT JOIN
        apflora.ap_umsetzung_werte
        ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
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
              (apflora.v_ap_anzmassnbisjahr."TPopMassnJahr" = apflora.apber."JBerJahr")
              AND (apflora.v_ap_anzmassnbisjahr."ApArtId" = apflora.apber."ApArtId"))
          ON
            (apflora.v_ap_anzmassnprojahr."TPopMassnJahr" = apflora.v_ap_anzmassnbisjahr."TPopMassnJahr")
            AND (apflora.v_ap_anzmassnprojahr."ApArtId" = apflora.v_ap_anzmassnbisjahr."ApArtId"))
        ON apflora.ap."ApArtId" = apflora.v_ap_anzmassnprojahr."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.v_ap_anzmassnprojahr."TPopMassnJahr";

DROP VIEW IF EXISTS apflora.v_tpop_letztermassnber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_letztermassnber AS
SELECT
  apflora.v_tpop_letztermassnber0."ApArtId",
  apflora.v_tpop_letztermassnber0."TPopId",
  max(apflora.v_tpop_letztermassnber0."TPopMassnBerJahr") AS "MaxvonTPopMassnBerJahr"
FROM
  apflora.v_tpop_letztermassnber0
GROUP BY
  apflora.v_tpop_letztermassnber0."ApArtId",
  apflora.v_tpop_letztermassnber0."TPopId";

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

DROP VIEW IF EXISTS apflora.v_pop_letztermassnber CASCADE;
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

-- dieser view ist für den Bericht gedacht - daher letzter popber vor jBerJahr
DROP VIEW IF EXISTS apflora.v_pop_letzterpopber CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_letzterpopber AS
SELECT
  apflora.v_pop_letzterpopber0."ApArtId",
  apflora.v_pop_letzterpopber0."PopId",
  max(apflora.v_pop_letzterpopber0."PopBerJahr") AS "MaxvonPopBerJahr"
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
  apflora.v_pop_letzterpopber0_overall."PopBerJahr"
FROM
  (apflora.pop
  INNER JOIN
    apflora.v_pop_letzterpopber0_overall
    ON apflora.pop."PopId" = apflora.v_pop_letzterpopber0_overall."PopId")
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.v_pop_letzterpopber0_overall."PopBerJahr";

DROP VIEW IF EXISTS apflora.v_apber_uebe CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebe AS
SELECT
  apflora.apber.*,
  beob.adb_eigenschaften."Artname",
  apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      (apflora._variable
      INNER JOIN
        (apflora.apber
        INNER JOIN
          apflora.v_ap_anzmassnbisjahr
          ON apflora.apber."ApArtId" = apflora.v_ap_anzmassnbisjahr."ApArtId")
        ON apflora._variable."JBerJahr" = apflora.apber."JBerJahr")
      ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
    ON "tblKonstanten_1"."JBerJahr" = apflora.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.apber."JBerBeurteilung" = 1
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_apber_uebe_apid CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebe_apid AS
SELECT
  apflora.ap."ApArtId"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      (apflora._variable
      INNER JOIN
        (apflora.apber
        INNER JOIN
          apflora.v_ap_anzmassnbisjahr
          ON apflora.apber."ApArtId" = apflora.v_ap_anzmassnbisjahr."ApArtId")
        ON apflora._variable."JBerJahr" = apflora.apber."JBerJahr")
      ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
    ON "tblKonstanten_1"."JBerJahr" = apflora.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.apber."JBerBeurteilung" = 1
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3;

DROP VIEW IF EXISTS apflora.v_apber_uebkm CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebkm AS
SELECT
  beob.adb_eigenschaften."Artname",
  CASE
    WHEN beob.adb_eigenschaften."KefArt" = -1
    THEN 'Ja'
    ELSE ''
  END AS "FnsKefArt2",
  CASE
    WHEN Round((apflora._variable."JBerJahr" - beob.adb_eigenschaften."KefKontrolljahr") / 4,0) = (apflora._variable."JBerJahr" - beob.adb_eigenschaften."KefKontrolljahr") / 4
    THEN 'Ja'
    ELSE ''
  END AS "FnsKefKontrJahr2"
FROM
  (beob.adb_eigenschaften
    INNER JOIN
      ((apflora.v_ap_anzmassnbisjahr AS "vApAnzMassnBisJahr_1"
      INNER JOIN
        apflora.ap
        ON "vApAnzMassnBisJahr_1"."ApArtId" = apflora.ap."ApArtId")
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      (apflora.apber
      INNER JOIN
        apflora._variable
        ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
      ON
        (apflora._variable."JBerJahr" = "vApAnzMassnBisJahr_1"."TPopMassnJahr")
        AND (apflora.ap."ApArtId" = apflora.apber."ApArtId")
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
  AND "vApAnzMassnBisJahr_1"."AnzahlMassnahmen" = '0'
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_apber_uebma CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebma AS
SELECT
  beob.adb_eigenschaften."Artname",
  apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen"
FROM
  apflora._variable
  INNER JOIN
    ((beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      apflora.v_ap_anzmassnbisjahr
      ON apflora.ap."ApArtId" = apflora.v_ap_anzmassnbisjahr."ApArtId")
    ON apflora._variable."JBerJahr" = apflora.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_apber_uebma_apid CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebma_apid AS
SELECT
  apflora.ap."ApArtId"
FROM
  apflora._variable
  INNER JOIN
    ((beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      apflora.v_ap_anzmassnbisjahr
      ON apflora.ap."ApArtId" = apflora.v_ap_anzmassnbisjahr."ApArtId")
    ON apflora._variable."JBerJahr" = apflora.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3;

DROP VIEW IF EXISTS apflora.v_apber_uebme CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebme AS
SELECT
  apflora.apber.*,
  beob.adb_eigenschaften."Artname"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber."ApArtId" = apflora.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
      ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
    ON "tblKonstanten_1"."JBerJahr" = apflora.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  apflora.apber."JBerBeurteilung" = 5
  AND apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_apber_uebme_apid CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebme_apid AS
SELECT
  apflora.ap."ApArtId"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber."ApArtId" = apflora.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
      ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
    ON "tblKonstanten_1"."JBerJahr" = apflora.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  apflora.apber."JBerBeurteilung" = 5
  AND apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3;

DROP VIEW IF EXISTS apflora.v_apber_uebne CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebne AS
SELECT
  apflora.apber.*,
  beob.adb_eigenschaften."Artname"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber."ApArtId" = apflora.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
      ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
    ON "tblKonstanten_1"."JBerJahr" = apflora.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  apflora.apber."JBerBeurteilung" = 3
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3
  AND apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_apber_uebne_apid CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebne_apid AS
SELECT
  apflora.ap."ApArtId"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber."ApArtId" = apflora.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
      ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
    ON "tblKonstanten_1"."JBerJahr" = apflora.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  apflora.apber."JBerBeurteilung" = 3
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3
  AND apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0;

DROP VIEW IF EXISTS apflora.v_apber_uebse CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebse AS
SELECT
  apflora.apber.*,
  beob.adb_eigenschaften."Artname"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber."ApArtId" = apflora.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
  ON "tblKonstanten_1"."JBerJahr" = apflora.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  apflora.apber."JBerBeurteilung" = 4
  AND apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_apber_uebse_apid CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebse_apid AS
SELECT
  apflora.ap."ApArtId"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber."ApArtId" = apflora.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
  ON "tblKonstanten_1"."JBerJahr" = apflora.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  apflora.apber."JBerBeurteilung" = 4
  AND apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3;

DROP VIEW IF EXISTS apflora.v_apber_uebun CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebun AS
SELECT
  apflora.apber.*,
  beob.adb_eigenschaften."Artname"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap INNER JOIN apflora.v_ap_apberrelevant ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber."ApArtId" = apflora.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
  ON "tblKonstanten_1"."JBerJahr" = apflora.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  apflora.apber."JBerBeurteilung" = 1168274204
  AND apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_apber_uebun_apid CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebun_apid AS
SELECT
  apflora.ap."ApArtId"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap INNER JOIN apflora.v_ap_apberrelevant ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber."ApArtId" = apflora.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
  ON "tblKonstanten_1"."JBerJahr" = apflora.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  apflora.apber."JBerBeurteilung" = 1168274204
  AND apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3;

DROP VIEW IF EXISTS apflora.v_apber_uebwe CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebwe AS
SELECT
  apflora.apber.*,
  beob.adb_eigenschaften."Artname"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber."ApArtId" = apflora.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
      ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
    ON "tblKonstanten_1"."JBerJahr" = apflora.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  apflora.apber."JBerBeurteilung" = 6
  AND apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_apber_uebwe_apid CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebwe_apid AS
SELECT
  apflora.ap."ApArtId"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber."ApArtId" = apflora.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
      ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
    ON "tblKonstanten_1"."JBerJahr" = apflora.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  apflora.apber."JBerBeurteilung" = 6
  AND apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3;

DROP VIEW IF EXISTS apflora.v_apber_uebnb000 CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebnb000 AS
SELECT
  apflora.ap."ApArtId",
  apflora.apber."JBerJahr"
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
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
  INNER JOIN
    apflora._variable
    ON apflora.v_ap_anzmassnbisjahr."TPopMassnJahr" = apflora._variable."JBerJahr"
WHERE
  apflora.apber."ApArtId" IS NULL
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3;

DROP VIEW IF EXISTS apflora.v_apber_uebnb00 CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebnb00 AS
SELECT
  apflora.ap."ApArtId",
  apflora.apber."JBerJahr"
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
        ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
      ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
    ON "tblKonstanten_1"."JBerJahr" = apflora.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
  AND apflora.apber."JBerBeurteilung" IS NULL;

DROP VIEW IF EXISTS apflora.v_apber_uebnb0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebnb0 AS
SELECT
  "ApArtId",
  "JBerJahr"
FROM
  apflora.v_apber_uebnb000
UNION SELECT
  "ApArtId",
  "JBerJahr"
FROM
  apflora.v_apber_uebnb00;

DROP VIEW IF EXISTS apflora.v_apber_uebnb CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebnb AS
SELECT
 apflora.ap."ApArtId",
  beob.adb_eigenschaften."Artname"
FROM
  beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
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
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_apber_uet01 CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uet01 AS
SELECT
  apflora.ap."ApArtId",
  beob.adb_eigenschaften."Artname",
  CASE
    WHEN apflora.ap."ApArtId" NOT IN (SELECT * FROM apflora.v_apber_uebma_apid)
    THEN 1
    ELSE 0
  END AS "keineMassnahmen",
  CASE
    WHEN beob.adb_eigenschaften."KefArt" = -1
    THEN 1
    ELSE 0
  END AS "FnsKefArt",
  CASE
    WHEN Round((apflora._variable."JBerJahr" - beob.adb_eigenschaften."KefKontrolljahr") / 4, 0) = (apflora._variable."JBerJahr" - beob.adb_eigenschaften."KefKontrolljahr") / 4
    THEN 1
    ELSE 0
  END AS "FnsKefKontrJahr"
FROM
  beob.adb_eigenschaften
  INNER JOIN
    ((apflora.ap
    INNER JOIN
      (apflora.v_ap_anzmassnbisjahr
      INNER JOIN
        apflora._variable
        ON apflora.v_ap_anzmassnbisjahr."TPopMassnJahr" = apflora._variable."JBerJahr")
      ON apflora.ap."ApArtId" = apflora.v_ap_anzmassnbisjahr."ApArtId")
    INNER JOIN
      apflora.v_ap_apberrelevant
      ON apflora.ap."ApArtId" = apflora.v_ap_apberrelevant."ApArtId")
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_apber_uet_veraengegenvorjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uet_veraengegenvorjahr AS
SELECT
  apflora.ap."ApArtId",
  apflora.apber."JBerVeraenGegenVorjahr",
  apflora.apber."JBerJahr"
FROM
  apflora.ap
  LEFT JOIN
    apflora.apber
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
  AND (
    apflora.apber."JBerJahr" IN (SELECT apflora._variable."JBerJahr" FROM apflora._variable)
    Or apflora.apber."JBerJahr" IS NULL
  );

DROP VIEW IF EXISTS apflora.v_tpop_statuswidersprichtbericht CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_statuswidersprichtbericht AS
SELECT
  beob.adb_eigenschaften."Artname" AS "Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "Bearbeitungsstand AP",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname",
  apflora.tpop."TPopHerkunft",
  apflora.tpopber."TPopBerEntwicklung",
  apflora.tpopber."TPopBerJahr"
FROM
  ((beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopber
        INNER JOIN
          apflora.v_tpopber_letzterber
          ON
            (apflora.tpopber."TPopId" = apflora.v_tpopber_letzterber."TPopId")
            AND (apflora.tpopber."TPopBerJahr" = apflora.v_tpopber_letzterber."MaxvonTPopBerJahr"))
        ON apflora.tpop."TPopId" = apflora.tpopber."TPopId")
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
    AND apflora.tpopber."TPopBerEntwicklung" <> 8
  )
  OR (
    apflora.ap."ApStatus" < 4
    AND apflora.tpop."TPopHerkunft" NOT IN (101, 202)
    AND apflora.tpopber."TPopBerEntwicklung" = 8
  )
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname";

-- im Gebrauch (Access):
DROP VIEW IF EXISTS apflora.v_apber_injahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_injahr AS
SELECT
  apflora.ap.*,
  beob.adb_eigenschaften."Artname" AS "Art",
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
  apflora.apber."JBerDTxt",
  apflora.apber."JBerDatum",
  apflora.apber."JBerBearb",
  concat(apflora.adresse."AdrName", ', ', apflora.adresse."AdrAdresse") AS "Bearbeiter",
  apflora.apberuebersicht."JbuJahr",
  apflora.apberuebersicht."JbuBemerkungen",
  apflora.v_erstemassnproap."MinvonTPopMassnJahr" AS "ErsteMassnahmeImJahr"
FROM
  (beob.adb_eigenschaften
  INNER JOIN
    (apflora.ap
    LEFT JOIN
      apflora.v_erstemassnproap
      ON apflora.ap."ApArtId" = apflora.v_erstemassnproap."ApArtId")
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    (((apflora.apber
    LEFT JOIN
      apflora.adresse
      ON apflora.apber."JBerBearb" = apflora.adresse."AdrId")
    LEFT JOIN
      apflora.apberuebersicht
      ON apflora.apber."JBerJahr" = apflora.apberuebersicht."JbuJahr")
    INNER JOIN
      apflora._variable
      ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId"
WHERE
  apflora.ap."ApStatus" < 4
  AND apflora.ap."ApArtId" > 150
ORDER BY
  beob.adb_eigenschaften."Artname";

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
      (apflora.pop."PopId" = apflora.popber."PopId")
      AND (apflora.v_pop_letzterpopber."PopId" = apflora.popber."PopId")
      AND (apflora.v_pop_letzterpopber."MaxvonPopBerJahr" = apflora.popber."PopBerJahr"))
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.popber."PopBerEntwicklung" = 3
  AND apflora.tpop."TPopApBerichtRelevant" = 1
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
      (apflora.pop."PopId" = apflora.popber."PopId")
      AND (apflora.v_pop_letzterpopber."PopId" = apflora.popber."PopId")
      AND (apflora.v_pop_letzterpopber."MaxvonPopBerJahr" = apflora.popber."PopBerJahr"))
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.popber."PopBerEntwicklung" = 2
  AND apflora.tpop."TPopApBerichtRelevant" = 1
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
      (apflora.pop."PopId" = apflora.popber."PopId")
      AND (apflora.v_pop_letzterpopber."PopId" = apflora.popber."PopId")
      AND (apflora.v_pop_letzterpopber."MaxvonPopBerJahr" = apflora.popber."PopBerJahr"))
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.popber."PopBerEntwicklung" = 1
  AND apflora.tpop."TPopApBerichtRelevant" = 1
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
      (apflora.pop."PopId" = apflora.popber."PopId")
      AND (apflora.v_pop_letzterpopber."PopId" = apflora.popber."PopId")
      AND (apflora.v_pop_letzterpopber."MaxvonPopBerJahr" = apflora.popber."PopBerJahr"))
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  (
    apflora.popber."PopBerEntwicklung" = 4
    OR apflora.popber."PopBerEntwicklung" = 9
  )
  AND apflora.tpop."TPopApBerichtRelevant" = 1
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
      (apflora.pop."PopId" = apflora.popber."PopId")
      AND (apflora.v_pop_letzterpopber."PopId" = apflora.popber."PopId")
      AND (apflora.v_pop_letzterpopber."MaxvonPopBerJahr" = apflora.popber."PopBerJahr"))
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.popber."PopBerEntwicklung" = 8
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

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
        (apflora.tpopber."TPopId" = apflora.v_tpop_letztertpopber."TPopId")
        AND (apflora.tpopber."TPopBerJahr" = apflora.v_tpop_letztertpopber."MaxvonTPopBerJahr"))
    ON
      (apflora.tpop."PopId" = apflora.pop."PopId")
      AND (apflora.tpop."TPopId" = apflora.tpopber."TPopId")
WHERE
  apflora.tpopber."TPopBerEntwicklung" = 3
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
        (apflora.tpopber."TPopId" = apflora.v_tpop_letztertpopber."TPopId")
        AND (apflora.tpopber."TPopBerJahr" = apflora.v_tpop_letztertpopber."MaxvonTPopBerJahr"))
    ON
      (apflora.tpop."PopId" = apflora.pop."PopId")
      AND (apflora.tpop."TPopId" = apflora.tpopber."TPopId")
WHERE
  apflora.tpopber."TPopBerEntwicklung" = 2
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
        (apflora.tpopber."TPopId" = apflora.v_tpop_letztertpopber."TPopId")
        AND (apflora.tpopber."TPopBerJahr" = apflora.v_tpop_letztertpopber."MaxvonTPopBerJahr"))
    ON
      (apflora.tpop."PopId" = apflora.pop."PopId")
      AND (apflora.tpop."TPopId" = apflora.tpopber."TPopId")
WHERE
  apflora.tpopber."TPopBerEntwicklung" = 1
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
        (apflora.tpopber."TPopId" = apflora.v_tpop_letztertpopber."TPopId")
        AND (apflora.tpopber."TPopBerJahr" = apflora.v_tpop_letztertpopber."MaxvonTPopBerJahr"))
    ON
      (apflora.tpop."PopId" = apflora.pop."PopId")
      AND (apflora.tpop."TPopId" = apflora.tpopber."TPopId")
WHERE
  apflora.tpopber."TPopBerEntwicklung" = 4
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
        (apflora.tpopber."TPopId" = apflora.v_tpop_letztertpopber."TPopId")
        AND (apflora.tpopber."TPopBerJahr" = apflora.v_tpop_letztertpopber."MaxvonTPopBerJahr"))
    ON
      (apflora.tpop."PopId" = apflora.pop."PopId")
      AND (apflora.tpop."TPopId" = apflora.tpopber."TPopId")
WHERE
  apflora.tpopber."TPopBerEntwicklung" = 8
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

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
    ON apflora.pop."PopId" = apflora.tpop."PopId")
  INNER JOIN
    apflora.tpopmassn
    ON apflora.tpop."TPopId" = apflora.tpopmassn."TPopId"
WHERE
  apflora.tpopmassn."TPopMassnJahr" <= apflora._variable."JBerJahr"
  AND apflora.tpop."TPopApBerichtRelevant" = 1
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
      (apflora.pop."PopId" = apflora.popmassnber."PopId")
      AND (apflora.v_pop_letztermassnber."MaxvonPopMassnBerJahr" = apflora.popmassnber."PopMassnBerJahr")
      AND (apflora.v_pop_letztermassnber."PopId" = apflora.popmassnber."PopId")
WHERE
  apflora.popmassnber."PopMassnBerErfolgsbeurteilung" = 1
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
      (apflora.pop."PopId" = apflora.popmassnber."PopId")
      AND (apflora.v_pop_letztermassnber."MaxvonPopMassnBerJahr" = apflora.popmassnber."PopMassnBerJahr")
      AND (apflora.v_pop_letztermassnber."PopId" = apflora.popmassnber."PopId")
WHERE
  apflora.popmassnber."PopMassnBerErfolgsbeurteilung" = 2
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
      (apflora.pop."PopId" = apflora.popmassnber."PopId")
      AND (apflora.v_pop_letztermassnber."MaxvonPopMassnBerJahr" = apflora.popmassnber."PopMassnBerJahr")
      AND (apflora.v_pop_letztermassnber."PopId" = apflora.popmassnber."PopId")
WHERE
  apflora.popmassnber."PopMassnBerErfolgsbeurteilung" = 3
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
      (apflora.pop."PopId" = apflora.popmassnber."PopId")
      AND (apflora.v_pop_letztermassnber."PopId" = apflora.popmassnber."PopId")
      AND (apflora.v_pop_letztermassnber."MaxvonPopMassnBerJahr" = apflora.popmassnber."PopMassnBerJahr")
WHERE
  apflora.popmassnber."PopMassnBerErfolgsbeurteilung" = 4
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
      (apflora.pop."PopId" = apflora.popmassnber."PopId")
      AND (apflora.v_pop_letztermassnber."PopId" = apflora.popmassnber."PopId")
      AND (apflora.v_pop_letztermassnber."MaxvonPopMassnBerJahr" = apflora.popmassnber."PopMassnBerJahr")
WHERE
  apflora.popmassnber."PopMassnBerErfolgsbeurteilung" = 5
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_c3rtpop CASCADE;
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
        (apflora.v_tpop_letztermassnber."TPopId" = apflora.tpopmassnber."TPopId")
        AND (apflora.v_tpop_letztermassnber."MaxvonTPopMassnBerJahr" = apflora.tpopmassnber."TPopMassnBerJahr"))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber."TPopId" = apflora.tpop."TPopId")
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopmassnber."TPopMassnBerErfolgsbeurteilung" = 1
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_c4rtpop CASCADE;
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
        (apflora.v_tpop_letztermassnber."TPopId" = apflora.tpopmassnber."TPopId")
        AND (apflora.v_tpop_letztermassnber."MaxvonTPopMassnBerJahr" = apflora.tpopmassnber."TPopMassnBerJahr"))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber."TPopId" = apflora.tpop."TPopId")
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  (apflora.tpopmassnber."TPopMassnBerErfolgsbeurteilung" = 2)
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_c5rtpop CASCADE;
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
        (apflora.v_tpop_letztermassnber."TPopId" = apflora.tpopmassnber."TPopId")
        AND (apflora.v_tpop_letztermassnber."MaxvonTPopMassnBerJahr" = apflora.tpopmassnber."TPopMassnBerJahr"))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber."TPopId" = apflora.tpop."TPopId")
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopmassnber."TPopMassnBerErfolgsbeurteilung" = 3
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_c6rtpop CASCADE;
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
        (apflora.v_tpop_letztermassnber."TPopId" = apflora.tpopmassnber."TPopId")
        AND (apflora.v_tpop_letztermassnber."MaxvonTPopMassnBerJahr" = apflora.tpopmassnber."TPopMassnBerJahr"))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber."TPopId" = apflora.tpop."TPopId")
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopmassnber."TPopMassnBerErfolgsbeurteilung" = 4
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_c7rtpop CASCADE;
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
        (apflora.v_tpop_letztermassnber."TPopId" = apflora.tpopmassnber."TPopId")
        AND (apflora.v_tpop_letztermassnber."MaxvonTPopMassnBerJahr" = apflora.tpopmassnber."TPopMassnBerJahr"))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber."TPopId" = apflora.tpop."TPopId")
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopmassnber."TPopMassnBerErfolgsbeurteilung" = 5
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_pop_popberundmassnber CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_popberundmassnber AS
SELECT
  beob.adb_eigenschaften."TaxonomieId" AS "AP ApArtId",
  beob.adb_eigenschaften."Artname" AS "AP Art",
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
  apflora.pop."MutWann" AS "Datensatz zuletzt geaendert",
  apflora.pop."MutWer" AS "Datensatz zuletzt geaendert von",
  apflora.v_pop_berundmassnjahre."Jahr",
  apflora.popber."PopBerId",
  apflora.popber."PopBerId" AS "PopBer Id",
  apflora.popber."PopBerJahr" AS "PopBer Jahr",
  pop_entwicklung_werte."EntwicklungTxt" AS "PopBer Entwicklung",
  apflora.popber."PopBerTxt" AS "PopBer Bemerkungen",
  apflora.popber."MutWann" AS "PopBer MutWann",
  apflora.popber."MutWer" AS "PopBer MutWer",
  apflora.popmassnber."PopMassnBerId",
  apflora.popmassnber."PopMassnBerId" AS "PopMassnBer Id",
  apflora.popmassnber."PopMassnBerJahr" AS "PopMassnBer Jahr",
  tpopmassn_erfbeurt_werte."BeurteilTxt" AS "PopMassnBer Entwicklung",
  apflora.popmassnber."PopMassnBerTxt" AS "PopMassnBer Interpretation",
  apflora.popmassnber."MutWann" AS "PopMassnBer MutWann",
  apflora.popmassnber."MutWer" AS "PopMassnBer MutWer"
FROM
  beob.adb_eigenschaften
  INNER JOIN
    (((apflora.ap
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
    INNER JOIN
      (((apflora.pop
      LEFT JOIN
        (apflora.v_pop_berundmassnjahre
        LEFT JOIN
          (apflora.popmassnber
          LEFT JOIN
            apflora.tpopmassn_erfbeurt_werte
            ON apflora.popmassnber."PopMassnBerErfolgsbeurteilung" = tpopmassn_erfbeurt_werte."BeurteilId")
          ON
            (apflora.v_pop_berundmassnjahre."Jahr" = apflora.popmassnber."PopMassnBerJahr")
            AND (apflora.v_pop_berundmassnjahre."PopId" = apflora.popmassnber."PopId"))
        ON apflora.pop."PopId" = apflora.v_pop_berundmassnjahre."PopId")
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
      LEFT JOIN
        (apflora.popber
        LEFT JOIN
          apflora.pop_entwicklung_werte
          ON apflora.popber."PopBerEntwicklung" = pop_entwicklung_werte."EntwicklungId")
        ON
          (apflora.v_pop_berundmassnjahre."Jahr" = apflora.popber."PopBerJahr")
          AND (apflora.v_pop_berundmassnjahre."PopId" = apflora.popber."PopId"))
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
WHERE
  beob.adb_eigenschaften."TaxonomieId" > 150
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.v_pop_berundmassnjahre."Jahr";

DROP VIEW IF EXISTS apflora.v_pop_mit_letzter_popber CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_mit_letzter_popber AS
SELECT
  beob.adb_eigenschaften."TaxonomieId" AS "AP ApArtId",
  beob.adb_eigenschaften."Artname" AS "AP Art",
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
  apflora.pop."MutWann" AS "Datensatz zuletzt geaendert",
  apflora.pop."MutWer" AS "Datensatz zuletzt geaendert von",
  apflora.popber."PopBerId" AS "PopBer Id",
  apflora.popber."PopBerJahr" AS "PopBer Jahr",
  pop_entwicklung_werte."EntwicklungTxt" AS "PopBer Entwicklung",
  apflora.popber."PopBerTxt" AS "PopBer Bemerkungen",
  apflora.popber."MutWann" AS "PopBer MutWann",
  apflora.popber."MutWer" AS "PopBer MutWer"
FROM
  beob.adb_eigenschaften
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
        (apflora.v_pop_letzterpopber0_overall
        LEFT JOIN
          (apflora.popber
          LEFT JOIN
            apflora.pop_entwicklung_werte
            ON apflora.popber."PopBerEntwicklung" = pop_entwicklung_werte."EntwicklungId")
          ON
            (apflora.v_pop_letzterpopber0_overall."PopBerJahr" = apflora.popber."PopBerJahr")
            AND (apflora.v_pop_letzterpopber0_overall."PopId" = apflora.popber."PopId"))
        ON apflora.pop."PopId" = apflora.v_pop_letzterpopber0_overall."PopId")
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
WHERE
  beob.adb_eigenschaften."TaxonomieId" > 150
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.v_pop_letzterpopber0_overall."PopBerJahr";

DROP VIEW IF EXISTS apflora.v_pop_mit_letzter_popmassnber CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_mit_letzter_popmassnber AS
SELECT
  beob.adb_eigenschaften."TaxonomieId" AS "AP ApArtId",
  beob.adb_eigenschaften."Artname" AS "AP Art",
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
  apflora.pop."MutWann" AS "Datensatz zuletzt geaendert",
  apflora.pop."MutWer" AS "Datensatz zuletzt geaendert von",
  apflora.popmassnber."PopMassnBerId" AS "PopMassnBer Id",
  apflora.popmassnber."PopMassnBerJahr" AS "PopMassnBer Jahr",
  tpopmassn_erfbeurt_werte."BeurteilTxt" AS "PopMassnBer Entwicklung",
  apflora.popmassnber."PopMassnBerTxt" AS "PopMassnBer Interpretation",
  apflora.popmassnber."MutWann" AS "PopMassnBer MutWann",
  apflora.popmassnber."MutWer" AS "PopMassnBer MutWer"
FROM
  beob.adb_eigenschaften
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
        (apflora.v_pop_letzterpopbermassn
        LEFT JOIN
          (apflora.popmassnber
          LEFT JOIN
            apflora.tpopmassn_erfbeurt_werte
            ON apflora.popmassnber."PopMassnBerErfolgsbeurteilung" = tpopmassn_erfbeurt_werte."BeurteilId")
          ON
            (apflora.v_pop_letzterpopbermassn."PopMassnBerJahr" = apflora.popmassnber."PopMassnBerJahr")
            AND (apflora.v_pop_letzterpopbermassn."PopId" = apflora.popmassnber."PopId"))
        ON apflora.pop."PopId" = apflora.v_pop_letzterpopbermassn."PopId")
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
WHERE
  beob.adb_eigenschaften."TaxonomieId" > 150
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.v_pop_letzterpopbermassn."PopMassnBerJahr";

DROP VIEW IF EXISTS apflora.v_tpop_popberundmassnber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_popberundmassnber AS
SELECT
  beob.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  beob.adb_eigenschaften."Artname" AS "AP Art",
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
  apflora.tpopmassnber."TPopMassnBerJahr" AS "TPopMassnBer Jahr",
  tpopmassn_erfbeurt_werte."BeurteilTxt" AS "TPopMassnBer Entwicklung",
  apflora.tpopmassnber."TPopMassnBerTxt" AS "TPopMassnBer Interpretation",
  apflora.tpopmassnber."MutWann" AS "TPopMassnBer MutWann",
  apflora.tpopmassnber."MutWer" AS "TPopMassnBer MutWer"
FROM
  ((((((((((beob.adb_eigenschaften
  RIGHT JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
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
      (apflora.v_tpop_berjahrundmassnjahr."TPopId" = apflora.tpopmassnber."TPopId")
      AND (apflora.v_tpop_berjahrundmassnjahr."Jahr" = apflora.tpopmassnber."TPopMassnBerJahr"))
  LEFT JOIN
    apflora.tpopmassn_erfbeurt_werte
    ON apflora.tpopmassnber."TPopMassnBerErfolgsbeurteilung" = tpopmassn_erfbeurt_werte."BeurteilId")
  LEFT JOIN
    apflora.tpopber
    ON
      (apflora.v_tpop_berjahrundmassnjahr."Jahr" = apflora.tpopber."TPopBerJahr")
      AND (apflora.v_tpop_berjahrundmassnjahr."TPopId" = apflora.tpopber."TPopId"))
  LEFT JOIN
    apflora.pop_entwicklung_werte
    ON apflora.tpopber."TPopBerEntwicklung" = pop_entwicklung_werte."EntwicklungId"
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.v_tpop_berjahrundmassnjahr."Jahr";

DROP VIEW IF EXISTS apflora.v_pop_berjahrundmassnjahrvontpop CASCADE;
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

DROP VIEW IF EXISTS apflora.v_tpopber_mitletzterid CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopber_mitletzterid AS
SELECT
  apflora.tpopber."TPopId",
  apflora.v_tpopber_letzteid."AnzTPopBer",
  apflora.tpopber."TPopBerId",
  apflora.tpopber."TPopBerJahr" AS "TPopBer Jahr",
  apflora.pop_entwicklung_werte."EntwicklungTxt" AS "TPopBer Entwicklung",
  apflora.tpopber."TPopBerTxt" AS "TPopBer Bemerkungen",
  apflora.tpopber."MutWann" AS "TPopBer MutWann",
  apflora.tpopber."MutWer" AS "TPopBer MutWer"
FROM
  apflora.v_tpopber_letzteid
  INNER JOIN
    apflora.tpopber
    ON
      (apflora.v_tpopber_letzteid."MaxTPopBerId" = apflora.tpopber."TPopBerId")
      AND (apflora.v_tpopber_letzteid."TPopId" = apflora.tpopber."TPopId")
  LEFT JOIN
    apflora.pop_entwicklung_werte
    ON apflora.tpopber."TPopBerEntwicklung" = pop_entwicklung_werte."EntwicklungId";

-- funktioniert nicht, wenn letzeKontrolle als Unterabfrage eingebunden wird. Grund: Unterabfragen in der FROM-Klausel duerfen keine korrellierten Unterabfragen sein
DROP VIEW IF EXISTS apflora.v_tpop_anzkontrinklletzter CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_anzkontrinklletzter AS
SELECT
  apflora.v_tpop_letzteKontrId."TPopId",
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
  apflora.v_tpop."TPop Guid",
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
  apflora.v_tpopkontr."TPopKontrId",
  apflora.v_tpopkontr."Kontr Guid",
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
  apflora.v_tpopkontr."Anzahlen",
  apflora.v_tpopkontr."Zaehleinheiten",
  apflora.v_tpopkontr."Methoden"
FROM
  (apflora.v_tpop_letzteKontrId
  LEFT JOIN
    apflora.v_tpopkontr
    ON apflora.v_tpop_letzteKontrId."MaxTPopKontrId" = apflora.v_tpopkontr."TPopKontrId")
  INNER JOIN
    apflora.v_tpop
    ON apflora.v_tpop_letzteKontrId."TPopId" = apflora.v_tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950 CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950 AS
SELECT
  apflora.ap."ApArtId",
  'erloschene Teilpopulation "Fuer AP-Bericht relevant" aber letzte Beobachtung vor 1950:' AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '" target="_blank">',
    COALESCE(concat('Pop: ', apflora.pop."PopNr"), concat('Pop: id=', apflora.pop."PopId")),
    COALESCE(concat(' > TPop: ', apflora.tpop."TPopNr"), concat(' > TPop: id=', apflora.tpop."TPopId")),
    '</a>'
  ) AS "link"
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
        ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId"
    WHERE
      apflora.tpopkontr."TPopKontrTyp" NOT IN ('Zwischenziel', 'Ziel')
      AND apflora.tpopkontrzaehl."Anzahl" > 0
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
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_erloschenundrelevantaberletztebeobvor1950 CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_erloschenundrelevantaberletztebeobvor1950 AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'erloschene Teilpopulation "Fuer AP-Bericht relevant" aber letzte Beobachtung vor 1950:' AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId"
HAVING
  apflora.tpop."TPopHerkunft" IN (101, 202, 211)
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.tpop."TPopId" NOT IN (
    SELECT DISTINCT
      apflora.tpopkontr."TPopId"
    FROM
      apflora.tpopkontr
      INNER JOIN
        apflora.tpopkontrzaehl
        ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId"
    WHERE
      apflora.tpopkontr."TPopKontrTyp" NOT IN ('Zwischenziel', 'Ziel')
      AND apflora.tpopkontrzaehl."Anzahl" > 0
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
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk_pop_statusaktuellletzterpopbererloschen CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_pop_statusaktuellletzterpopbererloschen AS
SELECT DISTINCT
  apflora.pop."ApArtId",
  'Population: Status ist "aktuell", der letzte Populations-Bericht meldet aber "erloschen":' AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  ) AS "link"
FROM
  (apflora.pop
  INNER JOIN
    (apflora.popber
    INNER JOIN
      apflora.v_pop_letzterpopber0_overall
      ON
        (v_pop_letzterpopber0_overall."PopBerJahr" = apflora.popber."PopBerJahr")
        AND (v_pop_letzterpopber0_overall."PopId" = apflora.popber."PopId"))
    ON apflora.popber."PopId" = apflora.pop."PopId")
  INNER JOIN
    apflora.tpop
    ON apflora.tpop."PopId" = apflora.pop."PopId"
WHERE
  apflora.popber."PopBerEntwicklung" = 8
  AND apflora.pop."PopHerkunft" IN (100, 200, 210)
  AND apflora.tpop."TPopApBerichtRelevant" = 1
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId"
ORDER BY
  apflora.pop."ApArtId",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statusaktuellletzterpopbererloschen CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statusaktuellletzterpopbererloschen AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "aktuell", der letzte Populations-Bericht meldet aber "erloschen":' AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[]) AS "url"
FROM
  apflora.ap
    INNER JOIN
      (apflora.pop
      INNER JOIN
        (apflora.popber
        INNER JOIN
          apflora.v_pop_letzterpopber0_overall
          ON
            (v_pop_letzterpopber0_overall."PopBerJahr" = apflora.popber."PopBerJahr")
            AND (v_pop_letzterpopber0_overall."PopId" = apflora.popber."PopId"))
        ON apflora.popber."PopId" = apflora.pop."PopId")
      INNER JOIN
        apflora.tpop
        ON apflora.tpop."PopId" = apflora.pop."PopId"
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.popber."PopBerEntwicklung" = 8
  AND apflora.pop."PopHerkunft" IN (100, 200, 210)
  AND apflora.tpop."TPopApBerichtRelevant" = 1
GROUP BY
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_qk_pop_statuserloschenletzterpopberaktuell CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_pop_statuserloschenletzterpopberaktuell AS
SELECT DISTINCT
  apflora.pop."ApArtId",
  'Population: Status ist "erloschen", der letzte Populations-Bericht meldet aber "aktuell":' AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  ) AS "link"
FROM
  (apflora.pop
  INNER JOIN
    (apflora.popber
    INNER JOIN
      apflora.v_pop_letzterpopber0_overall
      ON
        (v_pop_letzterpopber0_overall."PopBerJahr" = apflora.popber."PopBerJahr")
        AND (v_pop_letzterpopber0_overall."PopId" = apflora.popber."PopId"))
    ON apflora.popber."PopId" = apflora.pop."PopId")
  INNER JOIN
    apflora.tpop
    ON apflora.tpop."PopId" = apflora.pop."PopId"
WHERE
  apflora.popber."PopBerEntwicklung" < 8
  AND apflora.pop."PopHerkunft" IN (101, 202, 211)
  AND apflora.tpop."TPopApBerichtRelevant" = 1
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId"
ORDER BY
  apflora.pop."ApArtId",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopberaktuell CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenletzterpopberaktuell AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "erloschen", der letzte Populations-Bericht meldet aber "aktuell":' AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[]) AS "url"
FROM
  apflora.ap
    INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.popber
      INNER JOIN
        apflora.v_pop_letzterpopber0_overall
        ON
          (v_pop_letzterpopber0_overall."PopBerJahr" = apflora.popber."PopBerJahr")
          AND (v_pop_letzterpopber0_overall."PopId" = apflora.popber."PopId"))
      ON apflora.popber."PopId" = apflora.pop."PopId")
    INNER JOIN
      apflora.tpop
      ON apflora.tpop."PopId" = apflora.pop."PopId"
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.popber."PopBerEntwicklung" < 8
  AND apflora.pop."PopHerkunft" IN (101, 202, 211)
  AND apflora.tpop."TPopApBerichtRelevant" = 1
GROUP BY
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_qk_tpop_statusaktuellletzterpopbererloschen CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_tpop_statusaktuellletzterpopbererloschen AS
SELECT DISTINCT
  apflora.pop."ApArtId",
  'Teilpopulation: Status ist "aktuell", der letzte Teilpopulations-Bericht meldet aber "erloschen":' AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop: id=', apflora.tpop."TPopId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        apflora.v_tpop_letztertpopber0_overall
        ON
          (v_tpop_letztertpopber0_overall."TPopBerJahr" = apflora.tpopber."TPopBerJahr")
          AND (v_tpop_letztertpopber0_overall."TPopId" = apflora.tpopber."TPopId"))
      ON apflora.tpopber."TPopId" = apflora.tpop."TPopId")
    ON apflora.tpop."PopId" = apflora.pop."PopId"
WHERE
  apflora.tpopber."TPopBerEntwicklung" = 8
  AND apflora.tpop."TPopHerkunft" IN (100, 200, 210)
  AND apflora.tpop."TPopId" NOT IN (
    -- Ansiedlungen since apflora.tpopber."TPopBerJahr"
    SELECT
      apflora.tpopmassn."TPopId"
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn."TPopId" = apflora.tpop."TPopId"
      AND apflora.tpopmassn."TPopMassnTyp" BETWEEN 1 AND 3
      AND apflora.tpopmassn."TPopMassnJahr" IS NOT NULL
      AND apflora.tpopmassn."TPopMassnJahr" > apflora.tpopber."TPopBerJahr"
  )
GROUP BY
  apflora.pop."ApArtId",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop: id=', apflora.tpop."TPopId")
    ),
    '</a>'
  )
ORDER BY
  apflora.pop."ApArtId",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop: id=', apflora.tpop."TPopId")
    ),
    '</a>'
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statusaktuellletzterpopbererloschen CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statusaktuellletzterpopbererloschen AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Teilpopulation: Status ist "aktuell", der letzte Teilpopulations-Bericht meldet aber "erloschen":' AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[]) AS "url"
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
            (v_tpop_letztertpopber0_overall."TPopBerJahr" = apflora.tpopber."TPopBerJahr")
            AND (v_tpop_letztertpopber0_overall."TPopId" = apflora.tpopber."TPopId"))
        ON apflora.tpopber."TPopId" = apflora.tpop."TPopId")
      ON apflora.tpop."PopId" = apflora.pop."PopId"
      ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.tpopber."TPopBerEntwicklung" = 8
  AND apflora.tpop."TPopHerkunft" IN (100, 200, 210)
  AND apflora.tpop."TPopId" NOT IN (
    -- Ansiedlungen since apflora.tpopber."TPopBerJahr"
    SELECT
      apflora.tpopmassn."TPopId"
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn."TPopId" = apflora.tpop."TPopId"
      AND apflora.tpopmassn."TPopMassnTyp" BETWEEN 1 AND 3
      AND apflora.tpopmassn."TPopMassnJahr" IS NOT NULL
      AND apflora.tpopmassn."TPopMassnJahr" > apflora.tpopber."TPopBerJahr"
  )
GROUP BY
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_qk_tpop_statuserloschenletzterpopberaktuell CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_tpop_statuserloschenletzterpopberaktuell AS
SELECT DISTINCT
  apflora.pop."ApArtId",
  'Teilpopulation: Status ist "erloschen", der letzte Teilpopulations-Bericht meldet aber "aktuell":' AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop: id=', apflora.tpop."TPopId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        apflora.v_tpop_letztertpopber0_overall
        ON
          (v_tpop_letztertpopber0_overall."TPopBerJahr" = apflora.tpopber."TPopBerJahr")
          AND (v_tpop_letztertpopber0_overall."TPopId" = apflora.tpopber."TPopId"))
      ON apflora.tpopber."TPopId" = apflora.tpop."TPopId")
    ON apflora.tpop."PopId" = apflora.pop."PopId"
WHERE
  apflora.tpopber."TPopBerEntwicklung" < 8
  AND apflora.tpop."TPopHerkunft" IN (101, 202, 211)
  AND apflora.tpop."TPopId" NOT IN (
    -- Ansiedlungen since apflora.tpopber."TPopBerJahr"
    SELECT
      apflora.tpopmassn."TPopId"
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn."TPopId" = apflora.tpop."TPopId"
      AND apflora.tpopmassn."TPopMassnTyp" BETWEEN 1 AND 3
      AND apflora.tpopmassn."TPopMassnJahr" IS NOT NULL
      AND apflora.tpopmassn."TPopMassnJahr" > apflora.tpopber."TPopBerJahr"
  )
GROUP BY
  apflora.pop."ApArtId",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop: id=', apflora.tpop."TPopId")
    ),
    '</a>'
  )
ORDER BY
  apflora.pop."ApArtId",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop: id=', apflora.tpop."TPopId")
    ),
    '</a>'
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletzterpopberaktuell CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletzterpopberaktuell AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Teilpopulation: Status ist "erloschen", der letzte Teilpopulations-Bericht meldet aber "aktuell":' AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[]) AS "url"
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
            (v_tpop_letztertpopber0_overall."TPopBerJahr" = apflora.tpopber."TPopBerJahr")
            AND (v_tpop_letztertpopber0_overall."TPopId" = apflora.tpopber."TPopId"))
        ON apflora.tpopber."TPopId" = apflora.tpop."TPopId")
      ON apflora.tpop."PopId" = apflora.pop."PopId"
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.tpopber."TPopBerEntwicklung" < 8
  AND apflora.tpop."TPopHerkunft" IN (101, 202, 211)
  AND apflora.tpop."TPopId" NOT IN (
    -- Ansiedlungen since apflora.tpopber."TPopBerJahr"
    SELECT
      apflora.tpopmassn."TPopId"
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn."TPopId" = apflora.tpop."TPopId"
      AND apflora.tpopmassn."TPopMassnTyp" BETWEEN 1 AND 3
      AND apflora.tpopmassn."TPopMassnJahr" IS NOT NULL
      AND apflora.tpopmassn."TPopMassnJahr" > apflora.tpopber."TPopBerJahr"
  )
GROUP BY
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_exportevab_beob CASCADE;
CREATE OR REPLACE VIEW apflora.v_exportevab_beob AS
SELECT
  concat('{', apflora.tpopkontr."ZeitGuid", '}') AS "fkZeitpunkt",
  concat('{', apflora.tpopkontr."TPopKontrGuid", '}') AS "idBeobachtung",
  COALESCE(apflora.adresse."EvabIdPerson", '{A1146AE4-4E03-4032-8AA8-BC46BA02F468}') AS fkAutor,
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
        apflora.tpopmassn."TPopId"
      FROM
        apflora.tpopmassn
      WHERE
        apflora.tpopmassn."TPopId" = apflora.tpopkontr."TPopId"
        AND apflora.tpopmassn."TPopMassnTyp" BETWEEN 1 AND 3
        AND apflora.tpopmassn."TPopMassnJahr" <= apflora.tpopkontr."TPopKontrJahr"
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
      apflora.v_tpopkontr_maxanzahl."Anzahl" = 0
      AND EXISTS (
        SELECT
          "TPopId"
        FROM
          apflora.tpopber
        WHERE
          apflora.tpopber."TPopId" = apflora.tpopkontr."TPopId"
          AND apflora.tpopber."TPopBerEntwicklung" = 8
          AND apflora.tpopber."TPopBerJahr" = apflora.tpopkontr."TPopKontrJahr"
      )
    ) THEN 2
    WHEN apflora.v_tpopkontr_maxanzahl."Anzahl" = 0 THEN 3
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
      array_to_string(array_agg(apflora.tpopkontrzaehl."Anzahl"), ', '),
      ', Zaehleinheiten: ',
      string_agg(apflora.tpopkontrzaehl_einheit_werte."ZaehleinheitTxt", ', '),
      ', Methoden: ',
      string_agg(apflora.tpopkontrzaehl_methode_werte."BeurteilTxt", ', ')
      )
    from 1 for 160
  ) AS "ABONDANCE",
  'C' AS "EXPERTISE_INTRODUIT",
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
            ON apflora.tpopkontrzaehl."Zaehleinheit" = apflora.tpopkontrzaehl_einheit_werte."ZaehleinheitCode")
          LEFT JOIN
            apflora.tpopkontrzaehl_methode_werte
            ON apflora.tpopkontrzaehl."Methode" = apflora.tpopkontrzaehl_methode_werte."BeurteilCode")
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  -- keine Testarten
  apflora.ap."ApArtId" > 150
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
GROUP BY
  apflora.tpopkontr."ZeitGuid",
  apflora.tpopkontr."TPopId",
  apflora.tpopkontr."TPopKontrGuid",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.adresse."EvabIdPerson",
  apflora.ap."ApArtId",
  "fkAAINTRODUIT",
  apflora.v_tpopkontr_maxanzahl."Anzahl",
  apflora.tpopkontr."TPopKontrGefaehrdung",
  apflora.tpopkontr."TPopKontrVitalitaet",
  apflora.tpop."TPopBeschr",
  "tblAdresse_2"."EvabIdPerson",
  "tblAdresse_2"."AdrName";
