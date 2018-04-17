/*
 * diese Views hängen von anderen ab, die in viewsGenerieren.sql erstellt werden
 * daher muss diese Date NACH viewsGenerieren.sql ausgeführt werden
 */

DROP VIEW IF EXISTS apflora.v_ap_massnjahre CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_massnjahre AS
SELECT
  apflora.ap.id,
  apflora.v_massn_jahre.jahr
FROM
  apflora.ap,
  apflora.v_massn_jahre
WHERE
  apflora.ap.bearbeitung < 4
ORDER BY
  apflora.ap.id,
  apflora.v_massn_jahre.jahr;

DROP VIEW IF EXISTS apflora.v_ap_anzmassnprojahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_anzmassnprojahr AS
SELECT
  apflora.v_ap_massnjahre.id,
  apflora.v_ap_massnjahre.jahr,
  COALESCE(apflora.v_ap_anzmassnprojahr0."AnzahlvonTPopMassnId", 0) AS anzahl_massnahmen
FROM
  apflora.v_ap_massnjahre
  LEFT JOIN
    apflora.v_ap_anzmassnprojahr0
    ON
      (apflora.v_ap_massnjahre.jahr = apflora.v_ap_anzmassnprojahr0.jahr)
      AND (apflora.v_ap_massnjahre.id = apflora.v_ap_anzmassnprojahr0.id)
ORDER BY
  apflora.v_ap_massnjahre.id,
  apflora.v_ap_massnjahre.jahr;

DROP VIEW IF EXISTS apflora.v_ap_anzmassnbisjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_anzmassnbisjahr AS
SELECT
  apflora.v_ap_massnjahre.id,
  apflora.v_ap_massnjahre.jahr,
  sum(apflora.v_ap_anzmassnprojahr.anzahl_massnahmen) AS anzahl_massnahmen
FROM
  apflora.v_ap_massnjahre
  INNER JOIN
    apflora.v_ap_anzmassnprojahr
    ON apflora.v_ap_massnjahre.id = apflora.v_ap_anzmassnprojahr.id
WHERE
  apflora.v_ap_anzmassnprojahr.jahr <= apflora.v_ap_massnjahre.jahr
GROUP BY
  apflora.v_ap_massnjahre.id,
  apflora.v_ap_massnjahre.jahr
ORDER BY
  apflora.v_ap_massnjahre.id,
  apflora.v_ap_massnjahre.jahr;

DROP VIEW IF EXISTS apflora.v_ap_apberundmassn CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_apberundmassn AS
SELECT
  apflora.ap.id,
  apflora.ae_eigenschaften.artname,
  apflora.ap_bearbstand_werte.text AS bearbeitung,
  apflora.ap.start_jahr,
  apflora.ap_umsetzung_werte.text AS umsetzung,
  apflora.adresse."AdrName" AS bearbeiter,
  apflora.ae_eigenschaften.artwert,
  apflora.v_ap_anzmassnprojahr.jahr AS massn_jahr,
  apflora.v_ap_anzmassnprojahr.anzahl_massnahmen AS massn_anzahl,
  apflora.v_ap_anzmassnbisjahr.anzahl_massnahmen AS massn_anzahl_bisher,
  CASE
    WHEN apflora.apber.jahr > 0
    THEN 'ja'
    ELSE 'nein'
  END AS bericht_erstellt
FROM
  apflora.ae_eigenschaften
    INNER JOIN
      ((((apflora.ap
      LEFT JOIN
        apflora.ap_bearbstand_werte
        ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
      LEFT JOIN
        apflora.ap_umsetzung_werte
        ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
      LEFT JOIN
        apflora.adresse
        ON apflora.ap.bearbeiter = apflora.adresse."AdrId")
      INNER JOIN
        (apflora.v_ap_anzmassnprojahr
        INNER JOIN
          (apflora.v_ap_anzmassnbisjahr
          LEFT JOIN
            apflora.apber
            ON
              (apflora.v_ap_anzmassnbisjahr.jahr = apflora.apber.jahr)
              AND (apflora.v_ap_anzmassnbisjahr.id = apflora.apber.ap_id))
          ON
            (apflora.v_ap_anzmassnprojahr.jahr = apflora.v_ap_anzmassnbisjahr.jahr)
            AND (apflora.v_ap_anzmassnprojahr.id = apflora.v_ap_anzmassnbisjahr.id))
        ON apflora.ap.id = apflora.v_ap_anzmassnprojahr.id)
      ON apflora.ae_eigenschaften.id = apflora.ap.art
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.v_ap_anzmassnprojahr.jahr;

DROP VIEW IF EXISTS apflora.v_tpop_letztermassnber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_letztermassnber AS
SELECT
  apflora.v_tpop_letztermassnber0.ap_id,
  apflora.v_tpop_letztermassnber0.id,
  max(apflora.v_tpop_letztermassnber0.jahr) AS jahr
FROM
  apflora.v_tpop_letztermassnber0
GROUP BY
  apflora.v_tpop_letztermassnber0.ap_id,
  apflora.v_tpop_letztermassnber0.id;

DROP VIEW IF EXISTS apflora.v_tpop_letztertpopber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_letztertpopber AS
SELECT
  apflora.v_tpop_letztertpopber0.ap_id,
  apflora.v_tpop_letztertpopber0.id,
  max(apflora.v_tpop_letztertpopber0.tpopber_jahr) AS jahr
FROM
  apflora.v_tpop_letztertpopber0
GROUP BY
  apflora.v_tpop_letztertpopber0.ap_id,
  apflora.v_tpop_letztertpopber0.id;

DROP VIEW IF EXISTS apflora.v_pop_letztermassnber CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_letztermassnber AS
SELECT
  apflora.v_pop_letztermassnber0.ap_id,
  apflora.v_pop_letztermassnber0.id,
  max(apflora.v_pop_letztermassnber0.jahr) AS jahr
FROM
  apflora.v_pop_letztermassnber0
GROUP BY
  apflora.v_pop_letztermassnber0.ap_id,
  apflora.v_pop_letztermassnber0.id;

-- dieser view ist für den Bericht gedacht - daher letzter popber vor jBerJahr
DROP VIEW IF EXISTS apflora.v_pop_letzterpopber CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_letzterpopber AS
SELECT
  apflora.v_pop_letzterpopber0.ap_id,
  apflora.v_pop_letzterpopber0.id,
  max(apflora.v_pop_letzterpopber0.jahr) AS jahr
FROM
  apflora.v_pop_letzterpopber0
GROUP BY
  apflora.v_pop_letzterpopber0.ap_id,
  apflora.v_pop_letzterpopber0.id;

-- dieser view ist für die Qualitätskontrolle gedacht - daher letzter popber überhaupt
DROP VIEW IF EXISTS apflora.v_pop_letzterpopber_overall CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_letzterpopber_overall AS
SELECT
  apflora.pop.ap_id,
  apflora.pop.id,
  apflora.v_pop_letzterpopber0_overall.jahr
FROM
  (apflora.pop
  INNER JOIN
    apflora.v_pop_letzterpopber0_overall
    ON apflora.pop.id = apflora.v_pop_letzterpopber0_overall.pop_id)
  INNER JOIN
    apflora.tpop
    ON apflora.pop.id = apflora.tpop.pop_id
WHERE
  apflora.tpop.apber_relevant = 1
  AND apflora.pop.status  <> 300
GROUP BY
  apflora.pop.ap_id,
  apflora.pop.id,
  apflora.v_pop_letzterpopber0_overall.jahr;

DROP VIEW IF EXISTS apflora.v_apber_uebe CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebe AS
SELECT
  apflora.apber.*,
  apflora.ae_eigenschaften.artname,
  apflora.v_ap_anzmassnbisjahr.anzahl_massnahmen
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((apflora.ae_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap.id = apflora.v_ap_apberrelevant.id)
      ON apflora.ae_eigenschaften.id = apflora.ap.art)
    INNER JOIN
      (apflora._variable
      INNER JOIN
        (apflora.apber
        INNER JOIN
          apflora.v_ap_anzmassnbisjahr
          ON apflora.apber.ap_id = apflora.v_ap_anzmassnbisjahr.id)
        ON apflora._variable.apber_jahr = apflora.apber.jahr)
      ON apflora.ap.id = apflora.apber.ap_id)
    ON "tblKonstanten_1".apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.v_ap_anzmassnbisjahr.anzahl_massnahmen > 0
  AND apflora.apber.beurteilung = 1
  AND apflora.ap.bearbeitung BETWEEN 1 AND 3
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_apber_uebe_apid CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebe_apid AS
SELECT
  apflora.ap.id
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((apflora.ae_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap.id = apflora.v_ap_apberrelevant.id)
      ON apflora.ae_eigenschaften.id = apflora.ap.art)
    INNER JOIN
      (apflora._variable
      INNER JOIN
        (apflora.apber
        INNER JOIN
          apflora.v_ap_anzmassnbisjahr
          ON apflora.apber.ap_id = apflora.v_ap_anzmassnbisjahr.id)
        ON apflora._variable.apber_jahr = apflora.apber.jahr)
      ON apflora.ap.id = apflora.apber.ap_id)
    ON "tblKonstanten_1".apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.v_ap_anzmassnbisjahr.anzahl_massnahmen > 0
  AND apflora.apber.beurteilung = 1
  AND apflora.ap.bearbeitung BETWEEN 1 AND 3;

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
        ON "vApAnzMassnBisJahr_1".id = apflora.ap.id)
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap.id = apflora.v_ap_apberrelevant.id)
      ON apflora.ae_eigenschaften.id = apflora.ap.art)
    INNER JOIN
      (apflora.apber
      INNER JOIN
        apflora._variable
        ON apflora.apber.jahr = apflora._variable.apber_jahr)
      ON
        (apflora._variable.apber_jahr = "vApAnzMassnBisJahr_1".jahr)
        AND (apflora.ap.id = apflora.apber.ap_id)
