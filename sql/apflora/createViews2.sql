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
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS bearbeitung,
  apflora.ap.start_jahr,
  apflora.ap_umsetzung_werte.text AS umsetzung,
  apflora.adresse.name AS bearbeiter,
  apflora.ae_taxonomies.artwert,
  apflora.v_ap_anzmassnprojahr.jahr AS massn_jahr,
  apflora.v_ap_anzmassnprojahr.anzahl_massnahmen AS massn_anzahl,
  apflora.v_ap_anzmassnbisjahr.anzahl_massnahmen AS massn_anzahl_bisher,
  CASE
    WHEN apflora.apber.jahr > 0
    THEN 'ja'
    ELSE 'nein'
  END AS bericht_erstellt
FROM
  apflora.ae_taxonomies
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
        ON apflora.ap.bearbeiter = apflora.adresse.id)
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
      ON apflora.ae_taxonomies.id = apflora.ap.art_id
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.v_ap_anzmassnprojahr.jahr;

DROP VIEW IF EXISTS apflora.v_apber_uebe CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_uebe_apid CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_uebkm CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_uebma CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_uebma_apid CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_uebme CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_uebme_apid CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_uebne CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_uebne_apid CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_uebse CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_uebse_apid CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_uebun CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_uebun_apid CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_uebwe CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_uebwe_apid CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_uebnb000 CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_uebnb00 CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_uebnb0 CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_uebnb CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_uet01 CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_uet_veraengegenvorjahr CASCADE;

DROP VIEW IF EXISTS apflora.v_tpop_statuswidersprichtbericht CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_statuswidersprichtbericht AS
SELECT
  apflora.ae_taxonomies.artname AS "Art",
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
  ((apflora.ae_taxonomies
  INNER JOIN
    apflora.ap
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
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
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.pop.name,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname;

DROP VIEW IF EXISTS apflora.v_apber_injahr CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_b2rpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_b3rpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_b4rpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_b5rpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_b6rpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_b2rtpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_b3rtpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_b4rtpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_b5rtpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_b6rtpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_c1rpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_c3rpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_c4rpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_c5rpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_c6rpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_c7rpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_c3rtpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_c4rtpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_c5rtpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_c6rtpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_c7rtpop CASCADE;

DROP VIEW IF EXISTS apflora.v_pop_popberundmassnber CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_popberundmassnber AS
SELECT
  apflora.ap.id AS ap_id,
  apflora.ae_taxonomies.artname,
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
  apflora.pop.lv95_x AS pop_x,
  apflora.pop.lv95_y AS pop_y,
  apflora.pop.changed AS pop_changed,
  apflora.pop.changed_by AS pop_changed_by,
  apflora.v_pop_berundmassnjahre.jahr,
  apflora.popber.id AS popber_id,
  apflora.popber.jahr AS popber_jahr,
  tpop_entwicklung_werte.text AS popber_entwicklung,
  apflora.popber.bemerkungen AS popber_bemerkungen,
  apflora.popber.changed AS popber_changed,
  apflora.popber.changed_by AS popber_changed_by,
  apflora.popmassnber.id AS popmassnber_id,
  apflora.popmassnber.jahr AS popmassnber_jahr,
  tpopmassn_erfbeurt_werte.text AS popmassnber_entwicklung,
  apflora.popmassnber.bemerkungen AS popmassnber_bemerkungen,
  apflora.popmassnber.changed AS popmassnber_changed,
  apflora.popmassnber.changed_by AS popmassnber_changed_by
FROM
  apflora.ae_taxonomies
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
    ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  apflora.ae_taxonomies.taxid > 150
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.v_pop_berundmassnjahre.jahr;

DROP VIEW IF EXISTS apflora.v_pop_mit_letzter_popber CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_mit_letzter_popber AS
with letzter_popber as (
  SELECT distinct on (apflora.popber.pop_id)
    apflora.popber.pop_id,
    apflora.popber.jahr
  FROM
    apflora.popber
  WHERE
    apflora.popber.jahr IS NOT NULL
  order by
    apflora.popber.pop_id,
    apflora.popber.jahr desc
)
SELECT
  apflora.ap.id AS ap_id,
  apflora.ae_taxonomies.artname,
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
  apflora.pop.lv95_x AS pop_x,
  apflora.pop.lv95_y AS pop_y,
  apflora.pop.changed AS pop_changed,
  apflora.pop.changed_by AS pop_changed_by,
  apflora.popber.id AS popber_id,
  apflora.popber.jahr AS popber_jahr,
  tpop_entwicklung_werte.text AS popber_entwicklung,
  apflora.popber.bemerkungen AS popber_bemerkungen,
  apflora.popber.changed AS popber_changed,
  apflora.popber.changed_by AS popber_changed_by
FROM
  apflora.ae_taxonomies
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
        (letzter_popber
        LEFT JOIN
          (apflora.popber
          LEFT JOIN
            apflora.tpop_entwicklung_werte
            ON apflora.popber.entwicklung = tpop_entwicklung_werte.code)
          ON
            (letzter_popber.jahr = apflora.popber.jahr)
            AND (letzter_popber.pop_id = apflora.popber.pop_id))
        ON apflora.pop.id = letzter_popber.pop_id)
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop.status  = pop_status_werte.code)
      ON apflora.ap.id = apflora.pop.ap_id)
    ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  apflora.ae_taxonomies.taxid > 150
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  letzter_popber.jahr;

