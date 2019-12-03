drop view if exists apflora.v_tax_list cascade;
drop view if exists apflora.v_ae_tax_list cascade;
create or replace view apflora.v_ae_tax_list as
select distinct
  taxonomie_id,
  taxonomie_name
from apflora.ae_taxonomies
order by taxonomie_name;

DROP VIEW IF EXISTS apflora.v_tpop_for_ap CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_for_ap AS
SELECT
  apflora.tpop.*,
  -- when renaming ap_id need to rename also in fetchTpopForAp.js
  apflora.ap.id AS ap_id
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap.id = apflora.pop.ap_id
  INNER JOIN
    apflora.tpop
    ON apflora.pop.id = apflora.tpop.pop_id;

DROP VIEW IF EXISTS apflora.v_tpopkoord CASCADE;

DROP VIEW IF EXISTS apflora.v_pop_berundmassnjahre CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_berundmassnjahre AS
SELECT
  apflora.pop.id,
  apflora.popber.jahr
FROM
  apflora.pop
  INNER JOIN
    apflora.popber
    ON apflora.pop.id = apflora.popber.pop_id
UNION DISTINCT SELECT
  apflora.pop.id,
  apflora.popmassnber.jahr
FROM
  apflora.pop
  INNER JOIN
    apflora.popmassnber
    ON apflora.pop.id = apflora.popmassnber.pop_id
ORDER BY
  jahr;

DROP VIEW IF EXISTS apflora.v_popmassnber_anzmassn0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_popmassnber_anzmassn0 AS
SELECT
  apflora.popmassnber.pop_id,
  apflora.popmassnber.jahr,
  count(apflora.tpopmassn.id) AS anzahl_massnahmen
FROM
  apflora.popmassnber
  INNER JOIN
    (apflora.tpop
    LEFT JOIN
      apflora.tpopmassn
      ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
    ON apflora.popmassnber.pop_id = apflora.tpop.pop_id
WHERE
  apflora.tpopmassn.jahr = apflora.popmassnber.jahr
  Or apflora.tpopmassn.jahr IS NULL
GROUP BY
  apflora.popmassnber.pop_id,
  apflora.popmassnber.jahr
ORDER BY
  apflora.popmassnber.pop_id,
  apflora.popmassnber.jahr;

DROP VIEW IF EXISTS apflora.v_massn_jahre CASCADE;
CREATE OR REPLACE VIEW apflora.v_massn_jahre AS
SELECT
  apflora.tpopmassn.jahr
FROM
  apflora.tpopmassn
GROUP BY
  apflora.tpopmassn.jahr
HAVING
  apflora.tpopmassn.jahr BETWEEN 1900 AND 2100
ORDER BY
  apflora.tpopmassn.jahr;

DROP VIEW IF EXISTS apflora.v_ap_anzmassnprojahr0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_anzmassnprojahr0 AS
SELECT
  apflora.ap.id,
  apflora.tpopmassn.jahr,
  count(apflora.tpopmassn.id) AS "AnzahlvonTPopMassnId"
FROM
  apflora.ap
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop.id = apflora.tpop.pop_id)
    INNER JOIN
      apflora.tpopmassn
      ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
    ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.ap.bearbeitung BETWEEN 1 AND 3
  AND apflora.tpop.apber_relevant = true
  AND apflora.pop.status  <> 300
GROUP BY
  apflora.ap.id,
  apflora.tpopmassn.jahr
HAVING
  apflora.tpopmassn.jahr IS NOT NULL
ORDER BY
  apflora.ap.id,
  apflora.tpopmassn.jahr;

DROP VIEW IF EXISTS apflora.v_ap_apberrelevant CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_apberrelevant AS
SELECT
  apflora.ap.id
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop.id = apflora.tpop.pop_id)
    ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.tpop.apber_relevant = true
  AND apflora.pop.status  <> 300
GROUP BY
  apflora.ap.id;

DROP VIEW IF EXISTS apflora.v_massn_webgisbun CASCADE;
CREATE OR REPLACE VIEW apflora.v_massn_webgisbun AS
SELECT
  apflora.ap.id AS "APARTID",
  apflora.ae_taxonomies.artname AS "APART",
  apflora.pop.id AS "POPGUID",
  apflora.pop.nr AS "POPNR",
  apflora.tpop.id AS "TPOPGUID",
  apflora.tpop.nr AS "TPOPNR",
  apflora.tpop.lv95_x AS "TPOP_X",
  apflora.tpop.lv95_y AS "TPOP_Y",
  apflora.tpop.wgs84_lat AS "TPOP_WGS84LAT",
  apflora.tpop.wgs84_long AS "TPOP_WGS84LONG",
  apflora.tpop.apber_relevant AS "TPop_apber_relevant",
  apberrelevant_grund_werte.text AS "TPop_apber_relevant_grund",
  pop_status_werte_2.text AS "TPOPSTATUS",
  apflora.tpopmassn.id AS "MASSNGUID",
  apflora.tpopmassn.jahr AS "MASSNJAHR",
  to_char(apflora.tpopmassn.datum, 'DD.MM.YY') AS "MASSNDAT",
  tpopmassn_typ_werte.text AS "MASSTYP",
  apflora.tpopmassn.beschreibung AS "MASSNMASSNAHME",
  apflora.adresse.name AS "MASSNBEARBEITER",
  apflora.tpopmassn.bemerkungen::char AS "MASSNBEMERKUNG",
  apflora.tpopmassn.plan_vorhanden AS "MASSNPLAN",
  apflora.tpopmassn.plan_bezeichnung AS "MASSPLANBEZ",
  apflora.tpopmassn.flaeche AS "MASSNFLAECHE",
  apflora.tpopmassn.form AS "MASSNFORMANSIEDL",
  apflora.tpopmassn.pflanzanordnung AS "MASSNPFLANZANORDNUNG",
  apflora.tpopmassn.markierung AS "MASSNMARKIERUNG",
  apflora.tpopmassn.anz_triebe AS "MASSNANZTRIEBE",
  apflora.tpopmassn.anz_pflanzen AS "MASSNANZPFLANZEN",
  apflora.tpopmassn.anz_pflanzstellen AS "MASSNANZPFLANZSTELLEN",
  apflora.tpopmassn.wirtspflanze AS "MASSNWIRTSPFLANZEN",
  apflora.tpopmassn.herkunft_pop AS "MASSNHERKUNFTSPOP",
  apflora.tpopmassn.sammeldatum AS "MASSNSAMMELDAT",
  to_char(apflora.tpopmassn.changed, 'DD.MM.YY') AS "MASSNCHANGEDAT",
  apflora.tpopmassn.changed_by AS "MASSNCHANGEBY"