WHERE
  apflora.ap.bearbeitung BETWEEN 1 AND 3
  AND "vApAnzMassnBisJahr_1".anzahl_massnahmen = '0'
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_apber_uebma CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebma AS
SELECT
  apflora.ae_eigenschaften.artname,
  apflora.v_ap_anzmassnbisjahr.anzahl_massnahmen
FROM
  apflora._variable
  INNER JOIN
    ((apflora.ae_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap.id = apflora.v_ap_apberrelevant.id)
      ON apflora.ae_eigenschaften.id = apflora.ap.art)
    INNER JOIN
      apflora.v_ap_anzmassnbisjahr
      ON apflora.ap.id = apflora.v_ap_anzmassnbisjahr.id)
    ON apflora._variable.apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.v_ap_anzmassnbisjahr.anzahl_massnahmen > 0
  AND apflora.ap.bearbeitung BETWEEN 1 AND 3
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_apber_uebma_apid CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebma_apid AS
SELECT
  apflora.ap.id
FROM
  apflora._variable
  INNER JOIN
    ((apflora.ae_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap.id = apflora.v_ap_apberrelevant.id)
      ON apflora.ae_eigenschaften.id = apflora.ap.art)
    INNER JOIN
      apflora.v_ap_anzmassnbisjahr
      ON apflora.ap.id = apflora.v_ap_anzmassnbisjahr.id)
    ON apflora._variable.apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.v_ap_anzmassnbisjahr.anzahl_massnahmen > 0
  AND apflora.ap.bearbeitung BETWEEN 1 AND 3;

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
        ON apflora.ap.id = apflora.v_ap_apberrelevant.id)
      ON apflora.ae_eigenschaften.id = apflora.ap.art)
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber.ap_id = apflora.v_ap_anzmassnbisjahr.id)
      INNER JOIN
        apflora._variable
        ON apflora.apber.jahr = apflora._variable.apber_jahr)
      ON apflora.ap.id = apflora.apber.ap_id)
    ON "tblKonstanten_1".apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.apber.beurteilung = 5
  AND apflora.v_ap_anzmassnbisjahr.anzahl_massnahmen > 0
  AND apflora.ap.bearbeitung BETWEEN 1 AND 3
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_apber_uebme_apid CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebme_apid AS
SELECT
  apflora.ap.id
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((apflora.ae_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap.id = apflora.v_ap_apberrelevant.id)
      ON apflora.ae_eigenschaften.id = apflora.ap.art)
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber.ap_id = apflora.v_ap_anzmassnbisjahr.id)
      INNER JOIN
        apflora._variable
        ON apflora.apber.jahr = apflora._variable.apber_jahr)
      ON apflora.ap.id = apflora.apber.ap_id)
    ON "tblKonstanten_1".apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.apber.beurteilung = 5
  AND apflora.v_ap_anzmassnbisjahr.anzahl_massnahmen > 0
  AND apflora.ap.bearbeitung BETWEEN 1 AND 3;

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
        ON apflora.ap.id = apflora.v_ap_apberrelevant.id)
      ON apflora.ae_eigenschaften.id = apflora.ap.art)
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber.ap_id = apflora.v_ap_anzmassnbisjahr.id)
      INNER JOIN
        apflora._variable
        ON apflora.apber.jahr = apflora._variable.apber_jahr)
      ON apflora.ap.id = apflora.apber.ap_id)
    ON "tblKonstanten_1".apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.apber.beurteilung = 3
  AND apflora.ap.bearbeitung BETWEEN 1 AND 3
  AND apflora.v_ap_anzmassnbisjahr.anzahl_massnahmen > 0
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_apber_uebne_apid CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebne_apid AS
SELECT
  apflora.ap.id
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((apflora.ae_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap.id = apflora.v_ap_apberrelevant.id)
      ON apflora.ae_eigenschaften.id = apflora.ap.art)
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber.ap_id = apflora.v_ap_anzmassnbisjahr.id)
      INNER JOIN
        apflora._variable
        ON apflora.apber.jahr = apflora._variable.apber_jahr)
      ON apflora.ap.id = apflora.apber.ap_id)
    ON "tblKonstanten_1".apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.apber.beurteilung = 3
  AND apflora.ap.bearbeitung BETWEEN 1 AND 3
  AND apflora.v_ap_anzmassnbisjahr.anzahl_massnahmen > 0;

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
        ON apflora.ap.id = apflora.v_ap_apberrelevant.id)
      ON apflora.ae_eigenschaften.id = apflora.ap.art)
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber.ap_id = apflora.v_ap_anzmassnbisjahr.id)
      INNER JOIN
        apflora._variable
        ON apflora.apber.jahr = apflora._variable.apber_jahr)
    ON apflora.ap.id = apflora.apber.ap_id)
  ON "tblKonstanten_1".apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.apber.beurteilung = 4
  AND apflora.v_ap_anzmassnbisjahr.anzahl_massnahmen > 0
  AND apflora.ap.bearbeitung BETWEEN 1 AND 3
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_apber_uebse_apid CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebse_apid AS
SELECT
  apflora.ap.id
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((apflora.ae_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap.id = apflora.v_ap_apberrelevant.id)
      ON apflora.ae_eigenschaften.id = apflora.ap.art)
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber.ap_id = apflora.v_ap_anzmassnbisjahr.id)
      INNER JOIN
        apflora._variable
        ON apflora.apber.jahr = apflora._variable.apber_jahr)
    ON apflora.ap.id = apflora.apber.ap_id)
  ON "tblKonstanten_1".apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.apber.beurteilung = 4
  AND apflora.v_ap_anzmassnbisjahr.anzahl_massnahmen > 0
  AND apflora.ap.bearbeitung BETWEEN 1 AND 3;

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
      (apflora.ap INNER JOIN apflora.v_ap_apberrelevant ON apflora.ap.id = apflora.v_ap_apberrelevant.id)
      ON apflora.ae_eigenschaften.id = apflora.ap.art)
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber.ap_id = apflora.v_ap_anzmassnbisjahr.id)
      INNER JOIN
        apflora._variable
        ON apflora.apber.jahr = apflora._variable.apber_jahr)
    ON apflora.ap.id = apflora.apber.ap_id)
  ON "tblKonstanten_1".apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.apber.beurteilung = 1168274204
  AND apflora.v_ap_anzmassnbisjahr.anzahl_massnahmen > 0
  AND apflora.ap.bearbeitung BETWEEN 1 AND 3
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_apber_uebun_apid CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebun_apid AS
SELECT
  apflora.ap.id
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((apflora.ae_eigenschaften
    INNER JOIN
      (apflora.ap INNER JOIN apflora.v_ap_apberrelevant ON apflora.ap.id = apflora.v_ap_apberrelevant.id)
      ON apflora.ae_eigenschaften.id = apflora.ap.art)
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber.ap_id = apflora.v_ap_anzmassnbisjahr.id)
      INNER JOIN
        apflora._variable
        ON apflora.apber.jahr = apflora._variable.apber_jahr)
    ON apflora.ap.id = apflora.apber.ap_id)
  ON "tblKonstanten_1".apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.apber.beurteilung = 1168274204
  AND apflora.v_ap_anzmassnbisjahr.anzahl_massnahmen > 0
  AND apflora.ap.bearbeitung BETWEEN 1 AND 3;

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
        ON apflora.ap.id = apflora.v_ap_apberrelevant.id)
      ON apflora.ae_eigenschaften.id = apflora.ap.art)
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber.ap_id = apflora.v_ap_anzmassnbisjahr.id)
      INNER JOIN
        apflora._variable
        ON apflora.apber.jahr = apflora._variable.apber_jahr)
      ON apflora.ap.id = apflora.apber.ap_id)
    ON "tblKonstanten_1".apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.apber.beurteilung = 6
  AND apflora.v_ap_anzmassnbisjahr.anzahl_massnahmen > 0
  AND apflora.ap.bearbeitung BETWEEN 1 AND 3
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_apber_uebwe_apid CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebwe_apid AS
SELECT
  apflora.ap.id
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((apflora.ae_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora.v_ap_apberrelevant
        ON apflora.ap.id = apflora.v_ap_apberrelevant.id)
      ON apflora.ae_eigenschaften.id = apflora.ap.art)
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora.v_ap_anzmassnbisjahr
        ON apflora.apber.ap_id = apflora.v_ap_anzmassnbisjahr.id)
      INNER JOIN
        apflora._variable
        ON apflora.apber.jahr = apflora._variable.apber_jahr)
      ON apflora.ap.id = apflora.apber.ap_id)
    ON "tblKonstanten_1".apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.apber.beurteilung = 6
  AND apflora.v_ap_anzmassnbisjahr.anzahl_massnahmen > 0
  AND apflora.ap.bearbeitung BETWEEN 1 AND 3;