DROP VIEW IF EXISTS apflora.v_pop_mit_letzter_popmassnber CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_mit_letzter_popmassnber AS
with pop_letztes_massnberjahr as (
  SELECT distinct on (apflora.popmassnber.pop_id)
    apflora.popmassnber.pop_id AS id,
    apflora.popmassnber.jahr
  FROM
    apflora.popmassnber
  WHERE
    apflora.popmassnber.jahr IS NOT NULL
  order by
    apflora.popmassnber.pop_id,
    apflora.popmassnber.jahr desc
)
SELECT
  apflora.ap.id AS ap_id,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.pop.name AS pop_name,
  pop_status_werte.text AS pop_status,
  apflora.pop.bekannt_seit AS pop_bekannt_seit,
  apflora.pop.status_unklar AS pop_status_unklar,
  apflora.pop.status_unklar_begruendung AS pop_status_unklar_begruendung,
  apflora.pop.lv95_x AS pop_x,
  apflora.pop.lv95_y AS pop_y,
  apflora.pop.changed AS pop_changed,
  apflora.pop.changed_by AS pop_changed_by,
  apflora.popmassnber.id AS popmassnber_id,
  apflora.popmassnber.jahr AS popmassnber_jahr,
  tpopmassn_erfbeurt_werte.text AS popmassnber_entwicklung,
  apflora.popmassnber.bemerkungen AS popmassnber_bemerkungen,
  apflora.popmassnber.changed AS popmassnber_changed,
  apflora.popmassnber.changed_by AS popmassnber_changed_by
FROM
  apflora.ae_taxonomies
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
        (pop_letztes_massnberjahr
        LEFT JOIN
          (apflora.popmassnber
          LEFT JOIN
            apflora.tpopmassn_erfbeurt_werte
            ON apflora.popmassnber.beurteilung = tpopmassn_erfbeurt_werte.code)
          ON
            (pop_letztes_massnberjahr.jahr = apflora.popmassnber.jahr)
            AND (pop_letztes_massnberjahr.id = apflora.popmassnber.pop_id))
        ON apflora.pop.id = pop_letztes_massnberjahr.id)
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop.status  = pop_status_werte.code)
      ON apflora.ap.id = apflora.pop.ap_id)
    ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  apflora.ae_taxonomies.taxid > 150
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  pop_letztes_massnberjahr.jahr;