FROM
  ((((((apflora.ae_taxonomies
  INNER JOIN
    apflora.ap ON apflora.ae_taxonomies.id = apflora.ap.art_id)
    INNER JOIN
      ((apflora.pop
      INNER JOIN
        apflora.tpop
          LEFT JOIN
            apflora.tpop_apberrelevant_grund_werte AS apberrelevant_grund_werte
            ON apflora.tpop.apber_relevant_grund = apberrelevant_grund_werte.code
        ON apflora.pop.id = apflora.tpop.pop_id)
      INNER JOIN
        (apflora.tpopmassn
        LEFT JOIN
          apflora.tpopmassn_typ_werte
          ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code)
        ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
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
  LEFT JOIN
    apflora.pop_status_werte AS pop_status_werte_2
    ON apflora.tpop.status = pop_status_werte_2.code)
  LEFT JOIN
    apflora.adresse
    ON apflora.tpopmassn.bearbeiter = apflora.adresse.id
WHERE
  apflora.ae_taxonomies.taxid > 150
  and apflora.tpop.status not in (202, 300)
  and (apflora.tpop.apber_relevant_grund != 3 or apflora.tpop.apber_relevant_grund is null)
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr,
  apflora.tpopmassn.jahr,
  apflora.tpopmassn.datum,
  tpopmassn_typ_werte.text;

DROP VIEW IF EXISTS apflora.v_massn_fuergis_write CASCADE;
CREATE OR REPLACE VIEW apflora.v_massn_fuergis_write AS
SELECT
  apflora.tpopmassn.tpop_id AS tpop_id,
  CAST(apflora.tpopmassn.id AS varchar(50)) AS massn_id,
  apflora.tpopmassn.typ AS massn_typ,
  apflora.tpopmassn.jahr AS massn_jahr,
  apflora.tpopmassn.datum::timestamp AS massn_datum,
  apflora.tpopmassn.bearbeiter AS massn_bearbeiter,
  apflora.tpopmassn.beschreibung AS massn_beschreibung,
  apflora.tpopmassn.plan_vorhanden AS massn_plan_vorhanden,
  apflora.tpopmassn.plan_bezeichnung AS massn_plan_bezeichnung,
  apflora.tpopmassn.flaeche AS massn_flaeche,
  apflora.tpopmassn.form AS massn_form,
  apflora.tpopmassn.pflanzanordnung AS massn_pflanzanordnung,
  apflora.tpopmassn.markierung AS massn_markierung,
  apflora.tpopmassn.anz_triebe AS massn_anz_triebe,
  apflora.tpopmassn.anz_pflanzen AS massn_anz_pflanzen,
  apflora.tpopmassn.anz_pflanzstellen AS massn_anz_pflanzstellen,
  apflora.tpopmassn.wirtspflanze AS massn_wirtspflanze,
  apflora.tpopmassn.herkunft_pop AS massn_herkunft_pop,
  apflora.tpopmassn.sammeldatum AS massn_sammeldatum,
  apflora.tpopmassn.bemerkungen AS massn_bemerkungen,
  apflora.tpopmassn.changed::timestamp AS massn_changed,
  apflora.tpopmassn.changed_by AS massn_changed_by
FROM
  apflora.tpopmassn;

DROP VIEW IF EXISTS apflora.v_massn_fuergis_read CASCADE;
CREATE OR REPLACE VIEW apflora.v_massn_fuergis_read AS
SELECT
  apflora.ap.id AS ap_id,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  CAST(apflora.pop.id AS varchar(50)) AS pop_id,
  apflora.pop.nr AS pop_nr,
  apflora.pop.name AS pop_name,
  pop_status_werte.text AS pop_status,
  apflora.pop.bekannt_seit AS pop_bekannt_seit,
  apflora.pop.lv95_x AS pop_x,
  apflora.pop.lv95_y AS pop_y,
  CAST(apflora.tpop.id AS varchar(50)) AS tpop_id,
  apflora.tpop.nr AS tpop_nr,
  apflora.tpop.gemeinde AS tpop_gemeinde,
  apflora.tpop.flurname AS tpop_flurname,
  pop_status_werte_2.text AS tpop_status,
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
  apflora.adresse.name AS tpop_bearbeiter,
  apflora.tpop.apber_relevant AS tpop_apber_relevant,
  apflora.tpop.apber_relevant_grund AS tpop_apber_relevant_grund,
  apflora.tpop.bekannt_seit AS tpop_bekannt_seit,
  apflora.tpop.eigentuemer AS tpop_eigentuemer,
  apflora.tpop.kontakt AS tpop_kontakt,
  apflora.tpop.nutzungszone AS tpop_nutzungszone,
  apflora.tpop.bewirtschafter AS tpop_bewirtschafter,
  apflora.tpop.bewirtschaftung AS tpop_bewirtschaftung,
  CAST(apflora.tpopmassn.id AS varchar(50)) AS massn_id,
  apflora.tpopmassn.jahr AS massn_jahr,
  apflora.tpopmassn.datum::timestamp AS massn_datum,
  tpopmassn_typ_werte.text AS massn_typ,
  apflora.tpopmassn.beschreibung AS massn_beschreibung,
  apflora.adresse.name AS massn_bearbeiter,
  apflora.tpopmassn.plan_vorhanden AS massn_plan_vorhanden,
  apflora.tpopmassn.plan_bezeichnung AS massn_plan_bezeichnung,
  apflora.tpopmassn.flaeche AS massn_flaeche,
  apflora.tpopmassn.form AS massn_form,
  apflora.tpopmassn.pflanzanordnung AS massn_pflanzanordnung,
  apflora.tpopmassn.markierung AS massn_markierung,
  apflora.tpopmassn.anz_triebe AS massn_anz_triebe,
  apflora.tpopmassn.anz_pflanzen AS massn_anz_pflanzen,
  apflora.tpopmassn.anz_pflanzstellen AS massn_anz_pflanzstellen,
  apflora.tpopmassn.wirtspflanze AS massn_wirtspflanze,
  apflora.tpopmassn.herkunft_pop AS massn_herkunft_pop,
  apflora.tpopmassn.sammeldatum AS massn_sammeldatum,
  apflora.tpopmassn.changed::timestamp AS massn_changed,
  apflora.tpopmassn.changed_by AS massn_changed_by
FROM
  ((((((apflora.ae_taxonomies
  INNER JOIN
    apflora.ap ON apflora.ae_taxonomies.id = apflora.ap.art_id)
    INNER JOIN
      ((apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.pop.id = apflora.tpop.pop_id)
      INNER JOIN
        (apflora.tpopmassn
        LEFT JOIN
          apflora.tpopmassn_typ_werte
          ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code)
        ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
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
  LEFT JOIN
    apflora.pop_status_werte AS pop_status_werte_2
    ON apflora.tpop.status = pop_status_werte_2.code)
  LEFT JOIN
    apflora.adresse
    ON apflora.tpopmassn.bearbeiter = apflora.adresse.id
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr,
  apflora.tpopmassn.jahr,
  apflora.tpopmassn.datum,
  tpopmassn_typ_werte.text;

DROP VIEW IF EXISTS apflora.v_tpop_anzmassn CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_anzmassn AS
SELECT
  apflora.ap.id AS ap_id,
  apflora.ae_taxonomies.familie,
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
  apflora.tpop.id,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname,
  pop_status_werte_2.text AS status,
  apflora.tpop.bekannt_seit,
  apflora.tpop.status_unklar,
  apflora.tpop.status_unklar_grund,
  apflora.tpop.lv95_x as x,
  apflora.tpop.lv95_y as y,
  apflora.tpop.radius,
  apflora.tpop.hoehe,
  apflora.tpop.exposition,
  apflora.tpop.klima,
  apflora.tpop.neigung,
  apflora.tpop.beschreibung,
  apflora.tpop.kataster_nr,
  apflora.tpop.apber_relevant,
  apflora.tpop.apber_relevant_grund,
  apflora.tpop.eigentuemer,
  apflora.tpop.kontakt,
  apflora.tpop.nutzungszone,
  apflora.tpop.bewirtschafter,
  apflora.tpop.bewirtschaftung,
  apflora.tpop.ekfrequenz,
  apflora.tpop.ekfrequenz_abweichend,
  count(apflora.tpopmassn.id) AS anzahl_massnahmen
FROM
  apflora.ae_taxonomies
  INNER JOIN
    (((apflora.ap
    INNER JOIN
      ((apflora.pop
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop.status  = pop_status_werte.code)
      INNER JOIN
        ((apflora.tpop
        LEFT JOIN
          apflora.tpopmassn
          ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
        LEFT JOIN
          apflora.pop_status_werte AS pop_status_werte_2
          ON apflora.tpop.status = pop_status_werte_2.code)
        ON apflora.pop.id = apflora.tpop.pop_id)
      ON apflora.ap.id = apflora.pop.ap_id)
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
  ON apflora.ae_taxonomies.id = apflora.ap.art_id
GROUP BY
  apflora.ap.id,
  apflora.ae_taxonomies.familie,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text,
  apflora.ap.start_jahr,
  apflora.ap_umsetzung_werte.text,
  apflora.pop.id,
  apflora.pop.nr,
  apflora.pop.name,
  pop_status_werte.text,
  apflora.pop.bekannt_seit,
  apflora.pop.status_unklar,
  apflora.pop.status_unklar_begruendung,
  apflora.pop.lv95_x,
  apflora.pop.lv95_y,
  apflora.tpop.id,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname,
  pop_status_werte_2.text,
  apflora.tpop.bekannt_seit,
  apflora.tpop.status_unklar,
  apflora.tpop.status_unklar_grund,
  apflora.tpop.lv95_x,
  apflora.tpop.lv95_y,
  apflora.tpop.radius,
  apflora.tpop.hoehe,
  apflora.tpop.exposition,
  apflora.tpop.klima,
  apflora.tpop.neigung,
  apflora.tpop.beschreibung,
  apflora.tpop.kataster_nr,
  apflora.tpop.apber_relevant,
  apflora.tpop.apber_relevant_grund,
  apflora.tpop.eigentuemer,
  apflora.tpop.kontakt,
  apflora.tpop.nutzungszone,
  apflora.tpop.bewirtschafter,
  apflora.tpop.bewirtschaftung
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_pop_anzmassn CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_anzmassn AS
SELECT
  apflora.ap.id AS ap_id,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  apflora.pop.id,
  apflora.pop.nr,
  apflora.pop.name,
  pop_status_werte.text AS status,
  apflora.pop.bekannt_seit,
  apflora.pop.status_unklar,
  apflora.pop.status_unklar_begruendung,
  apflora.pop.lv95_x as x,
  apflora.pop.lv95_y as y,
  count(apflora.tpopmassn.id) AS anzahl_massnahmen
FROM
  ((((apflora.ae_taxonomies
  INNER JOIN
    apflora.ap
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
  INNER JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.tpop
      ON apflora.pop.id = apflora.tpop.pop_id)
    LEFT JOIN
      apflora.tpopmassn
      ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
    ON apflora.ap.id = apflora.pop.ap_id)
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop.status  = pop_status_werte.code
GROUP BY
  apflora.ap.id,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text,
  apflora.ap.start_jahr,
  apflora.ap_umsetzung_werte.text,
  apflora.pop.id,
  apflora.pop.nr,
  apflora.pop.name,
  pop_status_werte.text,
  apflora.pop.status_unklar,
  apflora.pop.status_unklar_begruendung,
  apflora.pop.bekannt_seit,
  apflora.pop.lv95_x,
  apflora.pop.lv95_y
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_pop_anzkontr CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_anzkontr AS
SELECT
  apflora.ap.id AS ap_id,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  apflora.pop.id,
  apflora.pop.nr,
  apflora.pop.name,
  pop_status_werte.text AS status,
  apflora.pop.bekannt_seit,
  apflora.pop.status_unklar,
  apflora.pop.status_unklar_begruendung,
  apflora.pop.lv95_x as x,
  apflora.pop.lv95_y as y,
  count(apflora.tpopkontr.id) AS anzahl_kontrollen
FROM
  ((((apflora.ae_taxonomies
  INNER JOIN
    apflora.ap
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
  INNER JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.tpop
      ON apflora.pop.id = apflora.tpop.pop_id)
    LEFT JOIN
      apflora.tpopkontr
      ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
    ON apflora.ap.id = apflora.pop.ap_id)
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop.status  = pop_status_werte.code
GROUP BY
  apflora.ap.id,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text,
  apflora.ap.start_jahr,
  apflora.ap_umsetzung_werte.text,
  apflora.pop.id,
  apflora.pop.nr,
  apflora.pop.name,
  pop_status_werte.text,
  apflora.pop.status_unklar,
  apflora.pop.status_unklar_begruendung,
  apflora.pop.bekannt_seit,
  apflora.pop.lv95_x,
  apflora.pop.lv95_y
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_ap_anzmassn CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_anzmassn AS
SELECT
  apflora.ap.id,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS bearbeitung,
  apflora.ap.start_jahr,
  apflora.ap_umsetzung_werte.text AS umsetzung,
  count(apflora.tpopmassn.id) AS anzahl_massnahmen
FROM
  (((apflora.ae_taxonomies
  INNER JOIN
    apflora.ap
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
  LEFT JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.tpop
      ON apflora.pop.id = apflora.tpop.pop_id)
    LEFT JOIN
      apflora.tpopmassn
      ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
    ON apflora.ap.id = apflora.pop.ap_id)
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code
GROUP BY
  apflora.ap.id,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text,
  apflora.ap.start_jahr,
  apflora.ap_umsetzung_werte.text
ORDER BY
  apflora.ae_taxonomies.artname;

DROP VIEW IF EXISTS apflora.v_ap_anzkontr CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_anzkontr AS
SELECT
  apflora.ap.id,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS bearbeitung,
  apflora.ap.start_jahr,
  apflora.ap_umsetzung_werte.text AS umsetzung,
  count(apflora.tpopkontr.id) AS anzahl_kontrollen
FROM
  (((apflora.ae_taxonomies
  INNER JOIN
    apflora.ap
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
  LEFT JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.tpop
      ON apflora.pop.id = apflora.tpop.pop_id)
    LEFT JOIN
      apflora.tpopkontr
      ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
    ON apflora.ap.id = apflora.pop.ap_id)
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code
GROUP BY
  apflora.ap.id,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text,
  apflora.ap.start_jahr,
  apflora.ap_umsetzung_werte.text
ORDER BY
  apflora.ae_taxonomies.artname;

DROP VIEW IF EXISTS apflora.v_pop_ohnekoord CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_ohnekoord AS
SELECT
  apflora.ap.id as ap_id,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  apflora.pop.id,
  apflora.pop.nr,
  apflora.pop.name,
  pop_status_werte.text AS status,
  apflora.pop.bekannt_seit,
  apflora.pop.status_unklar,
  apflora.pop.status_unklar_begruendung,
  apflora.pop.lv95_x as x,
  apflora.pop.lv95_y as y,
  apflora.pop.changed,
  apflora.pop.changed_by
FROM
  ((((apflora.ae_taxonomies
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
    ON apflora.pop.status  = pop_status_werte.code
WHERE
  apflora.pop.lv95_x IS NULL
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_pop_fuergis_write CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_fuergis_write AS
SELECT
  apflora.pop.ap_id::text,
  apflora.pop.id::text,
  apflora.pop.nr,
  apflora.pop.name,
  apflora.pop.status,
  apflora.pop.status_unklar,
  apflora.pop.status_unklar_begruendung,
  apflora.pop.bekannt_seit,
  apflora.pop.geom_point,
  apflora.pop.changed::timestamp,
  apflora.pop.changed_by
FROM
  apflora.pop;

DROP VIEW IF EXISTS apflora.v_pop_fuergis_read CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_fuergis_read AS
SELECT
  apflora.ap.id AS ap_id,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  apflora.pop.id::text AS id,
  apflora.pop.nr,
  apflora.pop.name,
  pop_status_werte.text AS status,
  apflora.pop.bekannt_seit,
  apflora.pop.status_unklar,
  apflora.pop.status_unklar_begruendung,
  apflora.pop.lv95_x as x,
  apflora.pop.lv95_y as y,
  apflora.pop.changed::timestamp,
  apflora.pop.changed_by
FROM
  ((((apflora.ae_taxonomies
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
    ON apflora.pop.status  = pop_status_werte.code
WHERE
  apflora.pop.lv95_x > 0
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_popber CASCADE;
CREATE OR REPLACE VIEW apflora.v_popber AS
SELECT
  apflora.ap.id as ap_id,
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
  apflora.popber.id,
  apflora.popber.jahr,
  tpop_entwicklung_werte.text AS entwicklung,
  apflora.popber.bemerkungen,
  apflora.popber.changed,
  apflora.popber.changed_by
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
    apflora.popber
    ON apflora.pop.id = apflora.popber.pop_id)
  LEFT JOIN
    apflora.tpop_entwicklung_werte
    ON apflora.popber.entwicklung = tpop_entwicklung_werte.code
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.popber.jahr,
  tpop_entwicklung_werte.text;

DROP VIEW IF EXISTS apflora.v_popmassnber CASCADE;
CREATE OR REPLACE VIEW apflora.v_popmassnber AS
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
  apflora.popmassnber.id,
  apflora.popmassnber.jahr,
  tpopmassn_erfbeurt_werte.text AS beurteilung,
  apflora.popmassnber.bemerkungen,
  apflora.popmassnber.changed,
  apflora.popmassnber.changed_by
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
    ON apflora.pop.id = apflora.popmassnber.pop_id)
  LEFT JOIN
    apflora.tpopmassn_erfbeurt_werte
    ON apflora.popmassnber.beurteilung = tpopmassn_erfbeurt_werte.code
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_tpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop AS
SELECT
  apflora.ap.id AS ap_id,
  apflora.ae_taxonomies.familie,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  apflora.adresse.name AS ap_bearbeiter,
  apflora.pop.id as pop_id,
  apflora.pop.nr AS pop_nr,
  apflora.pop.name AS pop_name,
  pop_status_werte.text AS pop_status,
  apflora.pop.bekannt_seit AS pop_bekannt_seit,
  apflora.pop.status_unklar AS pop_status_unklar,
  apflora.pop.status_unklar_begruendung AS pop_status_unklar_begruendung,
  apflora.pop.lv95_x AS pop_x,
  apflora.pop.lv95_y AS pop_y,
  apflora.tpop.id,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname,
  apflora.tpop.status,
  pop_status_werte_2.text AS status_decodiert,
  apflora.tpop.bekannt_seit,
  apflora.tpop.status_unklar,
  apflora.tpop.status_unklar_grund,
  apflora.tpop.lv95_x as x,
  apflora.tpop.lv95_y as y,
  apflora.tpop.radius,
  apflora.tpop.hoehe,
  apflora.tpop.exposition,
  apflora.tpop.klima,
  apflora.tpop.neigung,
  apflora.tpop.beschreibung,
  apflora.tpop.kataster_nr,
  apflora.tpop.apber_relevant,
  apflora.tpop.apber_relevant_grund,
  apflora.tpop.eigentuemer,
  apflora.tpop.kontakt,
  apflora.tpop.nutzungszone,
  apflora.tpop.bewirtschafter,
  apflora.tpop.bewirtschaftung,
  apflora.tpop.ekfrequenz,
  apflora.tpop.ekfrequenz_abweichend,
  apflora.tpop.changed,
  apflora.tpop.changed_by
FROM
  ((((((apflora.ae_taxonomies
  INNER JOIN
    apflora.ap
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
  INNER JOIN
    (apflora.pop
    INNER JOIN
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
    apflora.pop_status_werte
    ON apflora.pop.status  = pop_status_werte.code)
  LEFT JOIN
    apflora.pop_status_werte AS pop_status_werte_2
    ON apflora.tpop.status = pop_status_werte_2.code)
  LEFT JOIN
    apflora.adresse
    ON apflora.ap.bearbeiter = apflora.adresse.id
WHERE
  apflora.ae_taxonomies.taxid > 150
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_tpop_webgisbun CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_webgisbun AS
SELECT
  apflora.ap.id AS "APARTID",
  apflora.ae_taxonomies.artname AS "APART",
  apflora.ap_bearbstand_werte.text AS "APSTATUS",
  apflora.ap.start_jahr AS "APSTARTJAHR",
  apflora.ap_umsetzung_werte.text AS "APSTANDUMSETZUNG",
  apflora.pop.id AS "POPGUID",
  apflora.pop.nr AS "POPNR",
  apflora.pop.name AS "POPNAME",
  pop_status_werte.text AS "POPSTATUS",
  apflora.pop.status_unklar AS "POPSTATUSUNKLAR",
  apflora.pop.status_unklar_begruendung AS "POPUNKLARGRUND",
  apflora.pop.bekannt_seit AS "POPBEKANNTSEIT",
  apflora.pop.lv95_x AS "POP_X",
  apflora.pop.lv95_y AS "POP_Y",
  apflora.pop.wgs84_lat AS "POP_WGS84LAT",
  apflora.pop.wgs84_long AS "POP_WGS84LONG",
  apflora.tpop.id AS "TPOPID",
  apflora.tpop.id AS "TPOPGUID",
  apflora.tpop.nr AS "TPOPNR",
  apflora.tpop.gemeinde AS "TPOPGEMEINDE",
  apflora.tpop.flurname AS "TPOPFLURNAME",
  apflora.tpop.apber_relevant AS "TPop_apber_relevant",
  apberrelevant_grund_werte.text AS "TPop_apber_relevant_grund",
  pop_status_werte_2.text AS "TPOPSTATUS",
  apflora.tpop.status_unklar AS "TPOPSTATUSUNKLAR",
  apflora.tpop.status_unklar_grund AS "TPOPUNKLARGRUND",
  apflora.tpop.lv95_x AS "TPOP_X",
  apflora.tpop.lv95_y AS "TPOP_Y",
  apflora.tpop.wgs84_lat AS "TPOP_WGS84LAT",
  apflora.tpop.wgs84_long AS "TPOP_WGS84LONG",
  apflora.tpop.radius AS "TPOPRADIUS",
  apflora.tpop.hoehe AS "TPOPHOEHE",
  apflora.tpop.exposition AS "TPOPEXPOSITION",
  apflora.tpop.klima AS "TPOPKLIMA",
  apflora.tpop.neigung AS "TPOPHANGNEIGUNG",
  apflora.tpop.beschreibung AS "TPOPBESCHREIBUNG",
  apflora.tpop.kataster_nr AS "TPOPKATASTERNR",
  apflora.adresse.name AS "TPOPVERANTWORTLICH",
  apflora.tpop.apber_relevant AS "TPOPBERICHTSRELEVANZ",
  apflora.tpop.apber_relevant_grund AS "TPOPBERICHTSRELEVANZGRUND",
  apflora.tpop.bekannt_seit AS "TPOPBEKANNTSEIT",
  apflora.tpop.eigentuemer AS "TPOPEIGENTUEMERIN",
  apflora.tpop.kontakt AS "TPOPKONTAKT_VO",
  apflora.tpop.nutzungszone AS "TPOP_NUTZUNGSZONE",
  apflora.tpop.bewirtschafter AS "TPOPBEWIRTSCHAFTER",
  apflora.tpop.bewirtschaftung AS "TPOPBEWIRTSCHAFTUNG",
  to_char(apflora.tpop.changed, 'DD.MM.YY') AS "TPOPCHANGEDAT",
  apflora.tpop.changed_by AS "TPOPCHANGEBY"
FROM
  ((((((apflora.ae_taxonomies
  INNER JOIN
    apflora.ap
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
        LEFT JOIN
          apflora.tpop_apberrelevant_grund_werte AS apberrelevant_grund_werte
          ON apflora.tpop.apber_relevant_grund = apberrelevant_grund_werte.code
      ON apflora.pop.id = apflora.tpop.pop_id)
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
  LEFT JOIN
    apflora.pop_status_werte AS pop_status_werte_2
    ON apflora.tpop.status = pop_status_werte_2.code)
  LEFT JOIN
    apflora.adresse
    ON apflora.ap.bearbeiter = apflora.adresse.id
WHERE
  apflora.ae_taxonomies.taxid > 150
  and apflora.tpop.status not in (202, 300)
  and (apflora.tpop.apber_relevant_grund != 3 or apflora.tpop.apber_relevant_grund is null)
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_tpop_fuergis_write CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_fuergis_write AS
SELECT
  apflora.tpop.pop_id::text AS pop_id,
  apflora.tpop.id::text AS tpop_id,
  apflora.tpop.nr AS tpop_nr,
  apflora.tpop.gemeinde AS tpop_gemeinde,
  apflora.tpop.flurname AS tpop_flurname,
  apflora.tpop.status AS tpop_status,
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
  apflora.tpop.bekannt_seit AS tpop_bekannt_seit,
  apflora.tpop.eigentuemer AS tpop_eigentuemer,
  apflora.tpop.kontakt AS tpop_kontakt,
  apflora.tpop.nutzungszone AS tpop_nutzungszone,
  apflora.tpop.bewirtschafter AS tpop_bewirtschafter,
  apflora.tpop.bewirtschaftung AS tpop_bewirtschaftung,
  apflora.tpop.bemerkungen AS tpop_bemerkungen,
  apflora.tpop.changed::timestamp AS tpop_changed,
  apflora.tpop.changed_by AS tpop_changed_by
FROM
  apflora.tpop;

DROP VIEW IF EXISTS apflora.v_tpop_fuergis_read CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_fuergis_read AS
SELECT
  apflora.ap.id::text AS ap_id,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  apflora.pop.id::text AS pop_id,
  apflora.pop.nr AS pop_nr,
  apflora.pop.name AS pop_name,
  pop_status_werte.text AS pop_status,
  apflora.pop.bekannt_seit AS pop_bekannt_seit,
  apflora.pop.status_unklar AS pop_status_unklar,
  apflora.pop.status_unklar_begruendung AS pop_status_unklar_begruendung,
  apflora.tpop.id::text AS tpop_id,
  apflora.tpop.nr AS tpop_nr,
  apflora.tpop.gemeinde AS tpop_gemeinde,
  apflora.tpop.flurname AS tpop_flurname,
  pop_status_werte_2.text AS tpop_status,
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
  apflora.tpop.changed::timestamp AS tpop_changed,
  apflora.tpop.changed_by AS tpop_changed_by
FROM
  (((((apflora.ae_taxonomies
  INNER JOIN
    apflora.ap
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
  INNER JOIN
    (apflora.pop
    INNER JOIN
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
    apflora.pop_status_werte
    ON apflora.pop.status  = pop_status_werte.code)
  LEFT JOIN
    apflora.pop_status_werte AS pop_status_werte_2
    ON apflora.tpop.status = pop_status_werte_2.code
WHERE
  apflora.tpop.lv95_y > 0
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr;

-- im Gebrauch durch exportPopVonApOhneStatus.php:
DROP VIEW IF EXISTS apflora.v_pop_vonapohnestatus CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_vonapohnestatus AS
SELECT
  apflora.ap.id as ap_id,
  apflora.ae_taxonomies.artname,
  apflora.ap.bearbeitung AS ap_bearbeitung,
  apflora.pop.id,
  apflora.pop.nr,
  apflora.pop.name,
  apflora.pop.status,
  apflora.pop.lv95_x as x,
  apflora.pop.lv95_y as y
FROM
  apflora.ae_taxonomies
  INNER JOIN
    (apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.ap.id = apflora.pop.ap_id)
    ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  apflora.ap.bearbeitung = 3
  AND apflora.pop.status  IS NULL
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_apber_zielber CASCADE;
DROP VIEW IF EXISTS apflora.v_abper_ziel CASCADE;

DROP VIEW IF EXISTS apflora.v_pop_massnseitbeginnap CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_massnseitbeginnap AS
SELECT
  apflora.tpopmassn.tpop_id
FROM
  apflora.ap
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop.id = apflora.tpop.pop_id)
    INNER JOIN
      apflora.tpopmassn
      ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
    ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.tpopmassn.jahr >= apflora.ap.start_jahr
GROUP BY
  apflora.tpopmassn.tpop_id;

DROP VIEW IF EXISTS apflora.v_apber CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber AS	
SELECT	
  apflora.ae_taxonomies.artname,	
  apflora.apber.*,	
  apflora.ap_erfkrit_werte.text AS beurteilung_decodiert,	
  apflora.adresse.name AS bearbeiter_decodiert	
FROM	
  apflora.ap	
  INNER JOIN	
    apflora.ae_taxonomies	
    ON (apflora.ap.art_id = apflora.ae_taxonomies.id)	
  INNER JOIN	
    ((apflora.apber	
    LEFT JOIN	
      apflora.ap_erfkrit_werte	
      ON (apflora.apber.beurteilung = apflora.ap_erfkrit_werte.code))	
    LEFT JOIN	
      apflora.adresse	
      ON (apflora.apber.bearbeiter = apflora.adresse.id))	
    ON apflora.ap.id = apflora.apber.ap_id	
ORDER BY	
  apflora.ae_taxonomies.artname;

-- dieser view ist für die Qualitätskontrolle gedacht - daher letzter popber überhaupt
DROP VIEW IF EXISTS apflora.v_pop_letzterpopber0_overall CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_letzterpopber0_overall AS
SELECT
  apflora.popber.pop_id,
  max(apflora.popber.jahr) AS jahr
FROM
  apflora.popber
WHERE
  apflora.popber.jahr IS NOT NULL
GROUP BY
  apflora.popber.pop_id;

DROP VIEW IF EXISTS apflora.v_pop_letzterpopbermassn CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_letzterpopbermassn AS
SELECT
  apflora.popmassnber.pop_id AS id,
  max(apflora.popmassnber.jahr) AS jahr
FROM
  apflora.popmassnber
WHERE
  apflora.popmassnber.jahr IS NOT NULL
GROUP BY
  apflora.popmassnber.pop_id;

-- dieser view ist für die Qualitätskontrolle gedacht - daher letzter tpopber überhaupt
DROP VIEW IF EXISTS apflora.v_tpop_letztertpopber0_overall CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_letztertpopber0_overall AS
SELECT
  tpop_id,
  max(jahr) AS tpopber_jahr
FROM
  apflora.tpopber
WHERE
  jahr IS NOT NULL
GROUP BY
  tpop_id;

DROP VIEW IF EXISTS apflora.v_tpop_mitapaberohnestatus CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_mitapaberohnestatus AS
SELECT
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.pop.nr as pop_nr,
  apflora.pop.name as pop_name,
  pop_status_werte.text AS pop_status,
  apflora.tpop.nr,
  apflora.tpop.flurname,
  apflora.tpop.status AS status
FROM
  (apflora.ap_bearbstand_werte
  INNER JOIN
    (apflora.ae_taxonomies
    INNER JOIN
      apflora.ap
      ON apflora.ae_taxonomies.id = apflora.ap.art_id)
    ON apflora.ap_bearbstand_werte.code = apflora.ap.bearbeitung)
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.pop_status_werte
      ON apflora.pop.status  = pop_status_werte.code)
    INNER JOIN
      apflora.tpop
      ON apflora.pop.id = apflora.tpop.pop_id)
    ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.tpop.status IS NULL
  AND apflora.ap.bearbeitung = 3
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_tpop_ohnebekanntseit CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_ohnebekanntseit AS
SELECT
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.pop.nr as pop_nr,
  apflora.pop.name as pop_name,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname,
  apflora.tpop.bekannt_seit,
  apflora.tpop.id,
  apflora.tpop.lv95_x as x,
  apflora.tpop.lv95_y as y
FROM
  ((apflora.ae_taxonomies
  INNER JOIN
    apflora.ap
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
  INNER JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop.id = apflora.tpop.pop_id)
    ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.tpop.bekannt_seit IS NULL
  AND apflora.ap.bearbeitung BETWEEN 1 AND 3
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.pop.name,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname;

DROP VIEW IF EXISTS apflora.v_tpop_ohnekoord CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_ohnekoord AS
SELECT
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.pop.nr as pop_nr,
  apflora.pop.name as pop_name,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname,
  apflora.tpop.lv95_x as x,
  apflora.tpop.lv95_y as y
FROM
  ((apflora.ae_taxonomies
  INNER JOIN
    apflora.ap
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
  INNER JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop.id = apflora.tpop.pop_id)
    ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.tpop.lv95_x IS NULL
  AND apflora.ap.bearbeitung BETWEEN 1 AND 3
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.pop.name,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname;

DROP VIEW IF EXISTS apflora.v_tpopber_letzterber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopber_letzterber AS
SELECT
  apflora.tpopber.tpop_id,
  max(apflora.tpopber.jahr) AS jahr
FROM
  apflora.tpopber
GROUP BY
  apflora.tpopber.tpop_id;

DROP VIEW IF EXISTS apflora.v_idealbiotop CASCADE;
CREATE OR REPLACE VIEW apflora.v_idealbiotop AS
SELECT
  apflora.ap.id AS ap_id,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  apflora.adresse.name AS ap_bearbeiter,
  apflora.ap.changed AS ap_changed,
  apflora.ap.changed_by AS ap_changed_by,
  apflora.idealbiotop.erstelldatum,
  apflora.idealbiotop.hoehenlage,
  apflora.idealbiotop.region,
  apflora.idealbiotop.exposition,
  apflora.idealbiotop.besonnung,
  apflora.idealbiotop.hangneigung,
  apflora.idealbiotop.boden_typ,
  apflora.idealbiotop.boden_kalkgehalt,
  apflora.idealbiotop.boden_durchlaessigkeit,
  apflora.idealbiotop.boden_humus,
  apflora.idealbiotop.boden_naehrstoffgehalt,
  apflora.idealbiotop.wasserhaushalt,
  apflora.idealbiotop.konkurrenz,
  apflora.idealbiotop.moosschicht,
  apflora.idealbiotop.krautschicht,
  apflora.idealbiotop.strauchschicht,
  apflora.idealbiotop.baumschicht,
  apflora.idealbiotop.bemerkungen,
  apflora.idealbiotop.changed,
  apflora.idealbiotop.changed_by
FROM
  apflora.idealbiotop
  LEFT JOIN
    ((((apflora.ae_taxonomies
    RIGHT JOIN
      apflora.ap
      ON apflora.ae_taxonomies.id = apflora.ap.art_id)
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
    LEFT JOIN
      apflora.adresse
      ON apflora.ap.bearbeiter = apflora.adresse.id)
    ON apflora.idealbiotop.ap_id = apflora.ap.id
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.idealbiotop.erstelldatum;

DROP VIEW IF EXISTS apflora.v_ber CASCADE;
CREATE OR REPLACE VIEW apflora.v_ber AS
SELECT
  apflora.ap.id AS ap_id,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text as ap_bearbeitung,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  apflora.adresse.name AS ap_bearbeiter,
  apflora.ber.id,
  apflora.ber.autor,
  apflora.ber.jahr,
  apflora.ber.titel,
  apflora.ber.url,
  apflora.ber.changed,
  apflora.ber.changed_by
FROM
  ((((apflora.ae_taxonomies
  RIGHT JOIN
    apflora.ap
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.adresse
    ON apflora.ap.bearbeiter = apflora.adresse.id)
  RIGHT JOIN
    apflora.ber
    ON apflora.ap.id = apflora.ber.ap_id
ORDER BY
  apflora.ae_taxonomies.artname;

DROP VIEW IF EXISTS apflora.v_assozart CASCADE;
CREATE OR REPLACE VIEW apflora.v_assozart AS
SELECT
  apflora.ap.id as ap_id,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text as ap_bearbeitung,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  apflora.adresse.name AS ap_bearbeiter,
  apflora.assozart.id,
  "ArtenDb_Arteigenschaften_1".artname as artname_assoziiert,
  apflora.assozart.bemerkungen,
  apflora.assozart.changed,
  apflora.assozart.changed_by
FROM
  apflora.ae_taxonomies AS "ArtenDb_Arteigenschaften_1"
  RIGHT JOIN
    (((((apflora.ae_taxonomies
    RIGHT JOIN
      apflora.ap
      ON apflora.ae_taxonomies.id = apflora.ap.art_id)
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
    LEFT JOIN
      apflora.adresse
      ON apflora.ap.bearbeiter = apflora.adresse.id)
    RIGHT JOIN
      apflora.assozart
      ON apflora.ap.id = apflora.assozart.ap_id)
    ON "ArtenDb_Arteigenschaften_1".id = apflora.assozart.ae_id
ORDER BY
  apflora.ae_taxonomies.artname;

DROP VIEW IF EXISTS apflora.v_ap_ohnepop CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_ohnepop AS
SELECT
  apflora.ap.id,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS bearbeitung,
  apflora.ap.start_jahr AS start_jahr,
  apflora.ap_umsetzung_werte.text AS umsetzung,
  apflora.adresse.name AS bearbeiter,
  apflora.pop.id AS pop_id
FROM
  ((((apflora.ae_taxonomies
  INNER JOIN
    apflora.ap
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
  INNER JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.adresse
    ON apflora.ap.bearbeiter = apflora.adresse.id)
  LEFT JOIN
    apflora.pop
    ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.pop.id IS NULL
ORDER BY
  apflora.ae_taxonomies.artname;

DROP VIEW IF EXISTS apflora.v_ap_anzkontrinjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_anzkontrinjahr AS
SELECT
  apflora.ap.id,
  apflora.ae_taxonomies.artname,
  apflora.tpopkontr.id as tpopkontr_id,
  apflora.tpopkontr.jahr as tpopkontr_jahr
FROM
  (apflora.ap
  INNER JOIN
    apflora.ae_taxonomies
    ON apflora.ap.art_id = apflora.ae_taxonomies.id)
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop.id = apflora.tpop.pop_id)
    ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.ap.bearbeitung BETWEEN 1 AND 3
GROUP BY
  apflora.ap.id,
  apflora.ae_taxonomies.artname,
  apflora.tpopkontr.id,
  apflora.tpopkontr.jahr;

DROP VIEW IF EXISTS apflora.v_erfkrit CASCADE;
CREATE OR REPLACE VIEW apflora.v_erfkrit AS
SELECT
  apflora.ap.id AS ap_id,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  apflora.adresse.name AS ap_bearbeiter,
  apflora.erfkrit.id,
  ap_erfkrit_werte.text AS beurteilung,
  apflora.erfkrit.kriterien,
  apflora.erfkrit.changed,
  apflora.erfkrit.changed_by
FROM
  (((((apflora.ae_taxonomies
  RIGHT JOIN
    apflora.ap
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.adresse
    ON apflora.ap.bearbeiter = apflora.adresse.id)
  RIGHT JOIN
    apflora.erfkrit
    ON apflora.ap.id = apflora.erfkrit.ap_id)
  LEFT JOIN
    apflora.ap_erfkrit_werte
    ON apflora.erfkrit.erfolg = ap_erfkrit_werte.code
ORDER BY
  apflora.ae_taxonomies.artname;

DROP VIEW IF EXISTS apflora.v_ap_tpopmassnjahr0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_tpopmassnjahr0 AS
SELECT
  apflora.ap.id,
  apflora.ae_taxonomies.artname,
  apflora.tpopmassn.id as tpopmassn_id,
  apflora.tpopmassn.jahr as tpopmassn_jahr
FROM
  (apflora.ap
  INNER JOIN
    apflora.ae_taxonomies
    ON apflora.ap.art_id = apflora.ae_taxonomies.id)
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop.id = apflora.tpop.pop_id)
    INNER JOIN
      apflora.tpopmassn
      ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
    ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.ap.bearbeitung BETWEEN 1 AND 3
GROUP BY
  apflora.ap.id,
  apflora.ae_taxonomies.artname,
  apflora.tpopmassn.id,
  apflora.tpopmassn.jahr;

DROP VIEW IF EXISTS apflora.v_auswapbearbmassninjahr0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_auswapbearbmassninjahr0 AS
SELECT
  apflora.adresse.name as bearbeiter,
  apflora.ae_taxonomies.artname,
  apflora.pop.nr as pop_nr,
  apflora.pop.name as pop_name,
  apflora.tpop.nr AS tpop_nr,
  apflora.tpop.gemeinde as tpop_gemeinde,
  apflora.tpop.flurname as tpop_flurname,
  apflora.tpopmassn.jahr,
  tpopmassn_typ_werte.text AS typ,
  apflora.tpopmassn.beschreibung,
  apflora.tpopmassn.datum,
  apflora.tpopmassn.bemerkungen,
  apflora.tpopmassn.plan_vorhanden,
  apflora.tpopmassn.plan_bezeichnung,
  apflora.tpopmassn.flaeche,
  apflora.tpopmassn.markierung,
  apflora.tpopmassn.anz_triebe,
  apflora.tpopmassn.anz_pflanzen,
  apflora.tpopmassn.anz_pflanzstellen,
  apflora.tpopmassn.wirtspflanze,
  apflora.tpopmassn.herkunft_pop,
  apflora.tpopmassn.sammeldatum,
  apflora.tpopmassn.form,
  apflora.tpopmassn.pflanzanordnung
FROM
  (apflora.ae_taxonomies
  INNER JOIN
    apflora.ap
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop.id = apflora.tpop.pop_id)
    INNER JOIN
      ((apflora.tpopmassn
      LEFT JOIN
        apflora.adresse
        ON apflora.tpopmassn.bearbeiter = apflora.adresse.id)
      INNER JOIN
        apflora.tpopmassn_typ_werte
        ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code)
      ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
    ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.ap.bearbeitung BETWEEN 1 AND 3
ORDER BY
  apflora.adresse.name,
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.pop.name,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname;

DROP VIEW IF EXISTS apflora.v_ap_mitmassninjahr0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_mitmassninjahr0 AS
SELECT
  apflora.ae_taxonomies.artname,
  apflora.pop.nr as pop_nr,
  apflora.pop.name as pop_name,
  apflora.tpop.nr AS tpop_nr,
  apflora.tpop.gemeinde tpop_gemeinde,
  apflora.tpop.flurname as tpop_flurname,
  apflora.tpopmassn.jahr,
  tpopmassn_typ_werte.text AS typ,
  apflora.tpopmassn.beschreibung,
  apflora.tpopmassn.datum,
  apflora.adresse.name AS bearbeiter,
  apflora.tpopmassn.bemerkungen,
  apflora.tpopmassn.plan_vorhanden,
  apflora.tpopmassn.plan_bezeichnung,
  apflora.tpopmassn.flaeche,
  apflora.tpopmassn.markierung,
  apflora.tpopmassn.anz_triebe,
  apflora.tpopmassn.anz_pflanzen,
  apflora.tpopmassn.anz_pflanzstellen,
  apflora.tpopmassn.wirtspflanze,
  apflora.tpopmassn.herkunft_pop,
  apflora.tpopmassn.sammeldatum,
  apflora.tpopmassn.form,
  apflora.tpopmassn.pflanzanordnung
FROM
  (apflora.ae_taxonomies
  INNER JOIN
    apflora.ap
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop.id = apflora.tpop.pop_id)
    INNER JOIN
      ((apflora.tpopmassn
      INNER JOIN
        apflora.tpopmassn_typ_werte
        ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code)
      LEFT JOIN
        apflora.adresse
        ON apflora.tpopmassn.bearbeiter = apflora.adresse.id)
      ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
    ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.ap.bearbeitung BETWEEN 1 AND 3
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.pop.name,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname;

DROP VIEW IF EXISTS apflora.v_tpopmassn_0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopmassn_0 AS
SELECT
  apflora.ap.id as ap_id,
  apflora.ae_taxonomies.artname AS "Art",
  apflora.ap_bearbstand_werte.text AS "Aktionsplan Bearbeitungsstand",
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.pop.name as pop_name,
  apflora.tpop.id AS tpop_id,
  apflora.tpop.nr AS tpop_nr,
  apflora.tpop.flurname as tpop_flurname,
  apflora.tpopmassn.id,
  apflora.tpopmassn.jahr AS "Jahr",
  tpopmassn_typ_werte.text AS "Massnahme",
  apflora.tpopmassn.beschreibung,
  apflora.tpopmassn.datum,
  apflora.adresse.name AS bearbeiter,
  apflora.tpopmassn.bemerkungen,
  apflora.tpopmassn.plan_vorhanden,
  apflora.tpopmassn.plan_bezeichnung,
  apflora.tpopmassn.flaeche,
  apflora.tpopmassn.markierung,
  apflora.tpopmassn.anz_triebe,
  apflora.tpopmassn.anz_pflanzen,
  apflora.tpopmassn.anz_pflanzstellen,
  apflora.tpopmassn.wirtspflanze,
  apflora.tpopmassn.herkunft_pop,
  apflora.tpopmassn.sammeldatum,
  apflora.tpopmassn.form,
  apflora.tpopmassn.pflanzanordnung
FROM
  ((apflora.ae_taxonomies
  INNER JOIN
    apflora.ap
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop.id = apflora.tpop.pop_id)
    INNER JOIN
      ((apflora.tpopmassn
      LEFT JOIN
        apflora.tpopmassn_typ_werte
        ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code)
      LEFT JOIN
        apflora.adresse
        ON apflora.tpopmassn.bearbeiter = apflora.adresse.id)
      ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
    ON apflora.ap.id = apflora.pop.ap_id
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr,
  apflora.tpopmassn.jahr,
  tpopmassn_typ_werte.text;

DROP VIEW IF EXISTS apflora.v_tpopmassn_fueraktap0 CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_b1rpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_b1rtpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_c1rtpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_b1lpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_b2lpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_b3lpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_b4lpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_b5lpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_b6lpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_b7lpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_b1ltpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_b2ltpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_b3ltpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_b4ltpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_b5ltpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_b6ltpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_b7ltpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_c1lpop CASCADE;
DROP VIEW IF EXISTS apflora.v_apber_c1ltpop CASCADE;

DROP VIEW IF EXISTS apflora.v_popber_angezapbestjahr0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_popber_angezapbestjahr0 AS
SELECT
  apflora.ap.id as ap_id,
  apflora.pop.id as pop_id,
  apflora.popber.id,
  apflora.ae_taxonomies.artname AS "Artname",
  apflora.pop.nr as pop_nr,
  apflora.pop.name as pop_name,
  pop_status_werte.text AS status ,
  apflora.popber.jahr AS "PopBerJahr",
  tpop_entwicklung_werte.text AS "PopBerEntwicklung",
  apflora.popber.bemerkungen AS "PopBerTxt"
FROM
  ((apflora.ae_taxonomies
  INNER JOIN
    ((apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.ap.id = apflora.pop.ap_id)
    INNER JOIN
      apflora.popber
      ON apflora.pop.id = apflora.popber.pop_id)
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop.status  = pop_status_werte.code)
  LEFT JOIN
    apflora.tpop_entwicklung_werte
    ON apflora.popber.entwicklung = tpop_entwicklung_werte.code;

DROP VIEW IF EXISTS apflora.v_ziel CASCADE;
CREATE OR REPLACE VIEW apflora.v_ziel AS
SELECT
  apflora.ap.id as ap_id,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  apflora.adresse.name AS ap_bearbeiter,
  apflora.ziel.id,
  apflora.ziel.jahr,
  ziel_typ_werte.text AS typ,
  apflora.ziel.bezeichnung
FROM
  (((((apflora.ae_taxonomies
  RIGHT JOIN
    apflora.ap
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.adresse
    ON apflora.ap.bearbeiter = apflora.adresse.id)
  RIGHT JOIN
    apflora.ziel
    ON apflora.ap.id = apflora.ziel.ap_id)
  LEFT JOIN
    apflora.ziel_typ_werte
    ON apflora.ziel.typ = ziel_typ_werte.code
WHERE
  apflora.ziel.typ IN (1, 2, 1170775556)
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.ziel.jahr,
  ziel_typ_werte.text,
  apflora.ziel.typ;

DROP VIEW IF EXISTS apflora.v_zielber CASCADE;
CREATE OR REPLACE VIEW apflora.v_zielber AS
SELECT
  apflora.ap.id as ap_id,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  apflora.adresse.name AS ap_bearbeiter,
  apflora.ziel.id AS ziel_id,
  apflora.ziel.jahr AS ziel_jahr,
  ziel_typ_werte.text AS ziel_typ,
  apflora.ziel.bezeichnung AS ziel_bezeichnung,
  apflora.zielber.id,
  apflora.zielber.jahr,
  apflora.zielber.erreichung,
  apflora.zielber.bemerkungen,
  apflora.zielber.changed,
  apflora.zielber.changed_by
FROM
  ((((((apflora.ae_taxonomies
  RIGHT JOIN
    apflora.ap
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.adresse
    ON apflora.ap.bearbeiter = apflora.adresse.id)
  RIGHT JOIN
    apflora.ziel
    ON apflora.ap.id = apflora.ziel.ap_id)
  LEFT JOIN
    apflora.ziel_typ_werte
    ON apflora.ziel.typ = ziel_typ_werte.code)
  RIGHT JOIN
    apflora.zielber
    ON apflora.ziel.id = apflora.zielber.ziel_id
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.ziel.jahr,
  ziel_typ_werte.text,
  apflora.ziel.typ,
  apflora.zielber.jahr;

DROP VIEW IF EXISTS apflora.v_tpopkontr CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr AS
SELECT
  apflora.ap.id AS ap_id,
  apflora.ae_taxonomies.familie,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  apflora_adresse_1.name AS ap_bearbeiter,
  apflora.pop.id as pop_id,
  apflora.pop.nr AS pop_nr,
  apflora.pop.name AS pop_name,
  apflora.pop_status_werte.text AS pop_status,
  apflora.pop.bekannt_seit AS pop_bekannt_seit,
  apflora.tpop.id AS tpop_id,
  apflora.tpop.nr AS tpop_nr,
  apflora.tpop.gemeinde AS tpop_gemeinde,
  apflora.tpop.flurname AS tpop_flurname,
  pop_status_werte_2.text AS tpop_status,
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
  apflora.tpopkontr.id,
  apflora.tpopkontr.jahr,
  apflora.tpopkontr.datum,
  apflora.tpopkontr_typ_werte.text AS typ,
  apflora.adresse.name AS bearbeiter,
  apflora.tpopkontr.ueberlebensrate,
  apflora.tpopkontr.vitalitaet,
  apflora.tpop_entwicklung_werte.text AS entwicklung,
  apflora.tpopkontr.ursachen,
  apflora.tpopkontr.erfolgsbeurteilung,
  apflora.tpopkontr.umsetzung_aendern,
  apflora.tpopkontr.kontrolle_aendern,
  apflora.tpopkontr.bemerkungen,
  apflora.tpopkontr.lr_delarze,
  apflora.tpopkontr.lr_umgebung_delarze,
  apflora.tpopkontr.vegetationstyp,
  apflora.tpopkontr.konkurrenz,
  apflora.tpopkontr.moosschicht,
  apflora.tpopkontr.krautschicht,
  apflora.tpopkontr.strauchschicht,
  apflora.tpopkontr.baumschicht,
  apflora.tpopkontr.boden_typ,
  apflora.tpopkontr.boden_kalkgehalt,
  apflora.tpopkontr.boden_durchlaessigkeit,
  apflora.tpopkontr.boden_humus,
  apflora.tpopkontr.boden_naehrstoffgehalt,
  apflora.tpopkontr.boden_abtrag,
  apflora.tpopkontr.wasserhaushalt,
  apflora.tpopkontr_idbiotuebereinst_werte.text AS idealbiotop_uebereinstimmung,
  apflora.tpopkontr.handlungsbedarf,
  apflora.tpopkontr.flaeche_ueberprueft,
  apflora.tpopkontr.flaeche,
  apflora.tpopkontr.plan_vorhanden,
  apflora.tpopkontr.deckung_vegetation,
  apflora.tpopkontr.deckung_nackter_boden,
  apflora.tpopkontr.deckung_ap_art,
  apflora.tpopkontr.jungpflanzen_vorhanden,
  apflora.tpopkontr.vegetationshoehe_maximum,
  apflora.tpopkontr.vegetationshoehe_mittel,
  apflora.tpopkontr.gefaehrdung,
  apflora.tpopkontr.changed,
  apflora.tpopkontr.changed_by,
  apflora.tpopkontr.apber_nicht_relevant,
  apflora.tpopkontr.apber_nicht_relevant_grund,
  apflora.tpopkontr.ekf_bemerkungen,
  array_to_string(array_agg(apflora.tpopkontrzaehl.anzahl), ', ') AS zaehlung_anzahlen,
  string_agg(apflora.tpopkontrzaehl_einheit_werte.text, ', ') AS zaehlung_einheiten,
  string_agg(apflora.tpopkontrzaehl_methode_werte.text, ', ') AS zaehlung_methoden
FROM
  apflora.pop_status_werte AS pop_status_werte_2
  RIGHT JOIN
    (((((((apflora.ae_taxonomies
    INNER JOIN
      apflora.ap
      ON apflora.ae_taxonomies.id = apflora.ap.art_id)
    INNER JOIN
      (apflora.pop
      INNER JOIN
        (apflora.tpop
        INNER JOIN
          ((((((apflora.tpopkontr
          LEFT JOIN
            apflora.tpopkontr_typ_werte
            ON apflora.tpopkontr.typ = apflora.tpopkontr_typ_werte.text)
          LEFT JOIN
            apflora.adresse
            ON apflora.tpopkontr.bearbeiter = apflora.adresse.id)
          LEFT JOIN
            apflora.tpop_entwicklung_werte
            ON apflora.tpopkontr.entwicklung = apflora.tpop_entwicklung_werte.code)
          LEFT JOIN
            apflora.tpopkontrzaehl
            ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
          LEFT JOIN
            apflora.tpopkontrzaehl_einheit_werte
            ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code)
          LEFT JOIN
            apflora.tpopkontrzaehl_methode_werte
            ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code)
          ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
        ON apflora.pop.id = apflora.tpop.pop_id)
      ON apflora.ap.id = apflora.pop.ap_id)
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
    LEFT JOIN
      apflora.pop_status_werte
      ON apflora.pop.status  = apflora.pop_status_werte.code)
    LEFT JOIN
      apflora.tpopkontr_idbiotuebereinst_werte
      ON apflora.tpopkontr.idealbiotop_uebereinstimmung = apflora.tpopkontr_idbiotuebereinst_werte.code)
  LEFT JOIN
    apflora.adresse AS apflora_adresse_1
    ON apflora.ap.bearbeiter = apflora_adresse_1.id)
  ON pop_status_werte_2.code = apflora.tpop.status
WHERE
  apflora.ae_taxonomies.taxid > 150
GROUP BY
  apflora.ap.id,
  apflora.ae_taxonomies.familie,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text,
  apflora.ap.start_jahr,
  apflora.ap_umsetzung_werte.text,
  apflora_adresse_1.name,
  apflora.pop.id,
  apflora.pop.nr,
  apflora.pop.name,
  apflora.pop_status_werte.text,
  apflora.pop.bekannt_seit,
  apflora.tpop.id,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname,
  pop_status_werte_2.text,
  apflora.tpop.bekannt_seit,
  apflora.tpop.status_unklar,
  apflora.tpop.status_unklar_grund,
  apflora.tpop.lv95_x,
  apflora.tpop.lv95_y,
  apflora.tpop.radius,
  apflora.tpop.hoehe,
  apflora.tpop.exposition,
  apflora.tpop.klima,
  apflora.tpop.neigung,
  apflora.tpop.beschreibung,
  apflora.tpop.kataster_nr,
  apflora.tpop.apber_relevant,
  apflora.tpop.apber_relevant_grund,
  apflora.tpop.eigentuemer,
  apflora.tpop.kontakt,
  apflora.tpop.nutzungszone,
  apflora.tpop.bewirtschafter,
  apflora.tpop.bewirtschaftung,
  apflora.tpop.ekfrequenz,
  apflora.tpop.ekfrequenz_abweichend,
  apflora.tpopkontr.id,
  apflora.tpopkontr.tpop_id,
  apflora.tpopkontr.id,
  apflora.tpopkontr.jahr,
  apflora.tpopkontr.datum,
  apflora.tpopkontr_typ_werte.text,
  apflora.adresse.name,
  apflora.tpopkontr.ueberlebensrate,
  apflora.tpopkontr.vitalitaet,
  apflora.tpop_entwicklung_werte.text,
  apflora.tpopkontr.ursachen,
  apflora.tpopkontr.erfolgsbeurteilung,
  apflora.tpopkontr.umsetzung_aendern,
  apflora.tpopkontr.kontrolle_aendern,
  apflora.tpop.lv95_x,
  apflora.tpop.lv95_y,
  apflora.tpopkontr.bemerkungen,
  apflora.tpopkontr.lr_delarze,
  apflora.tpopkontr.lr_umgebung_delarze,
  apflora.tpopkontr.vegetationstyp,
  apflora.tpopkontr.konkurrenz,
  apflora.tpopkontr.moosschicht,
  apflora.tpopkontr.krautschicht,
  apflora.tpopkontr.strauchschicht,
  apflora.tpopkontr.baumschicht,
  apflora.tpopkontr.boden_typ,
  apflora.tpopkontr.boden_kalkgehalt,
  apflora.tpopkontr.boden_durchlaessigkeit,
  apflora.tpopkontr.boden_humus,
  apflora.tpopkontr.boden_naehrstoffgehalt,
  apflora.tpopkontr.boden_abtrag,
  apflora.tpopkontr.wasserhaushalt,
  apflora.tpopkontr_idbiotuebereinst_werte.text,
  apflora.tpopkontr.handlungsbedarf,
  apflora.tpopkontr.flaeche_ueberprueft,
  apflora.tpopkontr.flaeche,
  apflora.tpopkontr.plan_vorhanden,
  apflora.tpopkontr.deckung_vegetation,
  apflora.tpopkontr.deckung_nackter_boden,
  apflora.tpopkontr.deckung_ap_art,
  apflora.tpopkontr.jungpflanzen_vorhanden,
  apflora.tpopkontr.vegetationshoehe_maximum,
  apflora.tpopkontr.vegetationshoehe_mittel,
  apflora.tpopkontr.gefaehrdung,
  apflora.tpopkontr.changed,
  apflora.tpopkontr.changed_by,
  apflora.tpopkontr.apber_nicht_relevant,
  apflora.tpopkontr.apber_nicht_relevant_grund,
  apflora.tpopkontr.ekf_bemerkungen
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_tpopkontr_webgisbun CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_webgisbun AS
SELECT
  apflora.ap.id AS "APARTID",
  apflora.ae_taxonomies.artname AS "APART",
  apflora.pop.id AS "POPGUID",
  apflora.pop.nr AS "POPNR",
  apflora.tpop.id AS "TPOPGUID",
  apflora.tpop.nr AS "TPOPNR",
  apflora.tpop.apber_relevant AS "TPop_apber_relevant",
  apberrelevant_grund_werte.text AS "TPop_apber_relevant_grund",
  apflora.tpopkontr.id AS "KONTRGUID",
  apflora.tpopkontr.jahr AS "KONTRJAHR",
  to_char(apflora.tpopkontr.datum, 'DD.MM.YY') AS "KONTRDAT",
  apflora.tpopkontr_typ_werte.text AS "KONTRTYP",
  pop_status_werte_2.text AS "TPOPSTATUS",
  apflora.adresse.name AS "KONTRBEARBEITER",
  apflora.tpopkontr.ueberlebensrate AS "KONTRUEBERLEBENSRATE",
  apflora.tpopkontr.vitalitaet AS "KONTRVITALITAET",
  apflora.tpop_entwicklung_werte.text AS "KONTRENTWICKLUNG",
  apflora.tpopkontr.ursachen AS "KONTRURSACHEN",
  apflora.tpopkontr.erfolgsbeurteilung AS "KONTRERFOLGBEURTEIL",
  apflora.tpopkontr.umsetzung_aendern AS "KONTRAENDUMSETZUNG",
  apflora.tpopkontr.kontrolle_aendern AS "KONTRAENDKONTROLLE",
  apflora.tpop.lv95_x AS "KONTR_X",
  apflora.tpop.lv95_y AS "KONTR_Y",
  apflora.tpop.wgs84_lat AS "KONTR_WGS84LAT",
  apflora.tpop.wgs84_long AS "KONTR_WGS84LONG",
  apflora.tpopkontr.bemerkungen AS "KONTRBEMERKUNGEN",
  apflora.tpopkontr.lr_delarze AS "KONTRLRMDELARZE",
  apflora.tpopkontr.lr_umgebung_delarze AS "KONTRDELARZEANGRENZ",
  apflora.tpopkontr.vegetationstyp AS "KONTRVEGTYP",
  apflora.tpopkontr.konkurrenz AS "KONTRKONKURRENZ",
  apflora.tpopkontr.moosschicht AS "KONTRMOOSE",
  apflora.tpopkontr.krautschicht AS "KONTRKRAUTSCHICHT",
  apflora.tpopkontr.strauchschicht AS "KONTRSTRAUCHSCHICHT",
  apflora.tpopkontr.baumschicht AS "KONTRBAUMSCHICHT",
  apflora.tpopkontr.boden_typ AS "KONTRBODENTYP",
  apflora.tpopkontr.boden_kalkgehalt AS "KONTRBODENKALK",
  apflora.tpopkontr.boden_durchlaessigkeit AS "KONTRBODENDURCHLAESSIGK",
  apflora.tpopkontr.boden_humus AS "KONTRBODENHUMUS",
  apflora.tpopkontr.boden_naehrstoffgehalt AS "KONTRBODENNAEHRSTOFF",
  apflora.tpopkontr.boden_abtrag AS "KONTROBERBODENABTRAG",
  apflora.tpopkontr.wasserhaushalt AS "KONTROBODENWASSERHAUSHALT",
  apflora.tpopkontr_idbiotuebereinst_werte.text AS "KONTRUEBEREINSTIMMUNIDEAL",
  apflora.tpopkontr.handlungsbedarf AS "KONTRHANDLUNGSBEDARF",
  apflora.tpopkontr.flaeche_ueberprueft AS "KONTRUEBERPRUFTFLAECHE",
  apflora.tpopkontr.flaeche AS "KONTRFLAECHETPOP",
  apflora.tpopkontr.plan_vorhanden AS "KONTRAUFPLAN",
  apflora.tpopkontr.deckung_vegetation AS "KONTRDECKUNGVEG",
  apflora.tpopkontr.deckung_nackter_boden AS "KONTRDECKUNGBODEN",
  apflora.tpopkontr.deckung_ap_art AS "KONTRDECKUNGART",
  apflora.tpopkontr.jungpflanzen_vorhanden AS "KONTRJUNGEPLANZEN",
  apflora.tpopkontr.vegetationshoehe_maximum AS "KONTRMAXHOEHEVEG",
  apflora.tpopkontr.vegetationshoehe_mittel AS "KONTRMITTELHOEHEVEG",
  apflora.tpopkontr.gefaehrdung AS "KONTRGEFAEHRDUNG",
  to_char(apflora.tpopkontr.changed, 'DD.MM.YY') AS "KONTRCHANGEDAT",
  apflora.tpopkontr.changed_by AS "KONTRCHANGEBY",
  string_agg(apflora.tpopkontrzaehl_einheit_werte.text, ', ') AS "ZAEHLEINHEITEN",
  array_to_string(array_agg(apflora.tpopkontrzaehl.anzahl), ', ') AS "ANZAHLEN",
  string_agg(apflora.tpopkontrzaehl_methode_werte.text, ', ') AS "METHODEN"
FROM
    (((((((apflora.ae_taxonomies
    INNER JOIN
      apflora.ap
      ON apflora.ae_taxonomies.id = apflora.ap.art_id)
    INNER JOIN
      (apflora.pop
      INNER JOIN
        (apflora.tpop
        LEFT JOIN
          apflora.pop_status_werte AS pop_status_werte_2
          ON apflora.tpop.status = pop_status_werte_2.code
        LEFT JOIN
          apflora.tpop_apberrelevant_grund_werte AS apberrelevant_grund_werte
          ON apflora.tpop.apber_relevant_grund = apberrelevant_grund_werte.code
        INNER JOIN
          ((((((apflora.tpopkontr
          LEFT JOIN
            apflora.tpopkontr_typ_werte
            ON apflora.tpopkontr.typ = apflora.tpopkontr_typ_werte.text)
          LEFT JOIN
            apflora.adresse
            ON apflora.tpopkontr.bearbeiter = apflora.adresse.id)
          LEFT JOIN
            apflora.tpop_entwicklung_werte
            ON apflora.tpopkontr.entwicklung = apflora.tpop_entwicklung_werte.code)
          LEFT JOIN
            apflora.tpopkontrzaehl
            ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
          LEFT JOIN
            apflora.tpopkontrzaehl_einheit_werte
            ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code)
          LEFT JOIN
            apflora.tpopkontrzaehl_methode_werte
            ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code)
          ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
        ON apflora.pop.id = apflora.tpop.pop_id)
      ON apflora.ap.id = apflora.pop.ap_id)
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
    LEFT JOIN
      apflora.pop_status_werte
      ON apflora.pop.status  = apflora.pop_status_werte.code)
    LEFT JOIN
      apflora.tpopkontr_idbiotuebereinst_werte
      ON apflora.tpopkontr.idealbiotop_uebereinstimmung = apflora.tpopkontr_idbiotuebereinst_werte.code)
  LEFT JOIN
    apflora.adresse AS apflora_adresse_1
    ON apflora.ap.bearbeiter = apflora_adresse_1.id)
WHERE
  apflora.ae_taxonomies.taxid > 150
  and apflora.tpop.status not in (202, 300)
  and (apflora.tpop.apber_relevant_grund != 3 or apflora.tpop.apber_relevant_grund is null)
GROUP BY
  apflora.ap.id,
  apflora.ae_taxonomies.artname,
  apflora.pop.id,
  apflora.pop.nr,
  apflora.tpop.id,
  apflora.tpop.nr,
  apflora.tpopkontr.tpop_id,
  apflora.tpopkontr.id,
  apflora.tpopkontr.jahr,
  apflora.tpopkontr.datum,
  apflora.tpopkontr_typ_werte.text,
  pop_status_werte_2.text,
  apflora.adresse.name,
  apflora.tpopkontr.ueberlebensrate,
  apflora.tpopkontr.vitalitaet,
  apflora.tpop_entwicklung_werte.text,
  apflora.tpopkontr.ursachen,
  apflora.tpopkontr.erfolgsbeurteilung,
  apflora.tpopkontr.umsetzung_aendern,
  apflora.tpopkontr.kontrolle_aendern,
  apflora.tpop.lv95_x,
  apflora.tpop.lv95_y,
  apflora.tpop.wgs84_lat,
  apflora.tpop.wgs84_long,
  apflora.tpop.apber_relevant,
  apberrelevant_grund_werte.text,
  apflora.tpopkontr.bemerkungen,
  apflora.tpopkontr.lr_delarze,
  apflora.tpopkontr.lr_umgebung_delarze,
  apflora.tpopkontr.vegetationstyp,
  apflora.tpopkontr.konkurrenz,
  apflora.tpopkontr.moosschicht,
  apflora.tpopkontr.krautschicht,
  apflora.tpopkontr.strauchschicht,
  apflora.tpopkontr.baumschicht,
  apflora.tpopkontr.boden_typ,
  apflora.tpopkontr.boden_kalkgehalt,
  apflora.tpopkontr.boden_durchlaessigkeit,
  apflora.tpopkontr.boden_humus,
  apflora.tpopkontr.boden_naehrstoffgehalt,
  apflora.tpopkontr.boden_abtrag,
  apflora.tpopkontr.wasserhaushalt,
  apflora.tpopkontr_idbiotuebereinst_werte.text,
  apflora.tpopkontr.handlungsbedarf,
  apflora.tpopkontr.flaeche_ueberprueft,
  apflora.tpopkontr.flaeche,
  apflora.tpopkontr.plan_vorhanden,
  apflora.tpopkontr.deckung_vegetation,
  apflora.tpopkontr.deckung_nackter_boden,
  apflora.tpopkontr.deckung_ap_art,
  apflora.tpopkontr.jungpflanzen_vorhanden,
  apflora.tpopkontr.vegetationshoehe_maximum,
  apflora.tpopkontr.vegetationshoehe_mittel,
  apflora.tpopkontr.gefaehrdung,
  apflora.tpopkontr.changed,
  apflora.tpopkontr.changed_by
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_tpopkontr_anzprojahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_anzprojahr AS
SELECT
  apflora.tpop.id,
  min(apflora.tpopkontr.jahr) AS "MinTPopKontrJahr",
  max(apflora.tpopkontr.jahr) AS "MaxTPopKontrJahr",
  count(apflora.tpopkontr.id) AS "AnzTPopKontr"
FROM
  apflora.tpop
  LEFT JOIN
    apflora.tpopkontr
    ON apflora.tpop.id = apflora.tpopkontr.tpop_id
WHERE
  (
    apflora.tpopkontr.typ NOT IN ('Ziel', 'Zwischenziel')
    AND apflora.tpopkontr.jahr IS NOT NULL
  )
  OR (
    apflora.tpopkontr.typ IS NULL
    AND apflora.tpopkontr.jahr IS NULL
  )
GROUP BY
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_tpopkontr_letzteid CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_letzteid AS
SELECT
  apflora.v_tpopkontr_anzprojahr.id,
  max(apflora.tpopkontr.id::text) AS tpopkontr_id,
  max(apflora.v_tpopkontr_anzprojahr."AnzTPopKontr") AS "AnzTPopKontr"
FROM
  apflora.tpopkontr
  INNER JOIN
    apflora.v_tpopkontr_anzprojahr
    ON
      (apflora.v_tpopkontr_anzprojahr."MaxTPopKontrJahr" = apflora.tpopkontr.jahr)
      AND (apflora.tpopkontr.tpop_id = apflora.v_tpopkontr_anzprojahr.id)
GROUP BY
  apflora.v_tpopkontr_anzprojahr.id;

DROP VIEW IF EXISTS apflora.v_tpopkontr_ersteid CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_ersteid AS
SELECT
  apflora.v_tpopkontr_anzprojahr.id,
  max(apflora.tpopkontr.id::text) AS tpopkontr_id,
  max(apflora.v_tpopkontr_anzprojahr."AnzTPopKontr") AS "AnzTPopKontr"
FROM
  apflora.tpopkontr
  INNER JOIN
    apflora.v_tpopkontr_anzprojahr
    ON
      (apflora.v_tpopkontr_anzprojahr."MinTPopKontrJahr" = apflora.tpopkontr.jahr)
      AND (apflora.tpopkontr.tpop_id = apflora.v_tpopkontr_anzprojahr.id)
GROUP BY
  apflora.v_tpopkontr_anzprojahr.id;

DROP VIEW IF EXISTS apflora.v_tpop_letzteKontrId CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_letzteKontrId AS
SELECT
  apflora.tpop.id,
  apflora.v_tpopkontr_letzteid.tpopkontr_id,
  apflora.v_tpopkontr_letzteid."AnzTPopKontr"
FROM
  apflora.tpop
  LEFT JOIN
    apflora.v_tpopkontr_letzteid
    ON apflora.tpop.id = apflora.v_tpopkontr_letzteid.id;

DROP VIEW IF EXISTS apflora.v_tpop_ersteKontrId CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_ersteKontrId AS
SELECT
  apflora.tpop.id,
  apflora.v_tpopkontr_ersteid.tpopkontr_id,
  apflora.v_tpopkontr_ersteid."AnzTPopKontr"
FROM
  apflora.tpop
  LEFT JOIN
    apflora.v_tpopkontr_ersteid
    ON apflora.tpop.id = apflora.v_tpopkontr_ersteid.id;

DROP VIEW IF EXISTS apflora.v_tpopber_letzteid CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopber_letzteid AS
SELECT
  apflora.tpopkontr.tpop_id,
  (
    select id
    from apflora.tpopber
    where tpop_id = apflora.tpopkontr.tpop_id
    order by changed desc
    limit 1
  ) AS tpopber_letzte_id,
  max(apflora.tpopber.jahr) AS tpopber_jahr_max,
  count(apflora.tpopber.id) AS tpopber_anz
FROM
  apflora.tpopkontr
  INNER JOIN
    apflora.tpopber
    ON apflora.tpopkontr.tpop_id = apflora.tpopber.tpop_id
WHERE
  apflora.tpopkontr.typ NOT IN ('Ziel', 'Zwischenziel')
  AND apflora.tpopber.jahr IS NOT NULL
GROUP BY
  apflora.tpopkontr.tpop_id;

DROP VIEW IF EXISTS apflora.v_tpopkontr_fuergis_write CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_fuergis_write AS
SELECT
  apflora.tpopkontr.id::text AS id,
  apflora.tpopkontr.typ,
  apflora.tpopkontr.jahr,
  apflora.tpopkontr.datum::timestamp,
  apflora.tpopkontr.bearbeiter,
  apflora.tpopkontr.ueberlebensrate,
  apflora.tpopkontr.entwicklung,
  apflora.tpopkontr.vitalitaet,
  apflora.tpopkontr.ursachen,
  apflora.tpopkontr.erfolgsbeurteilung,
  apflora.tpopkontr.umsetzung_aendern,
  apflora.tpopkontr.kontrolle_aendern,
  apflora.tpopkontr.lr_delarze,
  apflora.tpopkontr.flaeche,
  apflora.tpopkontr.lr_umgebung_delarze,
  apflora.tpopkontr.vegetationstyp,
  apflora.tpopkontr.konkurrenz,
  apflora.tpopkontr.moosschicht,
  apflora.tpopkontr.krautschicht,
  apflora.tpopkontr.strauchschicht,
  apflora.tpopkontr.baumschicht,
  apflora.tpopkontr.boden_typ,
  apflora.tpopkontr.boden_kalkgehalt,
  apflora.tpopkontr.boden_durchlaessigkeit,
  apflora.tpopkontr.boden_humus,
  apflora.tpopkontr.boden_naehrstoffgehalt,
  apflora.tpopkontr.boden_abtrag,
  apflora.tpopkontr.wasserhaushalt,
  apflora.tpopkontr.idealbiotop_uebereinstimmung,
  apflora.tpopkontr.flaeche_ueberprueft,
  apflora.tpopkontr.plan_vorhanden,
  apflora.tpopkontr.deckung_vegetation,
  apflora.tpopkontr.deckung_nackter_boden,
  apflora.tpopkontr.deckung_ap_art,
  apflora.tpopkontr.jungpflanzen_vorhanden,
  apflora.tpopkontr.vegetationshoehe_maximum,
  apflora.tpopkontr.vegetationshoehe_mittel,
  apflora.tpopkontr.gefaehrdung,
  apflora.tpopkontr.bemerkungen,
  apflora.tpopkontr.changed::timestamp,
  apflora.tpopkontr.changed_by
FROM
  apflora.tpopkontr;

DROP VIEW IF EXISTS apflora.v_tpopkontr_fuergis_read CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_fuergis_read AS
SELECT
  apflora.ap.id as ap_id,
  apflora.ae_taxonomies.artname AS artname,
  apflora.ap_bearbstand_werte.text AS apherkunft,
  apflora.ap.start_jahr AS apjahr,
  apflora.ap_umsetzung_werte.text AS apumsetzung,
  CAST(apflora.pop.id AS varchar(50)) AS popid,
  apflora.pop.nr AS popnr,
  apflora.pop.name AS popname,
  apflora.pop_status_werte.text AS popherkunft,
  apflora.pop.bekannt_seit AS popbekanntseit,
  CAST(apflora.tpop.id AS varchar(50)) AS tpopid,
  apflora.tpop.nr AS tpopnr,
  apflora.tpop.gemeinde AS tpopgemeinde,
  apflora.tpop.flurname AS tpopflurname,
  apflora.tpop.lv95_x AS tpopxkoord,
  apflora.tpop.lv95_y AS tpopykoord,
  apflora.tpop.bekannt_seit AS tpopbekanntseit,
  CAST(apflora.tpopkontr.id AS varchar(50)) AS tpopkontrid,
  apflora.tpopkontr.jahr AS tpopkontrjahr,
  apflora.tpopkontr.datum::timestamp AS tpopkontrdatum,
  apflora.tpopkontr_typ_werte.text AS tpopkontrtyp,
  apflora.adresse.name AS tpopkontrbearb,
  apflora.tpopkontr.ueberlebensrate AS tpopkontrueberleb,
  apflora.tpopkontr.vitalitaet AS tpopkontrvitalitaet,
  apflora.tpop_entwicklung_werte.text AS tpopkontrentwicklung,
  apflora.tpopkontr.ursachen AS tpopkontrursach,
  apflora.tpopkontr.erfolgsbeurteilung AS tpopkontrurteil,
  apflora.tpopkontr.umsetzung_aendern AS tpopkontraendums,
  apflora.tpopkontr.kontrolle_aendern AS tpopkontraendkontr,
  apflora.tpopkontr.lr_delarze AS tpopkontrleb,
  apflora.tpopkontr.flaeche AS tpopkontrflaeche,
  apflora.tpopkontr.lr_umgebung_delarze AS tpopkontrlebumg,
  apflora.tpopkontr.vegetationstyp AS tpopkontrvegtyp,
  apflora.tpopkontr.konkurrenz AS tpopkontrkonkurrenz,
  apflora.tpopkontr.moosschicht AS tpopkontrmoosschicht,
  apflora.tpopkontr.krautschicht AS tpopkontrkrautschicht,
  apflora.tpopkontr.strauchschicht AS tpopkontrstrauchschicht,
  apflora.tpopkontr.baumschicht AS tpopkontrbaumschicht,
  apflora.tpopkontr.boden_typ AS tpopkontrbodentyp,
  apflora.tpopkontr.boden_kalkgehalt AS tpopkontrbodenkalkgehalt,
  apflora.tpopkontr.boden_durchlaessigkeit AS tpopkontrbodendurchlaessigkeit,
  apflora.tpopkontr.boden_humus AS tpopkontrbodenhumus,
  apflora.tpopkontr.boden_naehrstoffgehalt AS tpopkontrbodennaehrstoffgehalt,
  apflora.tpopkontr.boden_abtrag AS tpopkontrbodenabtrag,
  apflora.tpopkontr.wasserhaushalt AS tpopkontrwasserhaushalt,
  apflora.tpopkontr_idbiotuebereinst_werte.text AS tpopkontridealbiotopuebereinst,
  apflora.tpopkontr.flaeche_ueberprueft AS tpopkontruebflaeche,
  apflora.tpopkontr.plan_vorhanden AS tpopkontrplan,
  apflora.tpopkontr.deckung_vegetation AS tpopkontrveg,
  apflora.tpopkontr.deckung_nackter_boden AS tpopkontrnabo,
  apflora.tpopkontr.deckung_ap_art AS tpopkontruebpfl,
  apflora.tpopkontr.jungpflanzen_vorhanden AS tpopkontrjungpfljn,
  apflora.tpopkontr.vegetationshoehe_maximum AS tpopkontrveghoemax,
  apflora.tpopkontr.vegetationshoehe_mittel AS tpopkontrveghoemit,
  apflora.tpopkontr.gefaehrdung AS tpopkontrgefaehrdung,
  apflora.tpopkontr.changed::timestamp AS mutwann,
  apflora.tpopkontr.changed_by AS mutwer
FROM
  (((((apflora.ae_taxonomies
  INNER JOIN
    apflora.ap
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (((apflora.tpopkontr
        LEFT JOIN
          apflora.tpopkontr_typ_werte
          ON apflora.tpopkontr.typ = apflora.tpopkontr_typ_werte.text)
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr.bearbeiter = apflora.adresse.id)
        LEFT JOIN
          apflora.tpop_entwicklung_werte
          ON apflora.tpopkontr.entwicklung = apflora.tpop_entwicklung_werte.code)
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop.id = apflora.tpop.pop_id)
    ON apflora.ap.id = apflora.pop.ap_id)
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop.status  = apflora.pop_status_werte.code)
  LEFT JOIN
    apflora.tpopkontr_idbiotuebereinst_werte
    ON apflora.tpopkontr.idealbiotop_uebereinstimmung = apflora.tpopkontr_idbiotuebereinst_werte.code
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr,
  apflora.tpopkontr.jahr,
  apflora.tpopkontr.datum;

DROP VIEW IF EXISTS apflora.v_beob CASCADE;
CREATE OR REPLACE VIEW apflora.v_beob AS
SELECT
  apflora.beob.id,
  apflora.beob_quelle_werte.name AS quelle,
  beob.id_field,
  beob.data->>(SELECT id_field FROM apflora.beob WHERE id = beob2.id) AS "OriginalId",
  apflora.beob.art_id,
  apflora.beob.art_id_original,
  apflora.ae_taxonomies.artname AS "Artname",
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.tpop.id AS tpop_id,
  apflora.tpop.nr AS tpop_nr,
  pop_status_werte.text AS tpop_status,
  apflora.tpop.gemeinde AS tpop_gemeinde,
  apflora.tpop.flurname AS tpop_flurname,
  apflora.beob.lv95_x as x,
  apflora.beob.lv95_y as y,
  CASE
    WHEN
      apflora.beob.lv95_x > 0
      AND apflora.tpop.lv95_x > 0
    THEN
      round(ST_Distance(ST_Transform(apflora.beob.geom_point, 2056), ST_Transform(apflora.tpop.geom_point, 2056)))
    ELSE
      NULL
  END AS distanz_zur_teilpopulation,
  apflora.beob.datum,
  apflora.beob.autor,
  apflora.beob.nicht_zuordnen,
  apflora.beob.bemerkungen,
  apflora.beob.changed,
  apflora.beob.changed_by
FROM
  (((apflora.beob
  INNER JOIN
    apflora.beob AS beob2
    ON beob2.id = beob.id)
  INNER JOIN
    apflora.ae_taxonomies
    INNER JOIN
      apflora.ap
      ON apflora.ap.art_id = apflora.ae_taxonomies.id
    ON apflora.beob.art_id = apflora.ae_taxonomies.id)
  INNER JOIN
    apflora.beob_quelle_werte
    ON beob.quelle_id = beob_quelle_werte.id)
  LEFT JOIN
    apflora.tpop
    ON apflora.tpop.id = apflora.beob.tpop_id
    LEFT JOIN
      apflora.pop_status_werte AS pop_status_werte
      ON apflora.tpop.status = pop_status_werte.code
    LEFT JOIN
      apflora.pop
      ON apflora.pop.id = apflora.tpop.pop_id
WHERE
  apflora.ae_taxonomies.taxid > 150
ORDER BY
  apflora.ae_taxonomies.artname ASC,
  apflora.pop.nr ASC,
  apflora.tpop.nr ASC,
  apflora.beob.datum DESC;

DROP VIEW IF EXISTS apflora.v_beob_art_changed CASCADE;
CREATE OR REPLACE VIEW apflora.v_beob_art_changed AS
SELECT
  apflora.beob.id,
  apflora.beob_quelle_werte.name AS quelle,
  beob.id_field,
  beob.data->>(SELECT id_field FROM apflora.beob WHERE id = beob2.id) AS "original_id",
  apflora.beob.art_id_original,
  ae_artidoriginal.artname AS "artname_original",
  ae_artidoriginal.taxid AS "taxonomie_id_original",
  apflora.beob.art_id,
  ae_artid.artname AS "artname",
  ae_artid.taxid AS "taxonomie_id",
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.tpop.id AS tpop_id,
  apflora.tpop.nr AS tpop_nr,
  pop_status_werte.text AS tpop_status,
  apflora.tpop.gemeinde AS tpop_gemeinde,
  apflora.tpop.flurname AS tpop_flurname,
  apflora.beob.lv95_x as x,
  apflora.beob.lv95_y as y,
  CASE
    WHEN
      apflora.beob.lv95_x > 0
      AND apflora.tpop.lv95_x > 0
    THEN
      round(ST_Distance(ST_Transform(apflora.beob.geom_point, 2056), ST_Transform(apflora.tpop.geom_point, 2056)))
    ELSE
      NULL
  END AS distanz_zur_teilpopulation,
  apflora.beob.datum,
  apflora.beob.autor,
  apflora.beob.nicht_zuordnen,
  apflora.beob.bemerkungen,
  apflora.beob.changed,
  apflora.beob.changed_by
FROM
  apflora.beob
  INNER JOIN
    apflora.beob AS beob2
    ON beob2.id = beob.id
  INNER JOIN
    apflora.ae_taxonomies AS ae_artid
    INNER JOIN
      apflora.ap as artidsap
      ON artidsap.art_id = ae_artid.id
    ON apflora.beob.art_id = ae_artid.id
  INNER JOIN
    apflora.ae_taxonomies AS ae_artidoriginal
    INNER JOIN
      apflora.ap as artidoriginalsap
      ON artidoriginalsap.art_id = ae_artidoriginal.id
    ON apflora.beob.art_id_original = ae_artidoriginal.id
  INNER JOIN
    apflora.beob_quelle_werte
    ON beob.quelle_id = beob_quelle_werte.id
  LEFT JOIN
    apflora.tpop
    ON apflora.tpop.id = apflora.beob.tpop_id
    LEFT JOIN
      apflora.pop_status_werte AS pop_status_werte
      ON apflora.tpop.status = pop_status_werte.code
    LEFT JOIN
      apflora.pop
      ON apflora.pop.id = apflora.tpop.pop_id
WHERE
  ae_artid.taxid > 150
  and apflora.beob.art_id <> apflora.beob.art_id_original
ORDER BY
  ae_artid.artname ASC,
  apflora.pop.nr ASC,
  apflora.tpop.nr ASC,
  apflora.beob.datum DESC;

-- nicht mehr benutzt
DROP VIEW IF EXISTS apflora.v_beob__mit_data CASCADE;
CREATE OR REPLACE VIEW apflora.v_beob__mit_data AS
SELECT
  apflora.beob.id,
  apflora.beob_quelle_werte.name AS quelle,
  beob.id_field,
  beob.data->>(SELECT id_field FROM apflora.beob WHERE id = beob2.id) AS "OriginalId",
  apflora.beob.art_id,
  apflora.ae_taxonomies.artname AS "Artname",
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.tpop.id AS tpop_id,
  apflora.tpop.nr AS tpop_nr,
  apflora.beob.lv95_x as x,
  apflora.beob.lv95_y as y,
  CASE
    WHEN
      apflora.beob.lv95_x > 0
      AND apflora.tpop.lv95_x > 0
    THEN
      round(ST_Distance(ST_Transform(apflora.beob.geom_point, 2056), ST_Transform(apflora.tpop.geom_point, 2056)))
    ELSE
      NULL
  END AS "Distanz zur Teilpopulation (m)",
  apflora.beob.datum,
  apflora.beob.autor,
  apflora.beob.nicht_zuordnen,
  apflora.beob.bemerkungen,
  apflora.beob.changed,
  apflora.beob.changed_by,
  apflora.beob.data AS "Originaldaten"
FROM
  (((apflora.beob
  INNER JOIN
    apflora.beob AS beob2
    ON beob2.id = beob.id)
  INNER JOIN
    apflora.ae_taxonomies
    INNER JOIN
      apflora.ap
      ON apflora.ap.art_id = apflora.ae_taxonomies.id
    ON apflora.beob.art_id = apflora.ae_taxonomies.id)
  INNER JOIN
    apflora.beob_quelle_werte
    ON beob.quelle_id = beob_quelle_werte.id)
  LEFT JOIN
    apflora.tpop
    ON apflora.tpop.id = apflora.beob.tpop_id
    LEFT JOIN
      apflora.pop
      ON apflora.pop.id = apflora.tpop.pop_id
WHERE
  apflora.ae_taxonomies.taxid > 150
ORDER BY
  apflora.ae_taxonomies.artname ASC,
  apflora.pop.nr ASC,
  apflora.tpop.nr ASC,
  apflora.beob.datum DESC;

DROP VIEW IF EXISTS apflora.v_tpopkontr_maxanzahl CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_maxanzahl AS
SELECT
  apflora.tpopkontr.id,
  max(apflora.tpopkontrzaehl.anzahl) AS anzahl
FROM
  apflora.tpopkontr
  INNER JOIN
    apflora.tpopkontrzaehl
    ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id
GROUP BY
  apflora.tpopkontr.id
ORDER BY
  apflora.tpopkontr.id;

-- v_exportevab_beob is in viewsGenerieren2 because dependant on v_tpopkontr_maxanzahl

DROP VIEW IF EXISTS apflora.v_exportevab_projekt CASCADE;
CREATE OR REPLACE VIEW apflora.v_exportevab_projekt AS
SELECT
  apflora.ap.id AS "idProjekt",
  concat('AP Flora ZH: ', apflora.ae_taxonomies.artname) AS "Name",
  CASE
    WHEN apflora.ap.start_jahr IS NOT NULL
    THEN concat('01.01.', apflora.ap.start_jahr)
    ELSE to_char(current_date, 'DD.MM.YYYY')
  END AS "Eroeffnung",
  '{7C71B8AF-DF3E-4844-A83B-55735F80B993}'::UUID AS "fkAutor",
  concat(
    CASE
      WHEN apflora.ap_bearbstand_werte.text IS NOT NULL
      THEN concat('Aktionsplan: ', apflora.ap_bearbstand_werte.text)
      ELSE 'Aktionsplan: (keine Angabe)'
    END,
    CASE
      WHEN apflora.ap.start_jahr IS NOT NULL
      THEN concat('; Start im Jahr: ', apflora.ap.start_jahr)
      ELSE ''
    END,
    CASE
      WHEN apflora.ap.umsetzung IS NOT NULL
      THEN concat('; Stand Umsetzung: ', apflora.ap_umsetzung_werte.text)
      ELSE ''
    END,
    ''
  ) AS "Bemerkungen"
FROM
  (((apflora.ap
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
  INNER JOIN
    apflora.ae_taxonomies
    ON apflora.ap.art_id = apflora.ae_taxonomies.id)
  INNER JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.pop_status_werte
      ON apflora.pop.status  = apflora.pop_status_werte.code)
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        ((apflora.tpopkontr
        INNER JOIN
          apflora.v_tpopkontr_maxanzahl
          ON apflora.v_tpopkontr_maxanzahl.id = apflora.tpopkontr.id)
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr.bearbeiter = apflora.adresse.id)
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop.id = apflora.tpop.pop_id)
    ON apflora.ap.id = apflora.pop.ap_id
WHERE
  -- keine Testarten
  apflora.ae_taxonomies.taxid > 150
  AND apflora.ae_taxonomies.taxid < 1000000
  -- nur Kontrollen, deren Teilpopulationen Koordinaten besitzen
  AND apflora.tpop.lv95_x IS NOT NULL
  AND apflora.tpopkontr.typ IN ('Ausgangszustand', 'Zwischenbeurteilung', 'Freiwilligen-Erfolgskontrolle')
  -- keine Ansaatversuche
  AND apflora.tpop.status <> 201
  -- nur wenn die Kontrolle einen bearbeiter hat
  AND apflora.tpopkontr.bearbeiter IS NOT NULL
  -- ...und nicht unbekannt ist
  AND apflora.tpopkontr.bearbeiter <> 'a1146ae4-4e03-4032-8aa8-bc46ba02f468'
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
GROUP BY
  apflora.ae_taxonomies.artname,
  apflora.ap.id,
  apflora.ap.start_jahr,
  apflora.ap.umsetzung,
  apflora.ap_bearbstand_werte.text,
  apflora.ap_umsetzung_werte.text;

DROP VIEW IF EXISTS apflora.v_exportevab_raum CASCADE;
CREATE OR REPLACE VIEW apflora.v_exportevab_raum AS
SELECT
  apflora.ap.id AS "fkProjekt",
  apflora.pop.id AS "idRaum",
  concat(
    apflora.pop.name,
    CASE
      WHEN apflora.pop.nr IS NOT NULL
      THEN concat(' (Nr. ', apflora.pop.nr, ')')
      ELSE ''
    END
  ) AS "Name",
  to_char(current_date, 'DD.MM.YYYY') AS "Erfassungsdatum",
  '{7C71B8AF-DF3E-4844-A83B-55735F80B993}'::UUID AS "fkAutor",
  CASE
    WHEN apflora.pop.status  IS NOT NULL
    THEN
      concat(
        'Status: ',
        "popHerkunft".text,
        CASE
          WHEN apflora.pop.bekannt_seit IS NOT NULL
          THEN
            concat(
              '; Bekannt seit: ',
              apflora.pop.bekannt_seit
            )
          ELSE ''
        END
      )
    ELSE ''
  END AS "Bemerkungen"
FROM
  apflora.ap
  INNER JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.pop_status_werte AS "popHerkunft"
      ON apflora.pop.status  = "popHerkunft".code)
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        ((apflora.tpopkontr
        INNER JOIN
          apflora.v_tpopkontr_maxanzahl
          ON apflora.v_tpopkontr_maxanzahl.id = apflora.tpopkontr.id)
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr.bearbeiter = apflora.adresse.id)
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop.id = apflora.tpop.pop_id)
    ON apflora.ap.id = apflora.pop.ap_id
  INNER JOIN apflora.ae_taxonomies
  ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  -- keine Testarten
  apflora.ae_taxonomies.taxid > 150
  AND apflora.ae_taxonomies.taxid < 1000000
  -- nur Kontrollen, deren Teilpopulationen Koordinaten besitzen
  AND apflora.tpop.lv95_x IS NOT NULL
  AND apflora.tpopkontr.typ IN ('Ausgangszustand', 'Zwischenbeurteilung', 'Freiwilligen-Erfolgskontrolle')
  -- keine Ansaatversuche
  AND apflora.tpop.status <> 201
  -- nur wenn die Kontrolle einen bearbeiter hat
  AND apflora.tpopkontr.bearbeiter IS NOT NULL
  -- ...und nicht unbekannt ist
  AND apflora.tpopkontr.bearbeiter <> 'a1146ae4-4e03-4032-8aa8-bc46ba02f468'
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
  -- ensure all idProjekt are contained in higher level
  AND apflora.ap.id IN (Select "idProjekt" FROM apflora.v_exportevab_projekt)
GROUP BY
  apflora.ap.id,
  apflora.pop.id,
  apflora.pop.name,
  apflora.pop.nr,
  apflora.pop.status ,
  "popHerkunft".text,
  apflora.pop.bekannt_seit;

DROP VIEW IF EXISTS apflora.v_exportevab_ort CASCADE;
CREATE OR REPLACE VIEW apflora.v_exportevab_ort AS
SELECT
  -- include TPopGuid to enable later views to include only tpop included here
  apflora.tpop.id AS "TPopGuid",
  apflora.pop.id AS "fkRaum",
  apflora.tpop.id AS "idOrt",
  substring(
    concat(
      apflora.tpop.flurname,
      CASE
        WHEN apflora.tpop.nr IS NOT NULL
        THEN concat(' (Nr. ', apflora.tpop.nr, ')')
        ELSE ''
      END
    ) from 1 for 40
  ) AS "Name",
  to_char(current_date, 'DD.MM.YYYY') AS "Erfassungsdatum",
  '{7C71B8AF-DF3E-4844-A83B-55735F80B993}'::UUID AS "fkAutor",
  substring(max(apflora.evab_typologie."TYPO") from 1 for 9)::varchar(10) AS "fkLebensraumtyp",
  1 AS "fkGenauigkeitLage",
  1 AS "fkGeometryType",
  CASE
    WHEN apflora.tpop.hoehe IS NOT NULL
    THEN apflora.tpop.hoehe
    ELSE 0
  END AS "obergrenzeHoehe",
  4 AS "fkGenauigkeitHoehe",
  apflora.tpop.lv95_x AS "X",
  apflora.tpop.lv95_y AS "Y",
  substring(apflora.tpop.gemeinde from 1 for 25) AS "NOM_COMMUNE",
  substring(apflora.tpop.flurname from 1 for 255) AS "DESC_LOCALITE",
  max(apflora.tpopkontr.lr_umgebung_delarze) AS "ENV",
  CASE
    WHEN apflora.tpop.status IS NOT NULL
    THEN
      concat(
        'Status: ',
        apflora.pop_status_werte.text,
        CASE
          WHEN apflora.tpop.bekannt_seit IS NOT NULL
          THEN
            concat(
              '; Bekannt seit: ',
              apflora.tpop.bekannt_seit
            )
          ELSE ''
        END
      )
    ELSE ''
  END AS "Bemerkungen"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      ((apflora.tpop
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.tpop.status = apflora.pop_status_werte.code)
      INNER JOIN
        (((apflora.tpopkontr
        INNER JOIN
          apflora.v_tpopkontr_maxanzahl
          ON apflora.v_tpopkontr_maxanzahl.id = apflora.tpopkontr.id)
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr.bearbeiter = apflora.adresse.id)
        LEFT JOIN apflora.evab_typologie
          ON apflora.tpopkontr.lr_delarze = apflora.evab_typologie."TYPO")
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop.id = apflora.tpop.pop_id)
    ON apflora.ap.id = apflora.pop.ap_id
  INNER JOIN apflora.ae_taxonomies
  ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  -- keine Testarten
  apflora.ae_taxonomies.taxid > 150
  AND apflora.ae_taxonomies.taxid < 1000000
  -- nur Kontrollen, deren Teilpopulationen Koordinaten besitzen
  AND apflora.tpop.lv95_x IS NOT NULL
  AND apflora.tpopkontr.typ IN ('Ausgangszustand', 'Zwischenbeurteilung', 'Freiwilligen-Erfolgskontrolle')
  -- keine Ansaatversuche
  AND apflora.tpop.status <> 201
  -- nur wenn die Kontrolle einen bearbeiter hat
  AND apflora.tpopkontr.bearbeiter IS NOT NULL
  -- ...und nicht unbekannt ist
  AND apflora.tpopkontr.bearbeiter <> 'a1146ae4-4e03-4032-8aa8-bc46ba02f468'
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
GROUP BY
  apflora.pop.id,
  apflora.tpop.id,
  apflora.tpop.nr,
  apflora.tpop.bekannt_seit,
  apflora.tpop.flurname,
  apflora.tpop.status,
  apflora.pop_status_werte.text,
  apflora.tpop.hoehe,
  apflora.tpop.lv95_x,
  apflora.tpop.lv95_y,
  apflora.tpop.gemeinde;

DROP VIEW IF EXISTS apflora.v_exportevab_zeit CASCADE;
CREATE OR REPLACE VIEW apflora.v_exportevab_zeit AS
SELECT
  apflora.tpop.id AS "fkOrt",
  apflora.tpopkontr.zeit_id AS "idZeitpunkt",
  CASE
    WHEN apflora.tpopkontr.datum IS NOT NULL
    THEN to_char(apflora.tpopkontr.datum, 'DD.MM.YYYY')
    ELSE
      concat(
        '01.01.',
        apflora.tpopkontr.jahr
      )
  END AS "Datum",
  CASE
    WHEN apflora.tpopkontr.datum IS NOT NULL
    THEN 'T'::varchar(10)
    ELSE 'J'::varchar(10)
  END AS "fkGenauigkeitDatum",
  CASE
    WHEN apflora.tpopkontr.datum IS NOT NULL
    THEN 'P'::varchar(10)
    ELSE 'X'::varchar(10)
  END AS "fkGenauigkeitDatumZDSF",
  substring(apflora.tpopkontr.moosschicht from 1 for 10) AS "COUV_MOUSSES",
  substring(apflora.tpopkontr.krautschicht from 1 for 10) AS "COUV_HERBACEES",
  substring(apflora.tpopkontr.strauchschicht from 1 for 10) AS "COUV_BUISSONS",
  substring(apflora.tpopkontr.baumschicht from 1 for 10) AS "COUV_ARBRES"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      ((apflora.tpop
      LEFT JOIN
        apflora.pop_status_werte AS tpop_status_werte
        ON apflora.tpop.status = tpop_status_werte.code)
      INNER JOIN
        ((apflora.tpopkontr
        INNER JOIN
          apflora.v_tpopkontr_maxanzahl
          ON apflora.v_tpopkontr_maxanzahl.id = apflora.tpopkontr.id)
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr.bearbeiter = apflora.adresse.id)
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop.id = apflora.tpop.pop_id)
    ON apflora.ap.id = apflora.pop.ap_id
  INNER JOIN apflora.ae_taxonomies
  ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  -- keine Testarten
  apflora.ae_taxonomies.taxid > 150
  AND apflora.ae_taxonomies.taxid < 1000000
  -- nur Kontrollen, deren Teilpopulationen Koordinaten besitzen
  AND apflora.tpop.lv95_x IS NOT NULL
  AND apflora.tpopkontr.typ IN ('Ausgangszustand', 'Zwischenbeurteilung', 'Freiwilligen-Erfolgskontrolle')
  -- keine Ansaatversuche
  AND apflora.tpop.status <> 201
  -- nur wenn die Kontrolle einen bearbeiter hat
  AND apflora.tpopkontr.bearbeiter IS NOT NULL
  -- ...und nicht unbekannt ist
  AND apflora.tpopkontr.bearbeiter <> 'a1146ae4-4e03-4032-8aa8-bc46ba02f468'
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
  AND apflora.tpop.id IN (SELECT "idOrt" FROM apflora.v_exportevab_ort);

DROP VIEW IF EXISTS apflora.v_tpopmassnber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopmassnber AS
SELECT
  apflora.ap.id as ap_id,
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
  tpop_status_werte.text AS tpop_status,
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
  apflora.tpopmassnber.id,
  apflora.tpopmassnber.jahr,
  tpopmassn_erfbeurt_werte.text AS entwicklung,
  apflora.tpopmassnber.bemerkungen,
  apflora.tpopmassnber.changed,
  apflora.tpopmassnber.changed_by
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
        apflora.pop_status_werte
        ON apflora.pop.status  = pop_status_werte.code)
      INNER JOIN
        ((apflora.tpop
        LEFT JOIN
          apflora.pop_status_werte AS tpop_status_werte
          ON apflora.tpop.status = tpop_status_werte.code)
        INNER JOIN
          (apflora.tpopmassnber
          LEFT JOIN
            apflora.tpopmassn_erfbeurt_werte
            ON apflora.tpopmassnber.beurteilung = tpopmassn_erfbeurt_werte.code)
          ON apflora.tpop.id = apflora.tpopmassnber.tpop_id)
        ON apflora.pop.id = apflora.tpop.pop_id)
      ON apflora.ap.id = apflora.pop.ap_id)
    ON apflora.ae_taxonomies.id = apflora.ap.art_id
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr,
  apflora.tpopmassnber.jahr;

DROP VIEW IF EXISTS apflora.v_tpop_kml CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_kml AS
SELECT
  apflora.ae_taxonomies.artname AS "art",
  concat(
    apflora.pop.nr,
    '/',
    apflora.tpop.nr
  ) AS "label",
  substring(
    concat(
      'Population: ',
      apflora.pop.nr,
      ' ',
      apflora.pop.name,
      '<br /> Teilpopulation: ',
      apflora.tpop.nr,
      ' ',
      apflora.tpop.gemeinde,
      ' ',
      apflora.tpop.flurname
    )
    from 1 for 225
  ) AS "inhalte",
  concat(
    'https://apflora.ch/Daten/Projekte/',
    apflora.ap.proj_id,
    '/Aktionspläne/',
    apflora.ap.id,
    '/Populationen/',
    apflora.pop.id,
    '/Teil-Populationen/',
    apflora.tpop.id
  ) AS url,
  apflora.tpop.id,
  apflora.tpop.wgs84_lat,
  apflora.tpop.wgs84_long
FROM
  (apflora.ae_taxonomies
  INNER JOIN
    apflora.ap
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop.id = apflora.tpop.pop_id)
    ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.tpop.lv95_x is not null
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.pop.name,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname;

DROP VIEW IF EXISTS apflora.v_tpop_kmlnamen CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_kmlnamen AS
SELECT
  apflora.ae_taxonomies.artname AS "art",
  concat(
    apflora.ae_taxonomies.artname,
    ' ',
    apflora.pop.nr,
    '/',
    apflora.tpop.nr
  ) AS "label",
  substring(
    concat(
      'Population: ',
      apflora.pop.nr,
      ' ',
      apflora.pop.name,
      '<br /> Teilpopulation: ',
      apflora.tpop.nr,
      ' ',
      apflora.tpop.gemeinde,
      ' ',
      apflora.tpop.flurname)
    from 1 for 225
  ) AS "inhalte",
  concat(
    'https://apflora.ch/Daten/Projekte/',
    apflora.ap.proj_id,
    '/Aktionspläne/',
    apflora.ap.id,
    '/Populationen/',
    apflora.pop.id,
    '/Teil-Populationen/',
    apflora.tpop.id
  ) AS url,
  apflora.tpop.id,
  apflora.tpop.wgs84_lat,
  apflora.tpop.wgs84_long
FROM
  (apflora.ae_taxonomies
  INNER JOIN
    apflora.ap
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop.id = apflora.tpop.pop_id)
    ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.tpop.lv95_x is not null
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.pop.name,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname;

DROP VIEW IF EXISTS apflora.v_pop_kml CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_kml AS
SELECT
  apflora.ae_taxonomies.artname AS "art",
  apflora.pop.nr AS "label",
  substring(
    concat('Population: ', apflora.pop.nr, ' ', apflora.pop.name)
    from 1 for 225
  ) AS "inhalte",
  concat(
    'https://apflora.ch/Daten/Projekte/',
    apflora.ap.proj_id,
    '/Aktionspläne/',
    apflora.ap.id,
    '/Populationen/',
    apflora.pop.id
  ) AS url,
  apflora.pop.id,
  apflora.pop.wgs84_lat,
  apflora.pop.wgs84_long
FROM
  apflora.ae_taxonomies
  INNER JOIN apflora.ap
    INNER JOIN apflora.pop
    ON apflora.ap.id = apflora.pop.ap_id
  ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  apflora.pop.lv95_x is not null
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.pop.name;

DROP VIEW IF EXISTS apflora.v_pop_kmlnamen CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_kmlnamen AS
SELECT
  apflora.ae_taxonomies.artname AS "art",
  concat(
    apflora.ae_taxonomies.artname,
    ' ',
    apflora.pop.nr
  ) AS "label",
  substring(
    concat('Population: ', apflora.pop.nr, ' ', apflora.pop.name)
    from 1 for 225
  ) AS "inhalte",
  concat(
    'https://apflora.ch/Daten/Projekte/',
    apflora.ap.proj_id,
    '/Aktionspläne/',
    apflora.ap.id,
    '/Populationen/',
    apflora.pop.id
  ) AS url,
  apflora.pop.id,
  apflora.pop.wgs84_lat,
  apflora.pop.wgs84_long
FROM
  apflora.ae_taxonomies
  INNER JOIN
    (apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.ap.id = apflora.pop.ap_id)
    ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  apflora.pop.lv95_x is not null
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.pop.name;

DROP VIEW IF EXISTS apflora.v_kontrzaehl_anzproeinheit CASCADE;
CREATE OR REPLACE VIEW apflora.v_kontrzaehl_anzproeinheit AS
SELECT
  apflora.ap.id as ap_id,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  apflora_adresse_1.name AS ap_bearbeiter,
  apflora.pop.id as pop_id,
  apflora.pop.nr AS pop_nr,
  apflora.pop.name AS pop_name,
  apflora.pop_status_werte.text AS pop_status,
  apflora.pop.bekannt_seit AS pop_bekannt_seit,
  apflora.tpop.id AS tpop_id,
  apflora.tpop.nr AS tpop_nr,
  apflora.tpop.gemeinde AS tpop_gemeinde,
  apflora.tpop.flurname AS tpop_flurname,
  tpop_status_werte.text AS tpop_status,
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
  apflora.tpopkontr.id AS kontr_id,
  apflora.tpopkontr.jahr AS kontr_jahr,
  apflora.tpopkontr.datum AS kontr_datum,
  apflora.tpopkontr_typ_werte.text AS kontr_typ,
  apflora.adresse.name AS kontr_bearbeiter,
  apflora.tpopkontr.ueberlebensrate AS kontr_ueberlebensrate,
  apflora.tpopkontr.vitalitaet AS kontr_vitalitaet,
  apflora.tpop_entwicklung_werte.text AS kontr_entwicklung,
  apflora.tpopkontr.ursachen AS kontr_ursachen,
  apflora.tpopkontr.erfolgsbeurteilung AS kontr_erfolgsbeurteilung,
  apflora.tpopkontr.umsetzung_aendern AS kontr_umsetzung_aendern,
  apflora.tpopkontr.kontrolle_aendern AS kontr_kontrolle_aendern,
  apflora.tpopkontr.bemerkungen AS kontr_bemerkungen,
  apflora.tpopkontr.lr_delarze AS kontr_lr_delarze,
  apflora.tpopkontr.lr_umgebung_delarze AS kontr_lr_umgebung_delarze,
  apflora.tpopkontr.vegetationstyp AS kontr_vegetationstyp,
  apflora.tpopkontr.konkurrenz AS kontr_konkurrenz,
  apflora.tpopkontr.moosschicht AS kontr_moosschicht,
  apflora.tpopkontr.krautschicht AS kontr_krautschicht,
  apflora.tpopkontr.strauchschicht AS kontr_strauchschicht,
  apflora.tpopkontr.baumschicht AS kontr_baumschicht,
  apflora.tpopkontr.boden_typ AS kontr_boden_typ,
  apflora.tpopkontr.boden_kalkgehalt AS kontr_boden_kalkgehalt,
  apflora.tpopkontr.boden_durchlaessigkeit AS kontr_boden_durchlaessigkeit,
  apflora.tpopkontr.boden_humus AS kontr_boden_humus,
  apflora.tpopkontr.boden_naehrstoffgehalt AS kontr_boden_naehrstoffgehalt,
  apflora.tpopkontr.boden_abtrag AS kontr_boden_abtrag,
  apflora.tpopkontr.wasserhaushalt AS kontr_wasserhaushalt,
  apflora.tpopkontr_idbiotuebereinst_werte.text AS kontr_idealbiotop_uebereinstimmung,
  apflora.tpopkontr.handlungsbedarf AS kontr_handlungsbedarf,
  apflora.tpopkontr.flaeche_ueberprueft AS kontr_flaeche_ueberprueft,
  apflora.tpopkontr.flaeche AS kontr_flaeche,
  apflora.tpopkontr.plan_vorhanden AS kontr_plan_vorhanden,
  apflora.tpopkontr.deckung_vegetation AS kontr_deckung_vegetation,
  apflora.tpopkontr.deckung_nackter_boden AS kontr_deckung_nackter_boden,
  apflora.tpopkontr.deckung_ap_art AS kontr_deckung_ap_art,
  apflora.tpopkontr.jungpflanzen_vorhanden AS kontr_jungpflanzen_vorhanden,
  apflora.tpopkontr.vegetationshoehe_maximum AS kontr_vegetationshoehe_maximum,
  apflora.tpopkontr.vegetationshoehe_mittel AS kontr_vegetationshoehe_mittel,
  apflora.tpopkontr.gefaehrdung AS kontr_gefaehrdung,
  apflora.tpopkontr.changed AS kontr_changed,
  apflora.tpopkontr.changed_by AS kontr_changed_by,
  apflora.tpopkontr.apber_nicht_relevant as kontr_apber_nicht_relevant,
  apflora.tpopkontr.apber_nicht_relevant_grund as kontr_apber_nicht_relevant_grund,
  apflora.tpopkontr.ekf_bemerkungen as kontr_ekf_bemerkungen,
  apflora.tpopkontrzaehl.id,
  apflora.tpopkontrzaehl_einheit_werte.text AS einheit,
  apflora.tpopkontrzaehl_methode_werte.text AS methode,
  apflora.tpopkontrzaehl.anzahl
FROM
  apflora.ae_taxonomies
  INNER JOIN
    ((((apflora.ap
    LEFT JOIN
      apflora.adresse AS apflora_adresse_1
      ON apflora.ap.bearbeiter = apflora_adresse_1.id)
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
    INNER JOIN
      ((apflora.pop
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop.status  = apflora.pop_status_werte.code)
      INNER JOIN
        ((apflora.tpop
        LEFT JOIN
          apflora.pop_status_werte AS tpop_status_werte
          ON tpop_status_werte.code = apflora.tpop.status)
        INNER JOIN
          (((((apflora.tpopkontr
          LEFT JOIN
            apflora.tpopkontr_idbiotuebereinst_werte
            ON apflora.tpopkontr.idealbiotop_uebereinstimmung = apflora.tpopkontr_idbiotuebereinst_werte.code)
          LEFT JOIN
            apflora.tpopkontr_typ_werte
            ON apflora.tpopkontr.typ = apflora.tpopkontr_typ_werte.text)
          LEFT JOIN
            apflora.adresse
            ON apflora.tpopkontr.bearbeiter = apflora.adresse.id)
          LEFT JOIN
            apflora.tpop_entwicklung_werte
            ON apflora.tpopkontr.entwicklung = apflora.tpop_entwicklung_werte.code)
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
      ON apflora.ap.id = apflora.pop.ap_id)
    ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  apflora.ae_taxonomies.taxid > 150
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr,
  apflora.tpopkontr.jahr,
  apflora.tpopkontr.datum;

DROP VIEW IF EXISTS apflora.v_tpopber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopber AS
SELECT
  apflora.ap.id,
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
  tpop_status_werte.text AS tpop_status,
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
  apflora.tpopber.id AS tpopber_id,
  apflora.tpopber.jahr AS tpopber_jahr,
  tpop_entwicklung_werte.text AS tpopber_entwicklung,
  apflora.tpopber.bemerkungen AS tpopber_bemerkungen,
  apflora.tpopber.changed AS tpopber_changed,
  apflora.tpopber.changed_by AS tpopber_changed_by
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
        apflora.pop_status_werte
        ON apflora.pop.status  = pop_status_werte.code)
      INNER JOIN
        ((apflora.tpop
        LEFT JOIN
          apflora.pop_status_werte AS tpop_status_werte
          ON apflora.tpop.status = tpop_status_werte.code)
        RIGHT JOIN
          (apflora.tpopber
          LEFT JOIN
            apflora.tpop_entwicklung_werte
            ON apflora.tpopber.entwicklung = tpop_entwicklung_werte.code)
          ON apflora.tpop.id = apflora.tpopber.tpop_id)
        ON apflora.pop.id = apflora.tpop.pop_id)
      ON apflora.ap.id = apflora.pop.ap_id)
    ON apflora.ae_taxonomies.id = apflora.ap.art_id
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr,
  apflora.tpopber.jahr,
  tpop_entwicklung_werte.text;

DROP VIEW IF EXISTS apflora.v_tpop_berjahrundmassnjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_berjahrundmassnjahr AS
SELECT
  apflora.tpop.id,
  apflora.tpopber.jahr
FROM
  apflora.tpop
  INNER JOIN apflora.tpopber ON apflora.tpop.id = apflora.tpopber.tpop_id
UNION DISTINCT SELECT
  apflora.tpop.id,
  apflora.tpopmassnber.jahr
FROM
  apflora.tpop
  INNER JOIN
    apflora.tpopmassnber
    ON apflora.tpop.id = apflora.tpopmassnber.tpop_id
ORDER BY
  jahr;

DROP VIEW IF EXISTS apflora.v_tpop_kontrjahrundberjahrundmassnjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_kontrjahrundberjahrundmassnjahr AS
SELECT
  apflora.tpop.id,
  apflora.tpopber.jahr AS "Jahr"
FROM
  apflora.tpop
  INNER JOIN apflora.tpopber ON apflora.tpop.id = apflora.tpopber.tpop_id
UNION DISTINCT SELECT
  apflora.tpop.id,
  apflora.tpopmassnber.jahr AS "Jahr"
FROM
  apflora.tpop
  INNER JOIN
    apflora.tpopmassnber
    ON apflora.tpop.id = apflora.tpopmassnber.tpop_id
UNION DISTINCT SELECT
  apflora.tpop.id,
  apflora.tpopkontr.jahr AS "Jahr"
FROM
  apflora.tpop
  INNER JOIN apflora.tpopkontr ON apflora.tpop.id = apflora.tpopkontr.tpop_id
ORDER BY
  "Jahr";

DROP VIEW IF EXISTS apflora.v_datenstruktur CASCADE;
CREATE OR REPLACE VIEW apflora.v_datenstruktur AS
SELECT
  information_schema.tables.table_schema AS "Tabelle: Schema",
  information_schema.tables.table_name AS "Tabelle: Name",
  dsql2('select count(*) from "'||information_schema.tables.table_schema||'"."'||information_schema.tables.table_name||'"') AS "Tabelle: Anzahl Datensaetze",
  -- information_schema.tables.table_comment AS "Tabelle: Bemerkungen",
  information_schema.columns.column_name AS "Feld: Name",
  information_schema.columns.column_default AS "Feld: Standardwert",
  information_schema.columns.data_type AS "Feld: Datentyp",
  information_schema.columns.is_nullable AS "Feld: Nullwerte"
  -- information_schema.columns.column_comment AS "Feld: Bemerkungen"
FROM
  information_schema.tables
  INNER JOIN
    information_schema.columns
    ON information_schema.tables.table_name = information_schema.columns.table_name
    AND information_schema.tables.table_schema = information_schema.columns.table_schema
WHERE
  information_schema.tables.table_schema = 'apflora'
ORDER BY
  information_schema.tables.table_schema,
  information_schema.tables.table_name,
  information_schema.columns.column_name;

DROP VIEW IF EXISTS apflora.v_tpop_ohneapberichtrelevant CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_ohneapberichtrelevant AS
SELECT
  apflora.ae_taxonomies.artname AS "Artname",
  apflora.pop.nr as pop_nr,
  apflora.pop.name as pop_name,
  apflora.tpop.id,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname,
  apflora.tpop.apber_relevant,
  apflora.tpop.apber_relevant_grund,
  apflora.tpop.lv95_x as x,
  apflora.tpop.lv95_y as y
FROM
  apflora.ae_taxonomies
  INNER JOIN
    (apflora.ap
    INNER JOIN
      (apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.tpop.pop_id = apflora.pop.id)
      ON apflora.pop.ap_id = apflora.ap.id)
    ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  apflora.tpop.apber_relevant IS NULL
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_q_tpop_bekanntseit_juenger_als_aelteste_beob CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_tpop_bekanntseit_juenger_als_aelteste_beob AS
SELECT distinct
  apflora.projekt.id as proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
          inner join apflora.beob
          on apflora.beob.tpop_id = apflora.tpop.id
        ON apflora.tpop.pop_id = apflora.pop.id
      ON apflora.pop.ap_id = apflora.ap.id
    ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.tpop.bekannt_seit > (
    SELECT min(
      date_part('year', apflora.beob.datum)
    ) AS "MinJahr"
    FROM apflora.beob
    WHERE
      tpop_id = apflora.tpop.id
      -- Baumann-Manuskript enthält viele Beobachtungen ohne Datum
      -- Müssen ausgeschlossen werden
      and apflora.beob.datum <> '0001-01-01 BC'
    GROUP BY tpop_id
  )
ORDER BY
  apflora.projekt.id,
  apflora.ap.id,
  apflora.pop.nr,
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_q_tpop_popnrtpopnrmehrdeutig CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_tpop_popnrtpopnrmehrdeutig AS
SELECT
  apflora.projekt.id as proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.tpop.pop_id = apflora.pop.id
      ON apflora.pop.ap_id = apflora.ap.id
    ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.tpop.pop_id IN (
    SELECT DISTINCT pop_id
    FROM apflora.tpop
    GROUP BY pop_id, nr
    HAVING COUNT(*) > 1
  ) AND
  apflora.tpop.nr IN (
    SELECT nr
    FROM apflora.tpop
    GROUP BY apflora.tpop.pop_id, apflora.tpop.nr
    HAVING COUNT(*) > 1
  )
ORDER BY
  apflora.projekt.id,
  apflora.ap.id,
  apflora.pop.nr,
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_bekanntseit_nicht_aeltestetpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_bekanntseit_nicht_aeltestetpop AS
SELECT
  apflora.projekt.id as proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.pop.ap_id = apflora.ap.id
    ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.pop.bekannt_seit <> (
    SELECT min (bekannt_seit)
    FROM apflora.tpop
    WHERE apflora.tpop.pop_id = apflora.pop.id
  )
ORDER BY
  apflora.projekt.id,
  apflora.ap.id,
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_popnrmehrdeutig CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_popnrmehrdeutig AS
SELECT
  apflora.projekt.id as proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.pop.ap_id = apflora.ap.id
    ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.pop.ap_id IN (
    SELECT DISTINCT ap_id
    FROM apflora.pop
    GROUP BY ap_id, nr
    HAVING COUNT(*) > 1
  ) AND
  apflora.pop.nr IN (
    SELECT DISTINCT nr
    FROM apflora.pop
    GROUP BY ap_id, nr
    HAVING COUNT(*) > 1
  )
ORDER BY
  apflora.projekt.id,
  apflora.ap.id,
  apflora.pop.nr;

-- TODO: seems only to output pops with koord but no tpop
DROP VIEW IF EXISTS apflora.v_q_pop_koordentsprechenkeinertpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_koordentsprechenkeinertpop AS
SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.pop.ap_id,
  apflora.pop.id,
  apflora.pop.nr,
  apflora.pop.lv95_x as x,
  apflora.pop.lv95_y as y
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop.ap_id = apflora.ap.id
WHERE
  apflora.pop.lv95_x Is NOT Null
  AND apflora.pop.lv95_y IS NOT NULL
  AND apflora.pop.id NOT IN (
    SELECT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
      inner join apflora.pop
      on apflora.pop.id = apflora.tpop.pop_id
    WHERE
      apflora.tpop.lv95_x = apflora.pop.lv95_x
      AND apflora.tpop.lv95_y = apflora.pop.lv95_y
  )
  ORDER BY
    apflora.ap.proj_id,
    apflora.pop.ap_id,
    apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_statusansaatversuchmitaktuellentpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_statusansaatversuchmitaktuellentpop AS
SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.pop.ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop.ap_id = apflora.ap.id
WHERE
  apflora.pop.status  = 201
  AND apflora.pop.id IN (
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.status IN (100, 101, 200)
  )
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_statusansaatversuchalletpoperloschen CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_statusansaatversuchalletpoperloschen AS
SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.pop.ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.ap
    INNER JOIN apflora.pop
      INNER JOIN apflora.tpop
      ON apflora.tpop.pop_id = apflora.pop.id
    ON apflora.pop.ap_id = apflora.ap.id
WHERE
  apflora.pop.status  = 201
  AND EXISTS (
    SELECT
      1
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.status IN (101, 202)
      AND apflora.tpop.pop_id = apflora.pop.id
  )
  AND NOT EXISTS (
    SELECT
      1
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.status NOT IN (101, 202)
      AND apflora.tpop.pop_id = apflora.pop.id
  )
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_statusansaatversuchmittpopursprerloschen CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_statusansaatversuchmittpopursprerloschen AS
SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.pop.ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop.ap_id = apflora.ap.id
WHERE
  apflora.pop.status  = 201
  AND apflora.pop.id IN (
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.status = 101
  )
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_statuserloschenmittpopaktuell CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_statuserloschenmittpopaktuell AS
SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.pop.ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop.ap_id = apflora.ap.id
WHERE
  apflora.pop.status  IN (101, 202)
  AND apflora.pop.id IN (
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.status IN (100, 200)
  )
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_statuserloschenmittpopansaatversuch CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_statuserloschenmittpopansaatversuch AS
SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.pop.ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop.ap_id = apflora.ap.id
WHERE
  apflora.pop.status  IN (101, 202)
  AND apflora.pop.id IN (
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.status = 201
  )
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_statusangesiedeltmittpopurspruenglich CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_statusangesiedeltmittpopurspruenglich AS
SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.pop.ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop.ap_id = apflora.ap.id
WHERE
  apflora.pop.status  IN (200, 201, 202)
  AND apflora.pop.id IN (
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.status = 100
  )
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_tpop_mitstatusansaatversuchundzaehlungmitanzahl CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_tpop_mitstatusansaatversuchundzaehlungmitanzahl AS
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
      apflora.tpop
      ON apflora.tpop.pop_id = apflora.pop.id
    ON apflora.pop.ap_id = apflora.ap.id
WHERE
  apflora.tpop.status = 201
  AND apflora.tpop.id IN (
    SELECT DISTINCT
      apflora.tpopkontr.tpop_id
    FROM
      (apflora.tpopkontr
      INNER JOIN
        apflora.tpopkontrzaehl
        ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
      INNER JOIN
        apflora.v_tpopkontr_letzteid
        ON
          (
            apflora.v_tpopkontr_letzteid.id = apflora.tpopkontr.tpop_id
            AND apflora.v_tpopkontr_letzteid.tpopkontr_id = apflora.tpopkontr.id::text
          )
    WHERE
      apflora.tpopkontr.typ NOT IN ('Zwischenziel', 'Ziel')
      AND apflora.tpopkontrzaehl.anzahl > 0
  )
ORDER BY
  apflora.pop.nr,
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_q_tpop_mitstatuspotentiellundzaehlungmitanzahl CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_tpop_mitstatuspotentiellundzaehlungmitanzahl AS
SELECT DISTINCT
  apflora.projekt.id as proj_id,
  apflora.pop.ap_id,
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.tpop.pop_id = apflora.pop.id
      ON apflora.pop.ap_id = apflora.ap.id
    ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.tpop.status = 300
  AND apflora.tpop.status_unklar = false
  AND apflora.tpop.id IN (
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
ORDER BY
  apflora.pop.id,
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_q_tpop_mitstatuspotentiellundmassnansiedlung CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_tpop_mitstatuspotentiellundmassnansiedlung AS
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
      apflora.tpop
      ON apflora.tpop.pop_id = apflora.pop.id
    ON apflora.pop.ap_id = apflora.ap.id
WHERE
  apflora.tpop.status = 300
  AND apflora.tpop.id IN (
    SELECT DISTINCT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.typ < 4
  )
ORDER BY
  apflora.pop.nr,
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_q_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr AS
SELECT
 apflora.beob.tpop_id as id,
  max(
    date_part('year', apflora.beob.datum)
  ) AS "MaxJahr"
FROM
  apflora.beob
WHERE
  apflora.beob.datum IS NOT NULL AND
  apflora.beob.tpop_id IS NOT NULL
GROUP BY
  apflora.beob.tpop_id;

DROP VIEW IF EXISTS apflora.v_apber_pop_uebersicht CASCADE;

-- new views beginning 2017.10.04

DROP VIEW IF EXISTS apflora.v_q_pop_mit_ber_zunehmend_ohne_tpopber_zunehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_mit_ber_zunehmend_ohne_tpopber_zunehmend AS
SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id,
  apflora.pop.nr,
  apflora.popber.jahr AS berichtjahr
FROM
  apflora.ap
  INNER JOIN
  apflora.pop
    INNER JOIN apflora.popber
    ON apflora.pop.id = apflora.popber.pop_id
  ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.popber.entwicklung = 3
  AND apflora.popber.pop_id NOT IN (
    SELECT DISTINCT apflora.tpop.pop_id
    FROM
      apflora.tpop
      INNER JOIN apflora.tpopber
      ON apflora.tpop.id = apflora.tpopber.tpop_id
    WHERE
      apflora.tpopber.entwicklung = 3
      AND apflora.tpopber.jahr = apflora.popber.jahr
  )
ORDER BY
  apflora.ap.proj_id,
  apflora.ap.id,
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_mit_ber_abnehmend_ohne_tpopber_abnehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_mit_ber_abnehmend_ohne_tpopber_abnehmend AS
SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id,
  apflora.pop.nr,
  apflora.popber.jahr AS berichtjahr
FROM
  apflora.ap
  INNER JOIN
  apflora.pop
    INNER JOIN apflora.popber
    ON apflora.pop.id = apflora.popber.pop_id
  ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.popber.entwicklung = 1
  AND apflora.popber.pop_id NOT IN (
    SELECT DISTINCT apflora.tpop.pop_id
    FROM
      apflora.tpop
      INNER JOIN apflora.tpopber
      ON apflora.tpop.id = apflora.tpopber.tpop_id
    WHERE
      apflora.tpopber.entwicklung = 1
      AND apflora.tpopber.jahr = apflora.popber.jahr
  )
ORDER BY
  apflora.ap.proj_id,
  apflora.ap.id,
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_mit_ber_erloschen_ohne_tpopber_erloschen CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_mit_ber_erloschen_ohne_tpopber_erloschen AS
SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id,
  apflora.pop.nr,
  apflora.popber.jahr AS berichtjahr
FROM
  apflora.ap
  INNER JOIN
  apflora.pop
    INNER JOIN apflora.popber
    ON apflora.pop.id = apflora.popber.pop_id
  ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.popber.entwicklung = 8
  AND apflora.popber.pop_id NOT IN (
    SELECT DISTINCT apflora.tpop.pop_id
    FROM
      apflora.tpop
      INNER JOIN apflora.tpopber
      ON apflora.tpop.id = apflora.tpopber.tpop_id
    WHERE
      apflora.tpopber.entwicklung = 8
      AND apflora.tpopber.jahr = apflora.popber.jahr
  )
ORDER BY
  apflora.ap.proj_id,
  apflora.ap.id,
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_mit_ber_erloschen_und_tpopber_nicht_erloschen CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_mit_ber_erloschen_und_tpopber_nicht_erloschen AS
SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id,
  apflora.pop.nr,
  apflora.popber.jahr AS berichtjahr
FROM
  apflora.ap
  INNER JOIN
  apflora.pop
    INNER JOIN apflora.popber
    ON apflora.pop.id = apflora.popber.pop_id
  ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.popber.entwicklung = 8
  AND apflora.popber.pop_id IN (
    SELECT DISTINCT apflora.tpop.pop_id
    FROM
      apflora.tpop
      INNER JOIN apflora.tpopber
      ON apflora.tpop.id = apflora.tpopber.tpop_id
    WHERE
      apflora.tpopber.entwicklung < 8
      AND apflora.tpopber.jahr = apflora.popber.jahr
  )
ORDER BY
  apflora.ap.proj_id,
  apflora.ap.id,
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_tpop_statusaktuellletztertpopbererloschen;
CREATE OR REPLACE VIEW apflora.v_q_tpop_statusaktuellletztertpopbererloschen AS
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
  apflora.projekt.id as proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop.id = lasttpopber.tpop_id
      ON apflora.pop.id = apflora.tpop.pop_id
    ON apflora.ap.id = apflora.pop.ap_id
  ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.tpop.status IN (100, 200, 300)
  AND lasttpopber.entwicklung = 8
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
      AND apflora.tpopmassn.jahr >= lasttpopber.jahr
  )
ORDER BY
  apflora.pop.nr,
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_statusaktuellletzterpopbererloschen CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_statusaktuellletzterpopbererloschen AS
WITH lastpopber AS (
  SELECT DISTINCT ON (pop_id)
    pop_id,
    jahr,
    entwicklung
  FROM
    apflora.popber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    pop_id,
    jahr DESC
)
SELECT
  apflora.projekt.id as proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN lastpopber
      ON apflora.pop.id = lastpopber.pop_id
    ON apflora.ap.id = apflora.pop.ap_id
  ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.pop.status  IN (100, 200, 300)
  AND lastpopber.entwicklung = 8
  AND apflora.pop.id NOT IN (
    -- Ansiedlungen since lastpopber.jahr
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop.id = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr >= lastpopber.jahr
  )
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_tpop_statuserloschenletztertpopberzunehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_tpop_statuserloschenletztertpopberzunehmend AS
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
  apflora.projekt.id as proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop.id = lasttpopber.tpop_id
      ON apflora.pop.id = apflora.tpop.pop_id
    ON apflora.ap.id = apflora.pop.ap_id
  ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.tpop.status IN (101, 201, 202, 300)
  AND lasttpopber.entwicklung = 3
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
      AND apflora.tpopmassn.jahr >= lasttpopber.jahr
  )
ORDER BY
  apflora.pop.nr,
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_statuserloschenletzterpopberzunehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_statuserloschenletzterpopberzunehmend AS
WITH lastpopber AS (
  SELECT DISTINCT ON (pop_id)
    pop_id,
    jahr,
    entwicklung
  FROM
    apflora.popber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    pop_id,
    jahr DESC
)
SELECT
  apflora.projekt.id as proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN lastpopber
      ON apflora.pop.id = lastpopber.pop_id
    ON apflora.ap.id = apflora.pop.ap_id
  ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.pop.status  IN (101, 201, 202, 300)
  AND lastpopber.entwicklung = 3
  AND apflora.pop.id NOT IN (
    -- Ansiedlungen since lastpopber.jahr
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop.id = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr >= lastpopber.jahr
  )
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_tpop_statuserloschenletztertpopberstabil CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_tpop_statuserloschenletztertpopberstabil AS
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
  apflora.projekt.id as proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop.id = lasttpopber.tpop_id
      ON apflora.pop.id = apflora.tpop.pop_id
    ON apflora.ap.id = apflora.pop.ap_id
  ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.tpop.status IN (101, 201, 202, 300)
  AND lasttpopber.entwicklung = 2
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
      AND apflora.tpopmassn.jahr >= lasttpopber.jahr
  )
ORDER BY
  apflora.pop.nr,
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_statuserloschenletzterpopberstabil CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_statuserloschenletzterpopberstabil AS
WITH lastpopber AS (
  SELECT DISTINCT ON (pop_id)
    pop_id,
    jahr,
    entwicklung
  FROM
    apflora.popber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    pop_id,
    jahr DESC
)
SELECT
  apflora.projekt.id as proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN lastpopber
      ON apflora.pop.id = lastpopber.pop_id
    ON apflora.ap.id = apflora.pop.ap_id
  ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.pop.status  IN (101, 201, 202, 300)
  AND lastpopber.entwicklung = 2
  AND apflora.pop.id NOT IN (
    -- Ansiedlungen since lastpopber.jahr
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop.id = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr >= lastpopber.jahr
  )
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_tpop_statuserloschenletztertpopberabnehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_tpop_statuserloschenletztertpopberabnehmend AS
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
  apflora.projekt.id as proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop.id = lasttpopber.tpop_id
      ON apflora.pop.id = apflora.tpop.pop_id
    ON apflora.ap.id = apflora.pop.ap_id
  ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.tpop.status IN (101, 201, 202, 300)
  AND lasttpopber.entwicklung = 1
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
      AND apflora.tpopmassn.jahr >= lasttpopber.jahr
  )
ORDER BY
  apflora.pop.nr,
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_statuserloschenletzterpopberabnehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_statuserloschenletzterpopberabnehmend AS
WITH lastpopber AS (
  SELECT DISTINCT ON (pop_id)
    pop_id,
    jahr,
    entwicklung
  FROM
    apflora.popber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    pop_id,
    jahr DESC
)
SELECT
  apflora.projekt.id as proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN lastpopber
      ON apflora.pop.id = lastpopber.pop_id
    ON apflora.ap.id = apflora.pop.ap_id
  ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.pop.status  IN (101, 201, 202, 300)
  AND lastpopber.entwicklung = 1
  AND apflora.pop.id NOT IN (
    -- Ansiedlungen since lastpopber.jahr
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop.id = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr >= lastpopber.jahr
  )
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_tpop_statuserloschenletztertpopberunsicher CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_tpop_statuserloschenletztertpopberunsicher AS
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
  apflora.projekt.id as proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop.id = lasttpopber.tpop_id
      ON apflora.pop.id = apflora.tpop.pop_id
    ON apflora.ap.id = apflora.pop.ap_id
  ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.tpop.status IN (101, 202, 300)
  AND lasttpopber.entwicklung = 4
  AND apflora.tpop.id NOT IN (
    -- Ansiedlungen since jahr
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop.id
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr >= lasttpopber.jahr
  )
ORDER BY
  apflora.pop.nr,
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_statuserloschenletzterpopberunsicher CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_statuserloschenletzterpopberunsicher AS
WITH lastpopber AS (
  SELECT DISTINCT ON (pop_id)
    pop_id,
    jahr,
    entwicklung
  FROM
    apflora.popber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    pop_id,
    jahr DESC
)
SELECT
  apflora.projekt.id as proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN lastpopber
      ON apflora.pop.id = lastpopber.pop_id
    ON apflora.ap.id = apflora.pop.ap_id
  ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.pop.status  IN (101, 202, 300)
  AND lastpopber.entwicklung = 4
  AND apflora.pop.id NOT IN (
    -- Ansiedlungen since lastpopber.jahr
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop.id = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr >= lastpopber.jahr
  )
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_ohnetpopmitgleichemstatus CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_ohnetpopmitgleichemstatus AS
SELECT
  apflora.projekt.id as proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap.id = apflora.pop.ap_id
  ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.pop.id NOT IN (
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.pop_id = apflora.pop.id
      AND apflora.tpop.status = apflora.pop.status
  )
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_status300tpopstatusanders CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_status300tpopstatusanders AS
SELECT
  apflora.projekt.id as proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap.id = apflora.pop.ap_id
  ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.pop.status  = 300
  AND apflora.pop.id IN (
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.pop_id = apflora.pop.id
      AND apflora.tpop.status <> 300
  )
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_status201tpopstatusunzulaessig CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_status201tpopstatusunzulaessig AS
SELECT
  apflora.projekt.id as proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.nr,
  apflora.pop.id
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap.id = apflora.pop.ap_id
  ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.pop.status  = 201
  AND apflora.pop.id IN (
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.pop_id = apflora.pop.id
      AND apflora.tpop.status IN (100, 101, 200)
  )
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_status202tpopstatusanders CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_status202tpopstatusanders AS
SELECT
  apflora.projekt.id as proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap.id = apflora.pop.ap_id
  ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.pop.status  = 202
  AND apflora.pop.id IN (
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.pop_id = apflora.pop.id
      AND apflora.tpop.status <> 202
  )
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_status211tpopstatusunzulaessig CASCADE;

DROP VIEW IF EXISTS apflora.v_q_pop_status200tpopstatusunzulaessig CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_status200tpopstatusunzulaessig AS
SELECT
  apflora.projekt.id as proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap.id = apflora.pop.ap_id
  ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.pop.status  = 200
  AND apflora.pop.id IN (
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.pop_id = apflora.pop.id
      AND apflora.tpop.status IN (100, 101)
  )
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_status210tpopstatusunzulaessig CASCADE;

DROP VIEW IF EXISTS apflora.v_q_pop_status101tpopstatusanders CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_status101tpopstatusanders AS
SELECT
  apflora.projekt.id as proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap.id = apflora.pop.ap_id
  ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.pop.status  = 101
  AND apflora.pop.id IN (
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.pop_id = apflora.pop.id
      AND apflora.tpop.status NOT IN (101, 300)
  )
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_statuserloschenletzterpopbererloschenmitansiedlung CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_statuserloschenletzterpopbererloschenmitansiedlung AS
WITH lastpopber AS (
  SELECT DISTINCT ON (pop_id)
    pop_id,
    jahr,
    entwicklung
  FROM
    apflora.popber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    pop_id,
    jahr DESC
)
SELECT
  apflora.projekt.id as proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN lastpopber
      ON apflora.pop.id = lastpopber.pop_id
    ON apflora.ap.id = apflora.pop.ap_id
  ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.pop.status  IN (101, 202)
  AND lastpopber.entwicklung = 8
  AND apflora.pop.id IN (
    -- Ansiedlungen since lastpopber.jahr
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop.id = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr > lastpopber.jahr
  )
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_tpop_statuserloschenletztertpopbererloschenmitansiedlung CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_tpop_statuserloschenletztertpopbererloschenmitansiedlung AS
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
  apflora.projekt.id as proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop.id = lasttpopber.tpop_id
      ON apflora.pop.id = apflora.tpop.pop_id
    ON apflora.ap.id = apflora.pop.ap_id
  ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.tpop.status IN (101, 202)
  AND lasttpopber.entwicklung = 8
  AND apflora.tpop.id IN (
    -- Ansiedlungen since apflora.tpopber.jahr
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop.id
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > lasttpopber.jahr
  )
ORDER BY
  apflora.pop.nr,
  apflora.tpop.nr;

-- need this because filtering on apart
-- in graphql overwhelms the server
DROP VIEW IF EXISTS apflora.v_apbeob CASCADE;
CREATE OR REPLACE VIEW apflora.v_apbeob AS
select
  apflora.beob.*,
  apflora.beob.wgs84_lat,
  apflora.beob.wgs84_long,
  apflora.apart.ap_id,
  apflora.beob_quelle_werte.name as quelle,
  to_char(apflora.beob.datum, 'YYYY.MM.DD') || ': ' || coalesce(apflora.beob.autor, '(kein Autor)') || ' (' || apflora.beob_quelle_werte.name || ')' as label
from
  apflora.beob
  inner join apflora.apart
  on apflora.apart.art_id = apflora.beob.art_id
    inner join apflora.beob_quelle_werte
    on apflora.beob_quelle_werte.id = apflora.beob.quelle_id
order by
  apflora.beob.datum desc,
  apflora.beob.autor asc,
  apflora.beob_quelle_werte.name asc;

DROP VIEW IF EXISTS apflora.v_tpopmassnber_fueraktap0 CASCADE;
DROP VIEW IF EXISTS apflora.v_bertpopfuerangezeigteap0 CASCADE;
DROP VIEW IF EXISTS apflora.v_ap CASCADE;
DROP VIEW IF EXISTS apflora.v_pop CASCADE;
DROP VIEW IF EXISTS apflora.v_erstemassnproap CASCADE;
drop view if exists apflora.v_apber_erstemassnjahr cascade;
DROP VIEW IF EXISTS apflora.v_massn CASCADE;

DROP VIEW IF EXISTS apflora.v_tpop_last_count CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_last_count AS
select 
  tax.artname,
  ap.id as ap_id,
  pop.id as pop_id,
  pop.nr as pop_nr,
  tpop.nr as tpop_nr,
  (
    select
      kontr4.jahr
    from
      apflora.tpopkontrzaehl zaehl3
      inner join apflora.tpopkontr kontr4
        inner join apflora.tpop tpop3
        on tpop3.id = kontr4.tpop_id
      on zaehl3.tpopkontr_id = kontr4.id
    where
      kontr4.jahr is not null
      and zaehl3.anzahl is not null
      and kontr4.tpop_id = tpop.id
    order by
      kontr4.jahr desc,
      kontr4.datum desc
    limit 1
  ) as jahr,
  anzahl.*
from crosstab($$
  select tpop_id, zaehleinheit, anzahl
  from (
    select distinct on (tpop2.id, apflora.tpopkontrzaehl_einheit_werte.text)
      tpop2.id as tpop_id,
      apflora.tpopkontrzaehl_einheit_werte.text as zaehleinheit,
      zaehl2.anzahl
    from
      apflora.tpopkontrzaehl zaehl2
      inner join apflora.tpopkontrzaehl_einheit_werte
      on apflora.tpopkontrzaehl_einheit_werte.code = zaehl2.einheit
      inner join apflora.tpopkontr kontr2
        inner join apflora.tpop tpop2
        on tpop2.id = kontr2.tpop_id
      on zaehl2.tpopkontr_id = kontr2.id
    where
      -- nur Kontrollen mit Jahr berücksichtigen
      kontr2.jahr is not null
      -- nur Zählungen mit Anzahl berücksichtigen
      and zaehl2.anzahl is not null
      and kontr2.id = (
        select
          kontr3.id
        from
          apflora.tpopkontrzaehl zaehl3
          inner join apflora.tpopkontr kontr3
            inner join apflora.tpop tpop3
            on tpop3.id = kontr3.tpop_id
          on zaehl3.tpopkontr_id = kontr3.id
        where
          kontr3.jahr is not null
          and zaehl3.anzahl is not null
          and kontr3.tpop_id = tpop2.id
        order by
          kontr3.jahr desc,
          kontr3.datum desc
        limit 1
      )
    order by
      tpop2.id,
      apflora.tpopkontrzaehl_einheit_werte.text,
      kontr2.jahr desc,
      kontr2.datum desc
    ) as tbl
  order by 1,2,3
  $$,
  $$SELECT unnest('{Pflanzen, Pflanzen (ohne Jungpflanzen), Triebe, Triebe Beweidung, Keimlinge, Rosetten, Jungpflanzen, Blätter, blühende Pflanzen, blühende Triebe, Blüten, Fertile Pflanzen, fruchtende Triebe, Blütenstände, Fruchtstände, Gruppen, Deckung (%), Pflanzen/5m2, Triebe in 30 m2, Triebe/50m2, Triebe Mähfläche, Fläche (m2), Pflanzstellen, Stellen, andere Zaehleinheit, Art ist vorhanden}'::text[])$$
) as anzahl ("tpop_id" uuid, "Pflanzen" text, "Pflanzen (ohne Jungpflanzen)" text, "Triebe" text, "Triebe Beweidung" text, "Keimlinge" text, "Rosetten" text, "Jungpflanzen" text, "Blätter" text, "blühende Pflanzen" text, "blühende Triebe" text, "Blüten" text, "Fertile Pflanzen" text, "fruchtende Triebe" text, "Blütenstände" text, "Fruchtstände" text, "Gruppen" text, "Deckung (%)" text, "Pflanzen/5m2" text, "Triebe in 30 m2" text, "Triebe/50m2" text, "Triebe Mähfläche" text, "Fläche (m2)" text, "Pflanzstellen" text, "Stellen" text, "andere Zaehleinheit" text, "Art ist vorhanden" text)
inner join apflora.tpop tpop
  inner join apflora.pop pop
    inner join apflora.ap
      inner join apflora.ae_taxonomies tax
      on ap.art_id = tax.id
    on apflora.ap.id = pop.ap_id
  on pop.id = tpop.pop_id
on tpop.id = anzahl.tpop_id
order BY
  tax.artname,
  pop.nr,
  tpop.nr;

DROP VIEW IF EXISTS apflora.v_pop_last_count CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_last_count AS
select 
  tax.artname,
  pop.nr as pop_nr,
  anzahl.*
from crosstab($$
  select pop_id, zaehleinheit, anzahl
  from 
    (with tpop_sums as (
      select distinct on (apflora.tpop.id, apflora.tpopkontrzaehl_einheit_werte.text)
        apflora.pop.id as pop_id,
        apflora.tpop.id as tpop_id,
        apflora.tpopkontrzaehl_einheit_werte.text as zaehleinheit,
        apflora.tpopkontrzaehl.anzahl as anzahl
      from
        apflora.tpopkontrzaehl
        inner join apflora.tpopkontrzaehl_einheit_werte
        on apflora.tpopkontrzaehl_einheit_werte.code = apflora.tpopkontrzaehl.einheit
        inner join apflora.tpopkontr
          inner join apflora.tpop
            inner join apflora.pop
            on apflora.pop.id = apflora.tpop.pop_id
          on apflora.tpop.id = apflora.tpopkontr.tpop_id
        on apflora.tpopkontrzaehl.tpopkontr_id = apflora.tpopkontr.id
      where
        -- nur Kontrollen mit Jahr berücksichtigen
        apflora.tpopkontr.jahr is not null
        -- nur Zählungen mit Anzahl berücksichtigen
        and apflora.tpopkontrzaehl.anzahl is not null
      order by
        apflora.tpop.id,
        apflora.tpopkontrzaehl_einheit_werte.text,
        apflora.tpopkontr.jahr desc,
        apflora.tpopkontr.datum desc
    )
    select pop_id, zaehleinheit, sum(anzahl) as anzahl
    from tpop_sums
    group by pop_id, zaehleinheit) as tbl
  order by 1,2,3
  $$,
  $$SELECT unnest('{Pflanzen, Pflanzen (ohne Jungpflanzen), Triebe, Triebe Beweidung, Keimlinge, Rosetten, Jungpflanzen, Blätter, blühende Pflanzen, blühende Triebe, Blüten, Fertile Pflanzen, fruchtende Triebe, Blütenstände, Fruchtstände, Gruppen, Deckung (%), Pflanzen/5m2, Triebe in 30 m2, Triebe/50m2, Triebe Mähfläche, Fläche (m2), Pflanzstellen, Stellen, andere Zaehleinheit, Art ist vorhanden}'::text[])$$
) as anzahl ("pop_id" uuid, "Pflanzen" text, "Pflanzen (ohne Jungpflanzen)" text, "Triebe" text, "Triebe Beweidung" text, "Keimlinge" text, "Rosetten" text, "Jungpflanzen" text, "Blätter" text, "blühende Pflanzen" text, "blühende Triebe" text, "Blüten" text, "Fertile Pflanzen" text, "fruchtende Triebe" text, "Blütenstände" text, "Fruchtstände" text, "Gruppen" text, "Deckung (%)" text, "Pflanzen/5m2" text, "Triebe in 30 m2" text, "Triebe/50m2" text, "Triebe Mähfläche" text, "Fläche (m2)" text, "Pflanzstellen" text, "Stellen" text, "andere Zaehleinheit" text, "Art ist vorhanden" text)
inner join apflora.pop pop
  inner join apflora.ap
    inner join apflora.ae_taxonomies tax
    on ap.art_id = tax.id
  on apflora.ap.id = pop.ap_id
on pop.id = anzahl.pop_id
order BY
  tax.artname,
  pop.nr;


DROP VIEW IF EXISTS apflora.v_pop_last_count_with_massn CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_last_count_with_massn AS
select 
  tax.artname,
  pop.nr as pop_nr,
  anzahl.*
from crosstab($$
  select pop_id, zaehleinheit, anzahl
  from 
    (with tpop_sums as (
      with nr_of_kontr as (
        select apflora.tpop.id, count(apflora.tpopkontr.id) as anzahl
        from 
          apflora.tpop
          left join apflora.tpopkontr
          on apflora.tpopkontr.tpop_id = apflora.tpop.id
        group by apflora.tpop.id
      )
      select * from (
        select distinct on (apflora.tpop.id)
          apflora.pop.id as pop_id,
          apflora.tpop.id as tpop_id,
          'Triebe' as zaehleinheit,
          apflora.tpopmassn.anz_triebe as anzahl
        from
          apflora.tpopmassn
          inner join apflora.tpop
            inner join nr_of_kontr
            on nr_of_kontr.id = apflora.tpop.id
            inner join apflora.pop
            on apflora.pop.id = apflora.tpop.pop_id
          on apflora.tpop.id = apflora.tpopmassn.tpop_id
        where
          apflora.tpopmassn.jahr is not null
          and apflora.tpop.status in (200, 201)
          and nr_of_kontr.anzahl = 0
          and apflora.tpopmassn.anz_triebe is not null
        order by
          apflora.tpop.id,
          apflora.tpopmassn.jahr desc,
          apflora.tpopmassn.datum desc
      ) as triebe
      union
      select * from (
        select distinct on (apflora.tpop.id)
          apflora.pop.id as pop_id,
          apflora.tpop.id as tpop_id,
          'Pflanzen' as zaehleinheit,
          apflora.tpopmassn.anz_pflanzen as anzahl
        from
          apflora.tpopmassn
          inner join apflora.tpop
            inner join nr_of_kontr
            on nr_of_kontr.id = apflora.tpop.id
            inner join apflora.pop
            on apflora.pop.id = apflora.tpop.pop_id
          on apflora.tpop.id = apflora.tpopmassn.tpop_id
        where
          apflora.tpopmassn.jahr is not null
          and apflora.tpop.status in (200, 201)
          and nr_of_kontr.anzahl = 0
          and apflora.tpopmassn.anz_pflanzen is not null
        order by
          apflora.tpop.id,
          apflora.tpopmassn.jahr desc,
          apflora.tpopmassn.datum desc
      ) as pflanzen
      union
      select * from (
        select distinct on (apflora.tpop.id)
          apflora.pop.id as pop_id,
          apflora.tpop.id as tpop_id,
          'Pflanzstellen' as zaehleinheit,
          apflora.tpopmassn.anz_pflanzstellen as anzahl
        from
          apflora.tpopmassn
          inner join apflora.tpop
            inner join nr_of_kontr
            on nr_of_kontr.id = apflora.tpop.id
            inner join apflora.pop
            on apflora.pop.id = apflora.tpop.pop_id
          on apflora.tpop.id = apflora.tpopmassn.tpop_id
        where
          apflora.tpopmassn.jahr is not null
          and apflora.tpop.status in (200, 201)
          and nr_of_kontr.anzahl = 0
          and apflora.tpopmassn.anz_pflanzstellen is not null
        order by
          apflora.tpop.id,
          apflora.tpopmassn.jahr desc,
          apflora.tpopmassn.datum desc
      ) as pflanzstellen
      union
      select * from (
        select distinct on (apflora.tpop.id, apflora.tpopkontrzaehl_einheit_werte.text)
            apflora.pop.id as pop_id,
            apflora.tpop.id as tpop_id,
            apflora.tpopkontrzaehl_einheit_werte.text as zaehleinheit,
            apflora.tpopkontrzaehl.anzahl as anzahl
          from
            apflora.tpopkontrzaehl
            inner join apflora.tpopkontrzaehl_einheit_werte
            on apflora.tpopkontrzaehl_einheit_werte.code = apflora.tpopkontrzaehl.einheit
            inner join apflora.tpopkontr
              inner join apflora.tpop
                inner join apflora.pop
                on apflora.pop.id = apflora.tpop.pop_id
              on apflora.tpop.id = apflora.tpopkontr.tpop_id
            on apflora.tpopkontrzaehl.tpopkontr_id = apflora.tpopkontr.id
          where
            -- nur Kontrollen mit Jahr berücksichtigen
            apflora.tpopkontr.jahr is not null
            -- nur Zählungen mit Anzahl berücksichtigen
            and apflora.tpopkontrzaehl.anzahl is not null
          order by
            apflora.tpop.id,
            apflora.tpopkontrzaehl_einheit_werte.text,
            apflora.tpopkontr.jahr desc,
            apflora.tpopkontr.datum desc
      ) as others
    )
    select pop_id, zaehleinheit, sum(anzahl) as anzahl
    from tpop_sums
    group by pop_id, zaehleinheit) as tbl
  order by 1,2,3
  $$,
  $$SELECT unnest('{Pflanzen, Pflanzen (ohne Jungpflanzen), Triebe, Triebe Beweidung, Keimlinge, Rosetten, Jungpflanzen, Blätter, blühende Pflanzen, blühende Triebe, Blüten, Fertile Pflanzen, fruchtende Triebe, Blütenstände, Fruchtstände, Gruppen, Deckung (%), Pflanzen/5m2, Triebe in 30 m2, Triebe/50m2, Triebe Mähfläche, Fläche (m2), Pflanzstellen, Stellen, andere Zaehleinheit, Art ist vorhanden}'::text[])$$
) as anzahl ("pop_id" uuid, "Pflanzen" text, "Pflanzen (ohne Jungpflanzen)" text, "Triebe" text, "Triebe Beweidung" text, "Keimlinge" text, "Rosetten" text, "Jungpflanzen" text, "Blätter" text, "blühende Pflanzen" text, "blühende Triebe" text, "Blüten" text, "Fertile Pflanzen" text, "fruchtende Triebe" text, "Blütenstände" text, "Fruchtstände" text, "Gruppen" text, "Deckung (%)" text, "Pflanzen/5m2" text, "Triebe in 30 m2" text, "Triebe/50m2" text, "Triebe Mähfläche" text, "Fläche (m2)" text, "Pflanzstellen" text, "Stellen" text, "andere Zaehleinheit" text, "Art ist vorhanden" text)
inner join apflora.pop pop
  inner join apflora.ap
    inner join apflora.ae_taxonomies tax
    on ap.art_id = tax.id
  on apflora.ap.id = pop.ap_id
on pop.id = anzahl.pop_id
order BY
  tax.artname,
  pop.nr;



DROP VIEW IF EXISTS apflora.v_tpop_last_count_with_massn CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_last_count_with_massn AS
select 
  tax.artname,
  pop.nr as pop_nr,
  tpop.nr as tpop_nr,
  anzahl.*
from crosstab($$
  select tpop_id, zaehleinheit, anzahl
  from 
    (
      with nr_of_kontr as (
        select apflora.tpop.id, count(apflora.tpopkontr.id) as anzahl
        from 
          apflora.tpop
          left join apflora.tpopkontr
          on apflora.tpopkontr.tpop_id = apflora.tpop.id
        group by apflora.tpop.id
      )
      select * from (
        select distinct on (apflora.tpop.id)
          apflora.tpop.id as tpop_id,
          'Triebe' as zaehleinheit,
          apflora.tpopmassn.anz_triebe as anzahl
        from
          apflora.tpopmassn
          inner join apflora.tpop
            inner join nr_of_kontr
            on nr_of_kontr.id = apflora.tpop.id
          on apflora.tpop.id = apflora.tpopmassn.tpop_id
        where
          apflora.tpopmassn.jahr is not null
          and apflora.tpop.status in (200, 201)
          and nr_of_kontr.anzahl = 0
          and apflora.tpopmassn.anz_triebe is not null
        order by
          apflora.tpop.id,
          apflora.tpopmassn.jahr desc,
          apflora.tpopmassn.datum desc
      ) as triebe
      union
      select * from (
        select distinct on (apflora.tpop.id)
          apflora.tpop.id as tpop_id,
          'Pflanzen' as zaehleinheit,
          apflora.tpopmassn.anz_pflanzen as anzahl
        from
          apflora.tpopmassn
          inner join apflora.tpop
            inner join nr_of_kontr
            on nr_of_kontr.id = apflora.tpop.id
          on apflora.tpop.id = apflora.tpopmassn.tpop_id
        where
          apflora.tpopmassn.jahr is not null
          and apflora.tpop.status in (200, 201)
          and nr_of_kontr.anzahl = 0
          and apflora.tpopmassn.anz_pflanzen is not null
        order by
          apflora.tpop.id,
          apflora.tpopmassn.jahr desc,
          apflora.tpopmassn.datum desc
      ) as pflanzen
      union
      select * from (
        select distinct on (apflora.tpop.id)
          apflora.tpop.id as tpop_id,
          'Pflanzstellen' as zaehleinheit,
          apflora.tpopmassn.anz_pflanzstellen as anzahl
        from
          apflora.tpopmassn
          inner join apflora.tpop
            inner join nr_of_kontr
            on nr_of_kontr.id = apflora.tpop.id
          on apflora.tpop.id = apflora.tpopmassn.tpop_id
        where
          apflora.tpopmassn.jahr is not null
          and apflora.tpop.status in (200, 201)
          and nr_of_kontr.anzahl = 0
          and apflora.tpopmassn.anz_pflanzstellen is not null
        order by
          apflora.tpop.id,
          apflora.tpopmassn.jahr desc,
          apflora.tpopmassn.datum desc
      ) as pflanzstellen
      union
      select * from (
        select distinct on (apflora.tpop.id, apflora.tpopkontrzaehl_einheit_werte.text)
            apflora.tpop.id as tpop_id,
            apflora.tpopkontrzaehl_einheit_werte.text as zaehleinheit,
            apflora.tpopkontrzaehl.anzahl as anzahl
          from
            apflora.tpopkontrzaehl
            inner join apflora.tpopkontrzaehl_einheit_werte
            on apflora.tpopkontrzaehl_einheit_werte.code = apflora.tpopkontrzaehl.einheit
            inner join apflora.tpopkontr
              inner join apflora.tpop
              on apflora.tpop.id = apflora.tpopkontr.tpop_id
            on apflora.tpopkontrzaehl.tpopkontr_id = apflora.tpopkontr.id
          where
            -- nur Kontrollen mit Jahr berücksichtigen
            apflora.tpopkontr.jahr is not null
            -- nur Zählungen mit Anzahl berücksichtigen
            and apflora.tpopkontrzaehl.anzahl is not null
          order by
            apflora.tpop.id,
            apflora.tpopkontrzaehl_einheit_werte.text,
            apflora.tpopkontr.jahr desc,
            apflora.tpopkontr.datum desc
      ) as others
    ) as tbl
  order by 1,2,3
  $$,
  $$SELECT unnest('{Pflanzen, Pflanzen (ohne Jungpflanzen), Triebe, Triebe Beweidung, Keimlinge, Rosetten, Jungpflanzen, Blätter, blühende Pflanzen, blühende Triebe, Blüten, Fertile Pflanzen, fruchtende Triebe, Blütenstände, Fruchtstände, Gruppen, Deckung (%), Pflanzen/5m2, Triebe in 30 m2, Triebe/50m2, Triebe Mähfläche, Fläche (m2), Pflanzstellen, Stellen, andere Zaehleinheit, Art ist vorhanden}'::text[])$$
) as anzahl ("tpop_id" uuid, "Pflanzen" text, "Pflanzen (ohne Jungpflanzen)" text, "Triebe" text, "Triebe Beweidung" text, "Keimlinge" text, "Rosetten" text, "Jungpflanzen" text, "Blätter" text, "blühende Pflanzen" text, "blühende Triebe" text, "Blüten" text, "Fertile Pflanzen" text, "fruchtende Triebe" text, "Blütenstände" text, "Fruchtstände" text, "Gruppen" text, "Deckung (%)" text, "Pflanzen/5m2" text, "Triebe in 30 m2" text, "Triebe/50m2" text, "Triebe Mähfläche" text, "Fläche (m2)" text, "Pflanzstellen" text, "Stellen" text, "andere Zaehleinheit" text, "Art ist vorhanden" text)
inner join apflora.tpop tpop
  inner join apflora.pop pop
    inner join apflora.ap
      inner join apflora.ae_taxonomies tax
      on ap.art_id = tax.id
    on apflora.ap.id = pop.ap_id
  on pop.id = tpop.pop_id
on tpop.id = anzahl.tpop_id
order BY
  tax.artname,
  pop.nr,
  tpop.nr;