DROP VIEW IF EXISTS apflora.v_apber_uebnb000 CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebnb000 AS
SELECT
  apflora.ap.id,
  apflora.apber.jahr
FROM
  (((apflora.ap
  INNER JOIN
    apflora.v_ap_anzmassnbisjahr
    ON apflora.ap.id = apflora.v_ap_anzmassnbisjahr.id)
  INNER JOIN
    apflora.v_ap_apberrelevant
    ON apflora.ap.id = apflora.v_ap_apberrelevant.id)
  LEFT JOIN
    apflora.apber
    ON apflora.ap.id = apflora.apber.ap_id)
  INNER JOIN
    apflora._variable
    ON apflora.v_ap_anzmassnbisjahr.jahr = apflora._variable.apber_jahr
WHERE
  apflora.apber.ap_id IS NULL
  AND apflora.ap.bearbeitung BETWEEN 1 AND 3;

DROP VIEW IF EXISTS apflora.v_apber_uebnb00 CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebnb00 AS
SELECT
  apflora.ap.id,
  apflora.apber.jahr
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    (((apflora.ap
    INNER JOIN
      apflora.v_ap_anzmassnbisjahr
      ON apflora.ap.id = apflora.v_ap_anzmassnbisjahr.id)
    INNER JOIN
      apflora.v_ap_apberrelevant
      ON apflora.ap.id = apflora.v_ap_apberrelevant.id)
    INNER JOIN
      (apflora.apber
      INNER JOIN
        apflora._variable
        ON apflora.apber.jahr = apflora._variable.apber_jahr)
      ON apflora.ap.id = apflora.apber.ap_id)
    ON "tblKonstanten_1".apber_jahr = apflora.v_ap_anzmassnbisjahr.jahr
WHERE
  apflora.ap.bearbeitung BETWEEN 1 AND 3
  AND apflora.apber.beurteilung IS NULL;

DROP VIEW IF EXISTS apflora.v_apber_uebnb0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebnb0 AS
SELECT
  id,
  jahr
FROM
  apflora.v_apber_uebnb000
UNION SELECT
  id,
  jahr
FROM
  apflora.v_apber_uebnb00;

DROP VIEW IF EXISTS apflora.v_apber_uebnb CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uebnb AS
SELECT
 apflora.ap.id,
  apflora.ae_eigenschaften.artname
FROM
  apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.id = apflora.ap.art
WHERE
  apflora.ap.bearbeitung BETWEEN 1 AND 3
  AND apflora.ap.id NOT IN (SELECT * FROM apflora.v_apber_uebse_apid)
  AND apflora.ap.id NOT IN (SELECT * FROM apflora.v_apber_uebe_apid)
  AND apflora.ap.id NOT IN (SELECT * FROM apflora.v_apber_uebme_apid)
  AND apflora.ap.id NOT IN (SELECT * FROM apflora.v_apber_uebwe_apid)
  AND apflora.ap.id NOT IN (SELECT * FROM apflora.v_apber_uebne_apid)
  AND apflora.ap.id NOT IN (SELECT * FROM apflora.v_apber_uebun_apid)
  AND apflora.ap.id IN (SELECT * FROM apflora.v_apber_uebma_apid)
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_apber_uet01 CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uet01 AS
SELECT
  apflora.ap.id,
  apflora.ae_eigenschaften.artname,
  CASE
    WHEN apflora.ap.id NOT IN (SELECT * FROM apflora.v_apber_uebma_apid)
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
      ON apflora.ap.id = apflora.v_ap_anzmassnbisjahr.id)
    INNER JOIN
      apflora.v_ap_apberrelevant
      ON apflora.ap.id = apflora.v_ap_apberrelevant.id)
    ON apflora.ae_eigenschaften.id = apflora.ap.art
WHERE
  apflora.ap.bearbeitung BETWEEN 1 AND 3
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_apber_uet_veraengegenvorjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_uet_veraengegenvorjahr AS
SELECT
  apflora.ap.id,
  apflora.apber.veraenderung_zum_vorjahr,
  apflora.apber.jahr
FROM
  apflora.ap
  LEFT JOIN
    apflora.apber
    ON apflora.ap.id = apflora.apber.ap_id
WHERE
  apflora.ap.bearbeitung BETWEEN 1 AND 3
  AND (
    apflora.apber.jahr IN (SELECT apflora._variable.apber_jahr FROM apflora._variable)
    Or apflora.apber.jahr IS NULL
  );

DROP VIEW IF EXISTS apflora.v_tpop_statuswidersprichtbericht CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_statuswidersprichtbericht AS
SELECT
  apflora.ae_eigenschaften.artname AS "Art",
  apflora.ap_bearbstand_werte.text AS "Bearbeitungsstand AP",
  apflora.pop.nr as pop_nr,
  apflora.pop.name as pop_name,
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
    ON apflora.ae_eigenschaften.id = apflora.ap.art)
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
      ON apflora.pop.id = apflora.tpop.pop_id)
    ON apflora.ap.id = apflora.pop.ap_id)
  INNER JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code
WHERE
  (
    apflora.ap.bearbeitung < 4
    AND (
      apflora.tpop.status = 101
      OR apflora.tpop.status = 202
    )
    AND apflora.tpopber.entwicklung <> 8
  )
  OR (
    apflora.ap.bearbeitung < 4
    AND apflora.tpop.status NOT IN (101, 202)
    AND apflora.tpopber.entwicklung = 8
  )
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop.nr,
  apflora.pop.name,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname;