DROP VIEW IF EXISTS apflora.v_tpop_popberundmassnber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_popberundmassnber AS
SELECT
  apflora.ap.id AS ap_id,
  apflora.ae_taxonomies.artname,
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
  apflora.pop.lv95_x AS pop_x,
  apflora.pop.lv95_y AS pop_y,
  apflora.tpop.id AS tpop_id,
  apflora.tpop.nr AS tpop_nr,
  apflora.tpop.gemeinde AS tpop_gemeinde,
  apflora.tpop.flurname AS tpop_flurname,
  "domPopHerkunft_1".text AS tpop_status,
  apflora.tpop.bekannt_seit AS tpop_bekannt_seit,
  apflora.tpop.status_unklar AS tpop_status_unklar,
  apflora.tpop.status_unklar_grund AS tpop_status_unklar_grund,
  apflora.tpop.lv95_x AS tpop_x,
  apflora.tpop.lv95_y AS tpop_y,
  apflora.tpop.radius AS tpop_radius,
  apflora.tpop.hoehe AS tpop_hoehe,
  apflora.tpop.exposition AS tpop_exposition,
  apflora.tpop.klima AS tpop_klima,
  apflora.tpop.neigung AS tpop_neigung,
  apflora.tpop.beschreibung AS tpop_beschreibung,
  apflora.tpop.kataster_nr AS tpop_kataster_nr,
  apflora.tpop.apber_relevant AS tpop_apber_relevant,
  apflora.tpop.apber_relevant_grund AS tpop_apber_relevant_grund,
  apflora.tpop.eigentuemer AS tpop_eigentuemer,
  apflora.tpop.kontakt AS tpop_kontakt,
  apflora.tpop.nutzungszone AS tpop_nutzungszone,
  apflora.tpop.bewirtschafter AS tpop_bewirtschafter,
  apflora.tpop.bewirtschaftung AS tpop_bewirtschaftung,
  apflora.tpop.ekfrequenz AS tpop_ekfrequenz,
  apflora.tpop.ekfrequenz_abweichend AS tpop_ekfrequenz_abweichend,
  apflora.tpopber.id AS tpopber_id,
  apflora.tpopber.jahr AS tpopber_jahr,
  tpop_entwicklung_werte.text AS tpopber_entwicklung,
  apflora.tpopber.bemerkungen AS tpopber_bemerkungen,
  apflora.tpopber.changed AS tpopber_changed,
  apflora.tpopber.changed_by AS tpopber_changed_by,
  apflora.tpopmassnber.id AS tpopmassnber_id,
  apflora.tpopmassnber.jahr AS tpopmassnber_jahr,
  tpopmassn_erfbeurt_werte.text AS tpopmassnber_entwicklung,
  apflora.tpopmassnber.bemerkungen AS tpopmassnber_bemerkungen,
  apflora.tpopmassnber.changed AS tpopmassnber_changed,
  apflora.tpopmassnber.changed_by AS tpopmassnber_changed_by