-- im Gebrauch (Access):
DROP VIEW IF EXISTS apflora.v_apber_injahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_injahr AS
SELECT
  apflora.ap.id as ap_id,
  apflora.ae_eigenschaften.artname,
  apflora.apber.id,
  concat(apflora.adresse."AdrName", ', ', apflora.adresse."AdrAdresse") AS bearbeiter,
  apflora.apberuebersicht.jahr AS apberuebersicht_jahr,
  apflora.apberuebersicht.bemerkungen,
  apflora.v_erstemassnproap.jahr AS jahr_erste_massnahme
FROM
  (apflora.ae_eigenschaften
  INNER JOIN
    (apflora.ap
    LEFT JOIN
      apflora.v_erstemassnproap
      ON apflora.ap.id = apflora.v_erstemassnproap.ap_id)
    ON apflora.ae_eigenschaften.id = apflora.ap.art)
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
    ON apflora.ap.id = apflora.apber.ap_id
WHERE
  apflora.ap.bearbeitung < 4
  --AND apflora.ae_eigenschaften.taxid > 150
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_apber_b2rpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b2rpop AS
SELECT
  apflora.pop.ap_id,
  apflora.pop.id
FROM
  ((apflora.v_pop_letzterpopber
  INNER JOIN
    apflora.pop
    ON apflora.v_pop_letzterpopber.ap_id = apflora.pop.ap_id)
  INNER JOIN
    apflora.popber
    ON
      (apflora.pop.id = apflora.popber.pop_id)
      AND (apflora.v_pop_letzterpopber.id = apflora.popber.pop_id)
      AND (apflora.v_pop_letzterpopber.jahr = apflora.popber.jahr))
  INNER JOIN
    apflora.tpop
    ON apflora.pop.id = apflora.tpop.pop_id
WHERE
  apflora.popber.entwicklung = 3
  AND apflora.tpop.apber_relevant = 1
  AND apflora.pop.status  <> 300
GROUP BY
  apflora.pop.ap_id,
  apflora.pop.id;

DROP VIEW IF EXISTS apflora.v_apber_b3rpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b3rpop AS
SELECT
  apflora.pop.ap_id,
  apflora.pop.id
FROM
  ((apflora.v_pop_letzterpopber
  INNER JOIN
    apflora.pop
    ON apflora.v_pop_letzterpopber.ap_id = apflora.pop.ap_id)
  INNER JOIN
    apflora.popber
    ON
      (apflora.pop.id = apflora.popber.pop_id)
      AND (apflora.v_pop_letzterpopber.id = apflora.popber.pop_id)
      AND (apflora.v_pop_letzterpopber.jahr = apflora.popber.jahr))
  INNER JOIN
    apflora.tpop
    ON apflora.pop.id = apflora.tpop.pop_id
WHERE
  apflora.popber.entwicklung = 2
  AND apflora.tpop.apber_relevant = 1
  AND apflora.pop.status  <> 300
GROUP BY
  apflora.pop.ap_id,
  apflora.pop.id;

DROP VIEW IF EXISTS apflora.v_apber_b4rpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b4rpop AS
SELECT
  apflora.pop.ap_id,
  apflora.pop.id
FROM
  ((apflora.v_pop_letzterpopber
  INNER JOIN
    apflora.pop
    ON apflora.v_pop_letzterpopber.ap_id = apflora.pop.ap_id)
  INNER JOIN
    apflora.popber
    ON
      (apflora.pop.id = apflora.popber.pop_id)
      AND (apflora.v_pop_letzterpopber.id = apflora.popber.pop_id)
      AND (apflora.v_pop_letzterpopber.jahr = apflora.popber.jahr))
  INNER JOIN
    apflora.tpop
    ON apflora.pop.id = apflora.tpop.pop_id
WHERE
  apflora.popber.entwicklung = 1
  AND apflora.tpop.apber_relevant = 1
  AND apflora.pop.status  <> 300
GROUP BY
  apflora.pop.ap_id,
  apflora.pop.id;

DROP VIEW IF EXISTS apflora.v_apber_b5rpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b5rpop AS
SELECT
  apflora.pop.ap_id,
  apflora.pop.id
FROM
  ((apflora.v_pop_letzterpopber
  INNER JOIN
    apflora.pop
    ON apflora.v_pop_letzterpopber.ap_id = apflora.pop.ap_id)
  INNER JOIN
    apflora.popber
    ON
      (apflora.pop.id = apflora.popber.pop_id)
      AND (apflora.v_pop_letzterpopber.id = apflora.popber.pop_id)
      AND (apflora.v_pop_letzterpopber.jahr = apflora.popber.jahr))
  INNER JOIN
    apflora.tpop
    ON apflora.pop.id = apflora.tpop.pop_id
WHERE
  (
    apflora.popber.entwicklung = 4
    OR apflora.popber.entwicklung = 9
  )
  AND apflora.tpop.apber_relevant = 1
  AND apflora.pop.status  <> 300
GROUP BY
  apflora.pop.ap_id,
  apflora.pop.id;

DROP VIEW IF EXISTS apflora.v_apber_b6rpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b6rpop AS
SELECT
  apflora.pop.ap_id,
  apflora.pop.id
FROM
  ((apflora.v_pop_letzterpopber
  INNER JOIN
    apflora.pop
    ON apflora.v_pop_letzterpopber.ap_id = apflora.pop.ap_id)
  INNER JOIN
    apflora.popber
    ON
      (apflora.pop.id = apflora.popber.pop_id)
      AND (apflora.v_pop_letzterpopber.id = apflora.popber.pop_id)
      AND (apflora.v_pop_letzterpopber.jahr = apflora.popber.jahr))
  INNER JOIN
    apflora.tpop
    ON apflora.pop.id = apflora.tpop.pop_id
WHERE
  apflora.popber.entwicklung = 8
  AND apflora.tpop.apber_relevant = 1
  AND apflora.pop.status  <> 300
GROUP BY
  apflora.pop.ap_id,
  apflora.pop.id;

DROP VIEW IF EXISTS apflora.v_apber_b2rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b2rtpop AS
SELECT
  apflora.pop.ap_id,
  apflora.tpop.id
FROM
  apflora.tpop
  INNER JOIN
    (apflora.tpopber
    INNER JOIN
      (apflora.pop
      INNER JOIN
        apflora.v_tpop_letztertpopber
        ON apflora.pop.ap_id = apflora.v_tpop_letztertpopber.ap_id)
      ON
        (apflora.tpopber.tpop_id = apflora.v_tpop_letztertpopber.id)
        AND (apflora.tpopber.jahr = apflora.v_tpop_letztertpopber.jahr))
    ON
      (apflora.tpop.pop_id = apflora.pop.id)
      AND (apflora.tpop.id = apflora.tpopber.tpop_id)
WHERE
  apflora.tpopber.entwicklung = 3
  AND apflora.tpop.apber_relevant = 1
  AND apflora.pop.status  <> 300
GROUP BY
  apflora.pop.ap_id,
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_b3rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b3rtpop AS
SELECT
  apflora.pop.ap_id,
  apflora.tpop.id
FROM
  apflora.tpop
  INNER JOIN
    (apflora.tpopber
    INNER JOIN
      (apflora.pop
      INNER JOIN
        apflora.v_tpop_letztertpopber
        ON apflora.pop.ap_id = apflora.v_tpop_letztertpopber.ap_id)
      ON
        (apflora.tpopber.tpop_id = apflora.v_tpop_letztertpopber.id)
        AND (apflora.tpopber.jahr = apflora.v_tpop_letztertpopber.jahr))
    ON
      (apflora.tpop.pop_id = apflora.pop.id)
      AND (apflora.tpop.id = apflora.tpopber.tpop_id)
WHERE
  apflora.tpopber.entwicklung = 2
  AND apflora.tpop.apber_relevant = 1
  AND apflora.pop.status  <> 300
GROUP BY
  apflora.pop.ap_id,
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_b4rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b4rtpop AS
SELECT
  apflora.pop.ap_id,
  apflora.tpop.id
FROM
  apflora.tpop
  INNER JOIN
    (apflora.tpopber
    INNER JOIN
      (apflora.pop
      INNER JOIN
        apflora.v_tpop_letztertpopber
        ON apflora.pop.ap_id = apflora.v_tpop_letztertpopber.ap_id)
      ON
        (apflora.tpopber.tpop_id = apflora.v_tpop_letztertpopber.id)
        AND (apflora.tpopber.jahr = apflora.v_tpop_letztertpopber.jahr))
    ON
      (apflora.tpop.pop_id = apflora.pop.id)
      AND (apflora.tpop.id = apflora.tpopber.tpop_id)
WHERE
  apflora.tpopber.entwicklung = 1
  AND apflora.tpop.apber_relevant = 1
  AND apflora.pop.status  <> 300
GROUP BY
  apflora.pop.ap_id,
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_b5rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b5rtpop AS
SELECT
  apflora.pop.ap_id,
  apflora.tpop.id
FROM
  apflora.tpop
  INNER JOIN
    (apflora.tpopber
    INNER JOIN
      (apflora.pop
      INNER JOIN
        apflora.v_tpop_letztertpopber
        ON apflora.pop.ap_id = apflora.v_tpop_letztertpopber.ap_id)
      ON
        (apflora.tpopber.tpop_id = apflora.v_tpop_letztertpopber.id)
        AND (apflora.tpopber.jahr = apflora.v_tpop_letztertpopber.jahr))
    ON
      (apflora.tpop.pop_id = apflora.pop.id)
      AND (apflora.tpop.id = apflora.tpopber.tpop_id)
WHERE
  apflora.tpopber.entwicklung = 4
  AND apflora.tpop.apber_relevant = 1
  AND apflora.pop.status  <> 300
GROUP BY
  apflora.pop.ap_id,
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_b6rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b6rtpop AS
SELECT
  apflora.pop.ap_id,
  apflora.tpop.id
FROM
  apflora.tpop
  INNER JOIN
    (apflora.tpopber
    INNER JOIN
      (apflora.pop
      INNER JOIN
        apflora.v_tpop_letztertpopber
        ON apflora.pop.ap_id = apflora.v_tpop_letztertpopber.ap_id)
      ON
        (apflora.tpopber.tpop_id = apflora.v_tpop_letztertpopber.id)
        AND (apflora.tpopber.jahr = apflora.v_tpop_letztertpopber.jahr))
    ON
      (apflora.tpop.pop_id = apflora.pop.id)
      AND (apflora.tpop.id = apflora.tpopber.tpop_id)
WHERE
  apflora.tpopber.entwicklung = 8
  AND apflora.tpop.apber_relevant = 1
  AND apflora.pop.status  <> 300
GROUP BY
  apflora.pop.ap_id,
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_c1rpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c1rpop AS
SELECT
  apflora.pop.ap_id,
  apflora.pop.id
FROM
  apflora._variable,
  (apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop.id = apflora.tpop.pop_id)
  INNER JOIN
    apflora.tpopmassn
    ON apflora.tpop.id = apflora.tpopmassn.tpop_id
WHERE
  apflora.tpopmassn.jahr <= apflora._variable.apber_jahr
  AND apflora.tpop.apber_relevant = 1
  AND apflora.pop.status  <> 300
GROUP BY
  apflora.pop.ap_id,
  apflora.pop.id;

DROP VIEW IF EXISTS apflora.v_apber_c3rpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c3rpop AS
SELECT
  apflora.pop.ap_id,
  apflora.pop.id
FROM
  (apflora.v_pop_letztermassnber
  INNER JOIN
    apflora.pop
    ON apflora.v_pop_letztermassnber.ap_id = apflora.pop.ap_id)
  INNER JOIN
    apflora.popmassnber
    ON
      (apflora.pop.id = apflora.popmassnber.pop_id)
      AND (apflora.v_pop_letztermassnber.jahr = apflora.popmassnber.jahr)
      AND (apflora.v_pop_letztermassnber.id = apflora.popmassnber.pop_id)
WHERE
  apflora.popmassnber.beurteilung = 1
GROUP BY
  apflora.pop.ap_id,
  apflora.pop.id;

DROP VIEW IF EXISTS apflora.v_apber_c4rpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c4rpop AS
SELECT
  apflora.pop.ap_id,
  apflora.pop.id
FROM
  (apflora.v_pop_letztermassnber
  INNER JOIN
    apflora.pop
    ON apflora.v_pop_letztermassnber.ap_id = apflora.pop.ap_id)
  INNER JOIN
    apflora.popmassnber
    ON
      (apflora.pop.id = apflora.popmassnber.pop_id)
      AND (apflora.v_pop_letztermassnber.jahr = apflora.popmassnber.jahr)
      AND (apflora.v_pop_letztermassnber.id = apflora.popmassnber.pop_id)
WHERE
  apflora.popmassnber.beurteilung = 2
GROUP BY
  apflora.pop.ap_id,
  apflora.pop.id;

DROP VIEW IF EXISTS apflora.v_apber_c5rpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c5rpop AS
SELECT
  apflora.pop.ap_id,
  apflora.pop.id
FROM
  (apflora.v_pop_letztermassnber
  INNER JOIN
    apflora.pop
    ON apflora.v_pop_letztermassnber.ap_id = apflora.pop.ap_id)
  INNER JOIN
    apflora.popmassnber
    ON
      (apflora.pop.id = apflora.popmassnber.pop_id)
      AND (apflora.v_pop_letztermassnber.jahr = apflora.popmassnber.jahr)
      AND (apflora.v_pop_letztermassnber.id = apflora.popmassnber.pop_id)
WHERE
  apflora.popmassnber.beurteilung = 3
GROUP BY
  apflora.pop.ap_id,
  apflora.pop.id;

DROP VIEW IF EXISTS apflora.v_apber_c6rpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c6rpop AS
SELECT
  apflora.pop.ap_id,
  apflora.pop.id
FROM
  (apflora.v_pop_letztermassnber
  INNER JOIN
    apflora.pop
    ON apflora.v_pop_letztermassnber.ap_id = apflora.pop.ap_id)
  INNER JOIN
    apflora.popmassnber
    ON
      (apflora.pop.id = apflora.popmassnber.pop_id)
      AND (apflora.v_pop_letztermassnber.id = apflora.popmassnber.pop_id)
      AND (apflora.v_pop_letztermassnber.jahr = apflora.popmassnber.jahr)
WHERE
  apflora.popmassnber.beurteilung = 4
GROUP BY
  apflora.pop.ap_id,
  apflora.pop.id;

DROP VIEW IF EXISTS apflora.v_apber_c7rpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c7rpop AS
SELECT
  apflora.pop.ap_id,
  apflora.pop.id
FROM
  (apflora.v_pop_letztermassnber
  INNER JOIN
    apflora.pop
    ON apflora.v_pop_letztermassnber.ap_id = apflora.pop.ap_id)
  INNER JOIN
    apflora.popmassnber
    ON
      (apflora.pop.id = apflora.popmassnber.pop_id)
      AND (apflora.v_pop_letztermassnber.id = apflora.popmassnber.pop_id)
      AND (apflora.v_pop_letztermassnber.jahr = apflora.popmassnber.jahr)
WHERE
  apflora.popmassnber.beurteilung = 5
GROUP BY
  apflora.pop.ap_id,
  apflora.pop.id;

DROP VIEW IF EXISTS apflora.v_apber_c3rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c3rtpop AS
SELECT
  apflora.pop.ap_id,
  apflora.tpop.id
FROM
  apflora.pop
  INNER JOIN
    ((apflora.v_tpop_letztermassnber
    INNER JOIN
      apflora.tpopmassnber
      ON
        (apflora.v_tpop_letztermassnber.id = apflora.tpopmassnber.tpop_id)
        AND (apflora.v_tpop_letztermassnber.jahr = apflora.tpopmassnber.jahr))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber.tpop_id = apflora.tpop.id)
    ON apflora.pop.id = apflora.tpop.pop_id
WHERE
  apflora.tpopmassnber.beurteilung = 1
GROUP BY
  apflora.pop.ap_id,
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_c4rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c4rtpop AS
SELECT
  apflora.pop.ap_id,
  apflora.tpop.id