FROM
  ((((((((((apflora.ae_taxonomies
  RIGHT JOIN
    apflora.ap
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
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
  apflora.ae_taxonomies.artname,
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
  apflora.v_tpop.ap_bearbeitung,
  apflora.v_tpop.ap_start_jahr,
  apflora.v_tpop.ap_umsetzung,
  apflora.v_tpop.ap_bearbeiter,
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
  apflora.v_tpop.status_decodiert as status,
  apflora.v_tpop.status_decodiert,
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
  apflora.v_tpop.apber_relevant_grund,
  apflora.v_tpop.eigentuemer,
  apflora.v_tpop.kontakt,
  apflora.v_tpop.nutzungszone,
  apflora.v_tpop.bewirtschafter,
  apflora.v_tpop.bewirtschaftung,
  apflora.v_tpop.ekfrequenz,
  apflora.v_tpop.ekfrequenz_abweichend,
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
  apflora.v_tpopkontr.apber_nicht_relevant as kontr_apber_nicht_relevant,
  apflora.v_tpopkontr.apber_nicht_relevant_grund as kontr_apber_nicht_relevant_grund,
  apflora.v_tpopkontr.ekf_bemerkungen as kontr_ekf_bemerkungen,
  apflora.v_tpopkontr.zaehlung_anzahlen as zaehlung_anzahlen,
  apflora.v_tpopkontr.zaehlung_einheiten AS zaehlung_einheiten,
  apflora.v_tpopkontr.zaehlung_methoden AS zaehlung_methoden
FROM
  apflora.v_tpop
  INNER JOIN
    apflora.v_tpop_letzteKontrId
    ON apflora.v_tpop_letzteKontrId.id = apflora.v_tpop.id
  LEFT JOIN
    apflora.v_tpopkontr
    ON apflora.v_tpop_letzteKontrId.tpopkontr_id = apflora.v_tpopkontr.id::text;

DROP VIEW IF EXISTS apflora.v_tpop_erste_und_letzte_kontrolle CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_erste_und_letzte_kontrolle AS
SELECT
  apflora.v_tpop.ap_id,
  apflora.v_tpop.familie,
  apflora.v_tpop.artname,
  apflora.v_tpop.ap_bearbeitung,
  apflora.v_tpop.ap_start_jahr,
  apflora.v_tpop.ap_umsetzung,
  apflora.v_tpop.ap_bearbeiter,
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
  apflora.v_tpop.status_decodiert as status,
  apflora.v_tpop.status_decodiert,
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
  apflora.v_tpop.apber_relevant_grund,
  apflora.v_tpop.eigentuemer,
  apflora.v_tpop.kontakt,
  apflora.v_tpop.nutzungszone,
  apflora.v_tpop.bewirtschafter,
  apflora.v_tpop.bewirtschaftung,
  apflora.v_tpop.ekfrequenz,
  apflora.v_tpop.ekfrequenz_abweichend,
  apflora.v_tpop.changed,
  apflora.v_tpop.changed_by,
  apflora.v_tpop_letzteKontrId."AnzTPopKontr" AS anzahl_kontrollen,
  lk.id as letzte_kontrolle_id,
  lk.jahr as letzte_kontrolle_jahr,
  lk.datum as letzte_kontrolle_datum,
  lk.typ as letzte_kontrolle_typ,
  lk.bearbeiter as letzte_kontrolle_bearbeiter,
  lk.ueberlebensrate as letzte_kontrolle_ueberlebensrate,
  lk.vitalitaet as letzte_kontrolle_vitalitaet,
  lk.entwicklung as letzte_kontrolle_entwicklung,
  lk.ursachen as letzte_kontrolle_ursachen,
  lk.erfolgsbeurteilung as letzte_kontrolle_erfolgsbeurteilung,
  lk.umsetzung_aendern as letzte_kontrolle_umsetzung_aendern,
  lk.kontrolle_aendern as letzte_kontrolle_kontrolle_aendern,
  lk.bemerkungen as letzte_kontrolle_bemerkungen,
  lk.lr_delarze as letzte_kontrolle_lr_delarze,
  lk.lr_umgebung_delarze as letzte_kontrolle_lr_umgebung_delarze,
  lk.vegetationstyp as letzte_kontrolle_vegetationstyp,
  lk.konkurrenz as letzte_kontrolle_konkurrenz,
  lk.moosschicht as letzte_kontrolle_moosschicht,
  lk.krautschicht as letzte_kontrolle_krautschicht,
  lk.strauchschicht as letzte_kontrolle_strauchschicht,
  lk.baumschicht as letzte_kontrolle_baumschicht,
  lk.boden_typ as letzte_kontrolle_boden_typ,
  lk.boden_kalkgehalt as letzte_kontrolle_boden_kalkgehalt,
  lk.boden_durchlaessigkeit as letzte_kontrolle_boden_durchlaessigkeit,
  lk.boden_humus as letzte_kontrolle_boden_humus,
  lk.boden_naehrstoffgehalt as letzte_kontrolle_boden_naehrstoffgehalt,
  lk.boden_abtrag as letzte_kontrolle_boden_abtrag,
  lk.wasserhaushalt as letzte_kontrolle_wasserhaushalt,
  lk.idealbiotop_uebereinstimmung as letzte_kontrolle_idealbiotop_uebereinstimmung,
  lk.handlungsbedarf as letzte_kontrolle_handlungsbedarf,
  lk.flaeche_ueberprueft as letzte_kontrolle_flaeche_ueberprueft,
  lk.flaeche as letzte_kontrolle_flaeche,
  lk.plan_vorhanden as letzte_kontrolle_plan_vorhanden,
  lk.deckung_vegetation as letzte_kontrolle_deckung_vegetation,
  lk.deckung_nackter_boden as letzte_kontrolle_deckung_nackter_boden,
  lk.deckung_ap_art as letzte_kontrolle_deckung_ap_art,
  lk.jungpflanzen_vorhanden as letzte_kontrolle_jungpflanzen_vorhanden,
  lk.vegetationshoehe_maximum as letzte_kontrolle_vegetationshoehe_maximum,
  lk.vegetationshoehe_mittel as letzte_kontrolle_vegetationshoehe_mittel,
  lk.gefaehrdung as letzte_kontrolle_gefaehrdung,
  lk.changed as letzte_kontrolle_changed,
  lk.changed_by as letzte_kontrolle_changed_by,
  lk.apber_nicht_relevant as letzte_kontrolle_apber_nicht_relevant,
  lk.apber_nicht_relevant_grund as letzte_kontrolle_apber_nicht_relevant_grund,
  lk.ekf_bemerkungen as letzte_kontrolle_ekf_bemerkungen,
  lk.zaehlung_anzahlen as letzte_kontrolle_zaehlung_anzahlen,
  lk.zaehlung_einheiten AS letzte_kontrolle_zaehlung_einheiten,
  lk.zaehlung_methoden AS letzte_kontrolle_zaehlung_methoden,
  ek.id as erste_kontrolle_id,
  ek.jahr as erste_kontrolle_jahr,
  ek.datum as erste_kontrolle_datum,
  ek.typ as erste_kontrolle_typ,
  ek.bearbeiter as erste_kontrolle_bearbeiter,
  ek.ueberlebensrate as erste_kontrolle_ueberlebensrate,
  ek.vitalitaet as erste_kontrolle_vitalitaet,
  ek.entwicklung as erste_kontrolle_entwicklung,
  ek.ursachen as erste_kontrolle_ursachen,
  ek.erfolgsbeurteilung as erste_kontrolle_erfolgsbeurteilung,
  ek.umsetzung_aendern as erste_kontrolle_umsetzung_aendern,
  ek.kontrolle_aendern as erste_kontrolle_kontrolle_aendern,
  ek.bemerkungen as erste_kontrolle_bemerkungen,
  ek.lr_delarze as erste_kontrolle_lr_delarze,
  ek.lr_umgebung_delarze as erste_kontrolle_lr_umgebung_delarze,
  ek.vegetationstyp as erste_kontrolle_vegetationstyp,
  ek.konkurrenz as erste_kontrolle_konkurrenz,
  ek.moosschicht as erste_kontrolle_moosschicht,
  ek.krautschicht as erste_kontrolle_krautschicht,
  ek.strauchschicht as erste_kontrolle_strauchschicht,
  ek.baumschicht as erste_kontrolle_baumschicht,
  ek.boden_typ as erste_kontrolle_boden_typ,
  ek.boden_kalkgehalt as erste_kontrolle_boden_kalkgehalt,
  ek.boden_durchlaessigkeit as erste_kontrolle_boden_durchlaessigkeit,
  ek.boden_humus as erste_kontrolle_boden_humus,
  ek.boden_naehrstoffgehalt as erste_kontrolle_boden_naehrstoffgehalt,
  ek.boden_abtrag as erste_kontrolle_boden_abtrag,
  ek.wasserhaushalt as erste_kontrolle_wasserhaushalt,
  ek.idealbiotop_uebereinstimmung as erste_kontrolle_idealbiotop_uebereinstimmung,
  ek.handlungsbedarf as erste_kontrolle_handlungsbedarf,
  ek.flaeche_ueberprueft as erste_kontrolle_flaeche_ueberprueft,
  ek.flaeche as erste_kontrolle_flaeche,
  ek.plan_vorhanden as erste_kontrolle_plan_vorhanden,
  ek.deckung_vegetation as erste_kontrolle_deckung_vegetation,
  ek.deckung_nackter_boden as erste_kontrolle_deckung_nackter_boden,
  ek.deckung_ap_art as erste_kontrolle_deckung_ap_art,
  ek.jungpflanzen_vorhanden as erste_kontrolle_jungpflanzen_vorhanden,
  ek.vegetationshoehe_maximum as erste_kontrolle_vegetationshoehe_maximum,
  ek.vegetationshoehe_mittel as erste_kontrolle_vegetationshoehe_mittel,
  ek.gefaehrdung as erste_kontrolle_gefaehrdung,
  ek.changed as erste_kontrolle_changed,
  ek.changed_by as erste_kontrolle_changed_by,
  ek.apber_nicht_relevant as erste_kontrolle_apber_nicht_relevant,
  ek.apber_nicht_relevant_grund as erste_kontrolle_apber_nicht_relevant_grund,
  ek.ekf_bemerkungen as erste_kontrolle_ekf_bemerkungen,
  ek.zaehlung_anzahlen as erste_kontrolle_zaehlung_anzahlen,
  ek.zaehlung_einheiten AS erste_kontrolle_zaehlung_einheiten,
  ek.zaehlung_methoden AS erste_kontrolle_zaehlung_methoden
FROM
  apflora.v_tpop
  INNER JOIN
    apflora.v_tpop_letzteKontrId
    ON apflora.v_tpop_letzteKontrId.id = apflora.v_tpop.id
  INNER JOIN
    apflora.v_tpop_ersteKontrId
    ON apflora.v_tpop_ersteKontrId.id = apflora.v_tpop.id
  LEFT JOIN
    apflora.v_tpopkontr as lk
    ON (apflora.v_tpop_letzteKontrId.tpopkontr_id = lk.id::text)
  LEFT JOIN
    apflora.v_tpopkontr as ek
    ON (apflora.v_tpop_ersteKontrId.tpopkontr_id = ek.id::text);    

DROP VIEW IF EXISTS apflora.v_q_tpop_erloschenundrelevantaberletztebeobvor1950 CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_tpop_erloschenundrelevantaberletztebeobvor1950 AS
SELECT
  apflora.ap.proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop.id = apflora.tpop.pop_id)
    ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.tpop.status IN (101, 202)
  AND apflora.tpop.apber_relevant = true
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
        apflora.v_q_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr
        ON apflora.beob.tpop_id = apflora.v_q_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr.id
    WHERE
      apflora.v_q_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr."MaxJahr" < 1950
  )
ORDER BY
  apflora.pop.nr,
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_statuserloschenletzterpopberaktuell CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_statuserloschenletzterpopberaktuell AS
with letzter_popber as (
  SELECT distinct on (apflora.popber.pop_id)
    apflora.popber.pop_id,
    apflora.popber.jahr
  FROM
    apflora.popber
  WHERE
    apflora.popber.jahr IS NOT NULL
  order by
    apflora.popber.pop_id,
    apflora.popber.jahr desc
)
SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.pop.ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.ap
    INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.popber
      INNER JOIN
        letzter_popber
        ON
          (letzter_popber.jahr = apflora.popber.jahr)
          AND (letzter_popber.pop_id = apflora.popber.pop_id))
      ON apflora.popber.pop_id = apflora.pop.id)
    INNER JOIN
      apflora.tpop
      ON apflora.tpop.pop_id = apflora.pop.id
    ON apflora.pop.ap_id = apflora.ap.id
WHERE
  apflora.popber.entwicklung < 8
  AND apflora.pop.status  IN (101, 202)
  AND apflora.tpop.apber_relevant = true
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_tpop_statuserloschenletzterpopberaktuell CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_tpop_statuserloschenletzterpopberaktuell AS
with tpop_letzterpopber as (
  SELECT distinct on (tpop_id)
    tpop_id,
    jahr AS tpopber_jahr
  FROM
    apflora.tpopber
  WHERE
    jahr IS NOT NULL
  order BY
    tpop_id,
    jahr desc
)
SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.pop.ap_id,
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.ap
    INNER JOIN
    apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopber
        INNER JOIN
          tpop_letzterpopber
          ON
            (tpop_letzterpopber.tpopber_jahr = apflora.tpopber.jahr)
            AND (tpop_letzterpopber.tpop_id = apflora.tpopber.tpop_id))
        ON apflora.tpopber.tpop_id = apflora.tpop.id)
      ON apflora.tpop.pop_id = apflora.pop.id
    ON apflora.pop.ap_id = apflora.ap.id
WHERE
  apflora.tpopber.entwicklung < 8
  AND apflora.tpop.status IN (101, 202)
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

DROP VIEW IF EXISTS apflora.v_popmassnber_anzmassn CASCADE;
CREATE OR REPLACE VIEW apflora.v_popmassnber_anzmassn AS
SELECT
  apflora.ap.id AS ap_id,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  apflora.pop.id AS pop_id,
  apflora.pop.nr AS pop_nr,
  apflora.pop.name AS pop_name,
  pop_status_werte.text AS pop_status,
  apflora.pop.bekannt_seit AS pop_bekannt_seit,
  apflora.pop.status_unklar AS pop_status_unklar,
  apflora.pop.status_unklar_begruendung AS pop_status_unklar_begruendung,
  apflora.pop.lv95_x AS pop_x,
  apflora.pop.lv95_y AS pop_y,
  apflora.pop.changed AS pop_changed,
  apflora.pop.changed_by AS pop_changed_by,
  apflora.popmassnber.id AS id,
  apflora.popmassnber.jahr AS jahr,
  tpopmassn_erfbeurt_werte.text AS entwicklung,
  apflora.popmassnber.bemerkungen AS bemerkungen,
  apflora.popmassnber.changed AS changed,
  apflora.popmassnber.changed_by AS changed_by,
  apflora.v_popmassnber_anzmassn0.anzahl_massnahmen
FROM
  ((((((apflora.ae_taxonomies
  INNER JOIN
    apflora.ap
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
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
  apflora.ae_taxonomies.artname,
  apflora.pop.nr;