FROM
  apflora.pop
  INNER JOIN
    ((apflora.v_tpop_letztermassnber
    INNER JOIN
      apflora.tpopmassnber
      ON
        (apflora.v_tpop_letztermassnber.id = apflora.tpopmassnber.tpop_id)
        AND (apflora.v_tpop_letztermassnber.jahr = apflora.tpopmassnber.jahr))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber.tpop_id = apflora.tpop.id)
    ON apflora.pop.id = apflora.tpop.pop_id
WHERE
  (apflora.tpopmassnber.beurteilung = 2)
GROUP BY
  apflora.pop.ap_id,
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_c5rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c5rtpop AS
SELECT
  apflora.pop.ap_id,
  apflora.tpop.id
FROM
  apflora.pop
  INNER JOIN
    ((apflora.v_tpop_letztermassnber
    INNER JOIN
      apflora.tpopmassnber
      ON
        (apflora.v_tpop_letztermassnber.id = apflora.tpopmassnber.tpop_id)
        AND (apflora.v_tpop_letztermassnber.jahr = apflora.tpopmassnber.jahr))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber.tpop_id = apflora.tpop.id)
    ON apflora.pop.id = apflora.tpop.pop_id
WHERE
  apflora.tpopmassnber.beurteilung = 3
GROUP BY
  apflora.pop.ap_id,
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_c6rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c6rtpop AS
SELECT
  apflora.pop.ap_id,
  apflora.tpop.id
FROM
  apflora.pop
  INNER JOIN
    ((apflora.v_tpop_letztermassnber
    INNER JOIN
      apflora.tpopmassnber
      ON
        (apflora.v_tpop_letztermassnber.id = apflora.tpopmassnber.tpop_id)
        AND (apflora.v_tpop_letztermassnber.jahr = apflora.tpopmassnber.jahr))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber.tpop_id = apflora.tpop.id)
    ON apflora.pop.id = apflora.tpop.pop_id
WHERE
  apflora.tpopmassnber.beurteilung = 4
GROUP BY
  apflora.pop.ap_id,
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_c7rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c7rtpop AS
SELECT
  apflora.pop.ap_id,
  apflora.tpop.id
FROM
  apflora.pop
  INNER JOIN
    ((apflora.v_tpop_letztermassnber
    INNER JOIN
      apflora.tpopmassnber
      ON
        (apflora.v_tpop_letztermassnber.id = apflora.tpopmassnber.tpop_id)
        AND (apflora.v_tpop_letztermassnber.jahr = apflora.tpopmassnber.jahr))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber.tpop_id = apflora.tpop.id)
    ON apflora.pop.id = apflora.tpop.pop_id
WHERE
  apflora.tpopmassnber.beurteilung = 5
GROUP BY
  apflora.pop.ap_id,
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_pop_popberundmassnber CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_popberundmassnber AS
SELECT
  apflora.ap.id AS ap_id,
  apflora.ae_eigenschaften.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  apflora.pop.id as pop_id,
  apflora.pop.nr AS pop_nr,
  apflora.pop.name AS pop_name,
  pop_status_werte.text AS pop_status,
  apflora.pop.bekannt_seit AS pop_bekannt_seit,
  apflora.pop.status_unklar AS pop_status_unklar,
  apflora.pop.status_unklar_begruendung AS pop_status_unklar_begruendung,
  apflora.pop.x AS pop_x,
  apflora.pop.y AS pop_y,
  apflora.pop.changed AS pop_changed,
  apflora.pop.changed_by AS pop_changed_by,
  apflora.v_pop_berundmassnjahre.jahr,
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
      ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
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
            (apflora.v_pop_berundmassnjahre.jahr = apflora.popmassnber.jahr)
            AND (apflora.v_pop_berundmassnjahre.id = apflora.popmassnber.pop_id))
        ON apflora.pop.id = apflora.v_pop_berundmassnjahre.id)
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop.status  = pop_status_werte.code)
      LEFT JOIN
        (apflora.popber
        LEFT JOIN
          apflora.tpop_entwicklung_werte
          ON apflora.popber.entwicklung = tpop_entwicklung_werte.code)
        ON
          (apflora.v_pop_berundmassnjahre.jahr = apflora.popber.jahr)
          AND (apflora.v_pop_berundmassnjahre.id = apflora.popber.pop_id))
      ON apflora.ap.id = apflora.pop.ap_id)
    ON apflora.ae_eigenschaften.id = apflora.ap.art
WHERE
  apflora.ae_eigenschaften.taxid > 150
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop.nr,
  apflora.v_pop_berundmassnjahre.jahr;

DROP VIEW IF EXISTS apflora.v_pop_mit_letzter_popber CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_mit_letzter_popber AS
SELECT
  apflora.ap.id AS ap_id,
  apflora.ae_eigenschaften.artname,
  apflora.ap_bearbstand_werte.text AS ap_status,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  apflora.pop.id as pop_id,
  apflora.pop.nr AS pop_nr,
  apflora.pop.name AS pop_name,
  pop_status_werte.text AS pop_status,
  apflora.pop.bekannt_seit AS pop_bekannt_seit,
  apflora.pop.status_unklar AS pop_status_unklar,
  apflora.pop.status_unklar_begruendung AS pop_status_unklar_begruendung,
  apflora.pop.x AS pop_x,
  apflora.pop.y AS pop_y,
  apflora.pop.changed AS pop_changed,
  apflora.pop.changed_by AS pop_changed_by,
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
      ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
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
        ON apflora.pop.id = apflora.v_pop_letzterpopber0_overall.pop_id)
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop.status  = pop_status_werte.code)
      ON apflora.ap.id = apflora.pop.ap_id)
    ON apflora.ae_eigenschaften.id = apflora.ap.art
WHERE
  apflora.ae_eigenschaften.taxid > 150
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop.nr,
  apflora.v_pop_letzterpopber0_overall.jahr;

DROP VIEW IF EXISTS apflora.v_pop_mit_letzter_popmassnber CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_mit_letzter_popmassnber AS
SELECT
  apflora.ap.id AS ap_id,
  apflora.ae_eigenschaften.artname,
  apflora.ap_bearbstand_werte.text AS ap_status,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.pop.name AS pop_name,
  pop_status_werte.text AS pop_status,
  apflora.pop.bekannt_seit AS pop_bekannt_seit,
  apflora.pop.status_unklar AS pop_status_unklar,
  apflora.pop.status_unklar_begruendung AS pop_status_unklar_begruendung,
  apflora.pop.x AS pop_x,
  apflora.pop.y AS pop_y,
  apflora.pop.changed AS pop_changed,
  apflora.pop.changed_by AS pop_changed_by,
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
      ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
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
            AND (apflora.v_pop_letzterpopbermassn.id = apflora.popmassnber.pop_id))
        ON apflora.pop.id = apflora.v_pop_letzterpopbermassn.id)
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop.status  = pop_status_werte.code)
      ON apflora.ap.id = apflora.pop.ap_id)
    ON apflora.ae_eigenschaften.id = apflora.ap.art
WHERE
  apflora.ae_eigenschaften.taxid > 150
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop.nr,
  apflora.v_pop_letzterpopbermassn.jahr;

DROP VIEW IF EXISTS apflora.v_tpop_popberundmassnber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_popberundmassnber AS
SELECT
  apflora.ap.id AS ap_id,
  apflora.ae_eigenschaften.artname,
  apflora.ap_bearbstand_werte.text AS ap_status,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  apflora.pop.id as pop_id,
  apflora.pop.nr AS pop_nr,
  apflora.pop.name AS pop_name,
  pop_status_werte.text AS pop_status,
  apflora.pop.bekannt_seit AS pop_bekannt_seit,
  apflora.pop.status_unklar AS pop_status_unklar,
  apflora.pop.status_unklar_begruendung AS pop_status_unklar_begruendung,
  apflora.pop.x AS pop_x,
  apflora.pop.y AS pop_y,
  apflora.tpop.id AS tpop_id,
  apflora.tpop.nr AS tpop_nr,
  apflora.tpop.gemeinde AS tpop_gemeinde,
  apflora.tpop.flurname AS tpop_flurname,
  "domPopHerkunft_1".text AS tpop_status,
  apflora.tpop.bekannt_seit AS tpop_bekannt_seit,
  apflora.tpop.status_unklar AS tpop_status_unklar,
  apflora.tpop.status_unklar_grund AS tpop_status_unklar_grund,
  apflora.tpop.x AS tpop_x,
  apflora.tpop.y AS tpop_y,
  apflora.tpop.radius AS tpop_radius,
  apflora.tpop.hoehe AS tpop_hoehe,
  apflora.tpop.exposition AS tpop_exposition,
  apflora.tpop.klima AS tpop_klima,
  apflora.tpop.neigung AS tpop_neigung,
  apflora.tpop.beschreibung AS tpop_beschreibung,
  apflora.tpop.kataster_nr AS tpop_kataster_nr,
  apflora.tpop.apber_relevant AS tpop_apber_relevant,
  apflora.tpop.eigentuemer AS tpop_eigentuemer,
  apflora.tpop.kontakt AS tpop_kontakt,
  apflora.tpop.nutzungszone AS tpop_nutzungszone,
  apflora.tpop.bewirtschafter AS tpop_bewirtschafter,
  apflora.tpop.bewirtschaftung AS tpop_bewirtschaftung,
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
    ON apflora.ae_eigenschaften.id = apflora.ap.art)
  RIGHT JOIN
    (apflora.pop
    RIGHT JOIN
      apflora.tpop
      ON apflora.pop.id = apflora.tpop.pop_id)
    ON apflora.ap.id = apflora.pop.ap_id)
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.pop_status_werte ON apflora.pop.status  = pop_status_werte.code)
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
      AND (apflora.v_tpop_berjahrundmassnjahr.jahr = apflora.tpopmassnber.jahr))
  LEFT JOIN
    apflora.tpopmassn_erfbeurt_werte
    ON apflora.tpopmassnber.beurteilung = tpopmassn_erfbeurt_werte.code)
  LEFT JOIN
    apflora.tpopber
    ON
      (apflora.v_tpop_berjahrundmassnjahr.jahr = apflora.tpopber.jahr)
      AND (apflora.v_tpop_berjahrundmassnjahr.id = apflora.tpopber.tpop_id))
  LEFT JOIN
    apflora.tpop_entwicklung_werte
    ON apflora.tpopber.entwicklung = tpop_entwicklung_werte.code
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop.nr,
  apflora.tpop.nr,
  apflora.v_tpop_berjahrundmassnjahr.jahr;

DROP VIEW IF EXISTS apflora.v_pop_berjahrundmassnjahrvontpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_berjahrundmassnjahrvontpop AS
SELECT
  apflora.tpop.pop_id,
  apflora.v_tpop_berjahrundmassnjahr.jahr
FROM
  apflora.v_tpop_berjahrundmassnjahr
  INNER JOIN
    apflora.tpop
    ON apflora.v_tpop_berjahrundmassnjahr.id = apflora.tpop.id
GROUP BY
  apflora.tpop.pop_id,
  apflora.v_tpop_berjahrundmassnjahr.jahr;

DROP VIEW IF EXISTS apflora.v_tpopber_mitletzterid CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopber_mitletzterid AS
SELECT
  apflora.tpopber.tpop_id,
  apflora.v_tpopber_letzteid.tpopber_anz,
  apflora.tpopber.id,
  apflora.tpopber.jahr,
  apflora.tpop_entwicklung_werte.text AS entwicklung,
  apflora.tpopber.bemerkungen,
  apflora.tpopber.changed,
  apflora.tpopber.changed_by
FROM
  apflora.v_tpopber_letzteid
  INNER JOIN
    apflora.tpopber
    ON
      (apflora.v_tpopber_letzteid.tpopber_letzte_id = apflora.tpopber.id)
      AND (apflora.v_tpopber_letzteid.tpop_id = apflora.tpopber.tpop_id)
  LEFT JOIN
    apflora.tpop_entwicklung_werte
    ON apflora.tpopber.entwicklung = tpop_entwicklung_werte.code;

-- funktioniert nicht, wenn letzeKontrolle als Unterabfrage eingebunden wird.
-- Grund: Unterabfragen in der FROM-Klausel duerfen keine korrellierten Unterabfragen sein
DROP VIEW IF EXISTS apflora.v_tpop_anzkontrinklletzter CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_anzkontrinklletzter AS
SELECT
  apflora.v_tpop.ap_id,
  apflora.v_tpop.familie,
  apflora.v_tpop.artname,
  apflora.v_tpop.ap_bearb_stand,
  apflora.v_tpop.ap_start_jahr,
  apflora.v_tpop.ab_umsetzung_stand,
  apflora.v_tpop.ap_verantwortlich,
  apflora.v_tpop.pop_id,
  apflora.v_tpop.pop_nr,
  apflora.v_tpop.pop_name,
  apflora.v_tpop.pop_status,
  apflora.v_tpop.pop_bekannt_seit,
  apflora.v_tpop.pop_status_unklar,
  apflora.v_tpop.pop_status_unklar_begruendung,
  apflora.v_tpop.pop_x,
  apflora.v_tpop.pop_y,
  apflora.v_tpop.id,
  apflora.v_tpop.nr,
  apflora.v_tpop.gemeinde,
  apflora.v_tpop.flurname,
  apflora.v_tpop.status,
  apflora.v_tpop.bekannt_seit,
  apflora.v_tpop.status_unklar,
  apflora.v_tpop.status_unklar_grund,
  apflora.v_tpop.x,
  apflora.v_tpop.y,
  apflora.v_tpop.radius,
  apflora.v_tpop.hoehe,
  apflora.v_tpop.exposition,
  apflora.v_tpop.klima,
  apflora.v_tpop.neigung,
  apflora.v_tpop.beschreibung,
  apflora.v_tpop.kataster_nr,
  apflora.v_tpop.apber_relevant,
  apflora.v_tpop.eigentuemer,
  apflora.v_tpop.kontakt,
  apflora.v_tpop.nutzungszone,
  apflora.v_tpop.bewirtschafter,
  apflora.v_tpop.bewirtschaftung,
  apflora.v_tpop.changed,
  apflora.v_tpop.changed_by,
  apflora.v_tpop_letzteKontrId."AnzTPopKontr" AS anzahl_kontrollen,
  apflora.v_tpopkontr.id as kontr_id,
  apflora.v_tpopkontr.jahr as kontr_jahr,
  apflora.v_tpopkontr.datum as kontr_datum,
  apflora.v_tpopkontr.typ as kontr_typ,
  apflora.v_tpopkontr.bearbeiter as kontr_bearbeiter,
  apflora.v_tpopkontr.ueberlebensrate as kontr_ueberlebensrate,
  apflora.v_tpopkontr.vitalitaet as kontr_vitalitaet,
  apflora.v_tpopkontr.entwicklung as kontr_entwicklung,
  apflora.v_tpopkontr.ursachen as kontr_ursachen,
  apflora.v_tpopkontr.erfolgsbeurteilung as kontr_erfolgsbeurteilung,
  apflora.v_tpopkontr.umsetzung_aendern as kontr_umsetzung_aendern,
  apflora.v_tpopkontr.kontrolle_aendern as kontr_kontrolle_aendern,
  apflora.v_tpopkontr.bemerkungen as kontr_bemerkungen,
  apflora.v_tpopkontr.lr_delarze as kontr_lr_delarze,
  apflora.v_tpopkontr.lr_umgebung_delarze as kontr_lr_umgebung_delarze,
  apflora.v_tpopkontr.vegetationstyp as kontr_vegetationstyp,
  apflora.v_tpopkontr.konkurrenz as kontr_konkurrenz,
  apflora.v_tpopkontr.moosschicht as kontr_moosschicht,
  apflora.v_tpopkontr.krautschicht as kontr_krautschicht,
  apflora.v_tpopkontr.strauchschicht as kontr_strauchschicht,
  apflora.v_tpopkontr.baumschicht as kontr_baumschicht,
  apflora.v_tpopkontr.boden_typ as kontr_boden_typ,
  apflora.v_tpopkontr.boden_kalkgehalt as kontr_boden_kalkgehalt,
  apflora.v_tpopkontr.boden_durchlaessigkeit as kontr_boden_durchlaessigkeit,
  apflora.v_tpopkontr.boden_humus as kontr_boden_humus,
  apflora.v_tpopkontr.boden_naehrstoffgehalt as kontr_boden_naehrstoffgehalt,
  apflora.v_tpopkontr.boden_abtrag as kontr_boden_abtrag,
  apflora.v_tpopkontr.wasserhaushalt as kontr_wasserhaushalt,
  apflora.v_tpopkontr.idealbiotop_uebereinstimmung as kontr_idealbiotop_uebereinstimmung,
  apflora.v_tpopkontr.handlungsbedarf as kontr_handlungsbedarf,
  apflora.v_tpopkontr.flaeche_ueberprueft as kontr_flaeche_ueberprueft,
  apflora.v_tpopkontr.flaeche as kontr_flaeche,
  apflora.v_tpopkontr.plan_vorhanden as kontr_plan_vorhanden,
  apflora.v_tpopkontr.deckung_vegetation as kontr_deckung_vegetation,
  apflora.v_tpopkontr.deckung_nackter_boden as kontr_deckung_nackter_boden,
  apflora.v_tpopkontr.deckung_ap_art as kontr_deckung_ap_art,
  apflora.v_tpopkontr.jungpflanzen_vorhanden as kontr_jungpflanzen_vorhanden,
  apflora.v_tpopkontr.vegetationshoehe_maximum as kontr_vegetationshoehe_maximum,
  apflora.v_tpopkontr.vegetationshoehe_mittel as kontr_vegetationshoehe_mittel,
  apflora.v_tpopkontr.gefaehrdung as kontr_gefaehrdung,
  apflora.v_tpopkontr.changed as kontr_changed,
  apflora.v_tpopkontr.changed_by as kontr_changed_by,
  apflora.v_tpopkontr.zaehlung_anzahlen as zaehlung_anzahlen,
  apflora.v_tpopkontr.zaehlung_einheiten AS zaehlung_einheiten,
  apflora.v_tpopkontr.zaehlung_methoden AS zaehlung_methoden
FROM
  (apflora.v_tpop_letzteKontrId
  LEFT JOIN
    apflora.v_tpopkontr
    ON apflora.v_tpop_letzteKontrId."MaxTPopKontrId" = apflora.v_tpopkontr.id::text)
  INNER JOIN
    apflora.v_tpop
    ON apflora.v_tpop_letzteKontrId.id = apflora.v_tpop.id;

DROP VIEW IF EXISTS apflora.v_qk2_tpop_erloschenundrelevantaberletztebeobvor1950 CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_erloschenundrelevantaberletztebeobvor1950 AS
SELECT
  apflora.ap.proj_id,
  apflora.ap.id as ap_id,
  'erloschene Teilpopulation "Fuer AP-Bericht relevant" aber letzte Beobachtung vor 1950:' AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap.id, 'Populationen', apflora.pop.id, 'Teil-Populationen', apflora.tpop.id]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop.nr), concat('Teil-Population (Nr.): ', apflora.tpop.nr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop.id = apflora.tpop.pop_id)
    ON apflora.ap.id = apflora.pop.ap_id
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
    SELECT apflora.beob.tpop_id
    FROM
      apflora.beob
      INNER JOIN
        apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr
        ON apflora.beob.tpop_id = apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr.id
    WHERE
      apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr."MaxJahr" < 1950
  )
ORDER BY
  apflora.pop.nr,
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopberaktuell CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenletzterpopberaktuell AS
SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.pop.ap_id,
  'Population: Status ist "erloschen", der letzte Populations-Bericht meldet aber "aktuell":' AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap.id, 'Populationen', apflora.pop.id]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop.nr)]::text[] AS text
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
      ON apflora.popber.pop_id = apflora.pop.id)
    INNER JOIN
      apflora.tpop
      ON apflora.tpop.pop_id = apflora.pop.id
    ON apflora.pop.ap_id = apflora.ap.id
WHERE
  apflora.popber.entwicklung < 8
  AND apflora.pop.status  IN (101, 202, 211)
  AND apflora.tpop.apber_relevant = 1;

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletzterpopberaktuell CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletzterpopberaktuell AS
SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.pop.ap_id,
  'Teilpopulation: Status ist "erloschen", der letzte Teilpopulations-Bericht meldet aber "aktuell":' AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap.id, 'Populationen', apflora.pop.id, 'Teil-Populationen', apflora.tpop.id]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop.nr), concat('Teil-Population (Nr.): ', apflora.tpop.nr)]::text[] AS text
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
      ON apflora.tpop.pop_id = apflora.pop.id
    ON apflora.pop.ap_id = apflora.ap.id
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
  apflora.ap.id AS fkArt,
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
    ON apflora.ap.bearbeiter = "tblAdresse_2"."AdrId")
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
      ON apflora.pop.id = apflora.tpop.pop_id)
    ON apflora.ap.id = apflora.pop.ap_id
  INNER JOIN apflora.ae_eigenschaften
  ON apflora.ae_eigenschaften.id = apflora.ap.art
WHERE
  -- keine Testarten
  apflora.ae_eigenschaften.taxid > 150
  AND apflora.ae_eigenschaften.taxid < 1000000
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
  AND apflora.ap.id IN (Select "idProjekt" FROM apflora.v_exportevab_projekt)
  AND apflora.pop.id IN (SELECT "idRaum" FROM apflora.v_exportevab_raum)
  AND apflora.tpop.id IN (SELECT "idOrt" FROM apflora.v_exportevab_ort)
  AND apflora.tpopkontr.zeit_id IN (SELECT "idZeitpunkt" FROM apflora.v_exportevab_zeit)
GROUP BY
  apflora.tpopkontr.zeit_id,
  apflora.tpopkontr.tpop_id,
  apflora.tpopkontr.id,
  apflora.tpopkontr.jahr,
  apflora.adresse."EvabIdPerson",
  apflora.ap.id,
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
  apflora.ap.id AS ap_id,
  apflora.ae_eigenschaften.artname,
  apflora.ap_bearbstand_werte.text AS ap_status,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  apflora.pop.id AS pop_id,
  apflora.pop.nr AS pop_nr,
  apflora.pop.name AS pop_name,
  pop_status_werte.text AS pop_status,
  apflora.pop.bekannt_seit AS pop_bekannt_seit,
  apflora.pop.status_unklar AS pop_status_unklar,
  apflora.pop.status_unklar_begruendung AS pop_status_unklar_begruendung,
  apflora.pop.x AS pop_x,
  apflora.pop.y AS pop_y,
  apflora.pop.changed AS pop_changed,
  apflora.pop.changed_by AS pop_changed_by,
  apflora.popmassnber.id AS "PopMassnBer Id",
  apflora.popmassnber.jahr AS "PopMassnBer Jahr",
  tpopmassn_erfbeurt_werte.text AS "PopMassnBer Entwicklung",
  apflora.popmassnber.bemerkungen AS "PopMassnBer Interpretation",
  apflora.popmassnber.changed AS "PopMassnBer MutWann",
  apflora.popmassnber.changed_by AS "PopMassnBer MutWer",
  apflora.v_popmassnber_anzmassn0.anzahl_massnahmen
FROM
  ((((((apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.id = apflora.ap.art)
  INNER JOIN
    apflora.pop
    ON apflora.ap.id = apflora.pop.ap_id)
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop.status  = pop_status_werte.code)
  INNER JOIN
    apflora.popmassnber
      LEFT JOIN
      apflora.v_popmassnber_anzmassn0
      on apflora.v_popmassnber_anzmassn0.pop_id = apflora.popmassnber.pop_id and apflora.v_popmassnber_anzmassn0.jahr = apflora.popmassnber.jahr
    ON apflora.pop.id = apflora.popmassnber.pop_id)
  LEFT JOIN
    apflora.tpopmassn_erfbeurt_werte
    ON apflora.popmassnber.beurteilung = tpopmassn_erfbeurt_werte.code
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop.nr;