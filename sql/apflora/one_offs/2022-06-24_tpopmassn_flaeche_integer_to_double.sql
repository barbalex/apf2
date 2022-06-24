DROP VIEW IF EXISTS apflora.v_massn_webgisbun CASCADE;

DROP VIEW IF EXISTS apflora.v_massn_fuergis_write CASCADE;

DROP VIEW IF EXISTS apflora.v_massn_fuergis_read CASCADE;

ALTER TABLE apflora.tpopmassn
  ALTER COLUMN flaeche TYPE real;

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
  apflora.tpop.boden_typ AS tpop_boden_typ,
  apflora.tpop.boden_kalkgehalt AS tpop_boden_kalkgehalt,
  apflora.tpop.boden_durchlaessigkeit AS tpop_boden_durchlaessigkeit,
  apflora.tpop.boden_humus AS tpop_boden_humus,
  apflora.tpop.boden_naehrstoffgehalt AS tpop_boden_naehrstoffgehalt,
  apflora.tpop.boden_abtrag AS tpop_boden_abtrag,
  apflora.tpop.wasserhaushalt AS tpop_wasserhaushalt,
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
  tpopkontrzaehl_einheit_werte.text AS massn_zieleinheit_einheit,
  apflora.tpopmassn.zieleinheit_anzahl AS massn_zieleinheit_anzahl,
  apflora.tpopmassn.wirtspflanze AS massn_wirtspflanze,
  apflora.tpopmassn.herkunft_pop AS massn_herkunft_pop,
  apflora.tpopmassn.sammeldatum AS massn_sammeldatum,
  apflora.tpopmassn.von_anzahl_individuen AS massn_von_anzahl_individuen,
  apflora.tpopmassn.created_at AS massn_created_at,
  apflora.tpopmassn.updated_at AS massn_updated_at,
  apflora.tpopmassn.changed_by AS massn_changed_by
FROM ((((apflora.ae_taxonomies
        INNER JOIN apflora.ap ON apflora.ae_taxonomies.id = apflora.ap.art_id
        INNER JOIN apflora.pop
        INNER JOIN apflora.tpop ON apflora.pop.id = apflora.tpop.pop_id
        INNER JOIN apflora.tpopmassn
        LEFT JOIN apflora.tpopkontrzaehl_einheit_werte ON apflora.tpopmassn.zieleinheit_einheit = tpopkontrzaehl_einheit_werte.code
        LEFT JOIN apflora.tpopmassn_typ_werte ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code ON apflora.tpop.id = apflora.tpopmassn.tpop_id ON apflora.ap.id = apflora.pop.ap_id
        LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
      LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
    LEFT JOIN apflora.pop_status_werte ON apflora.pop.status = pop_status_werte.code)
  LEFT JOIN apflora.pop_status_werte AS pop_status_werte_2 ON apflora.tpop.status = pop_status_werte_2.code)
  LEFT JOIN apflora.adresse ON apflora.tpopmassn.bearbeiter = apflora.adresse.id
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr,
  apflora.tpopmassn.jahr,
  apflora.tpopmassn.datum,
  tpopmassn_typ_werte.text;

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
  apflora.tpopmassn.zieleinheit_einheit AS massn_zieleinheit_einheit,
  apflora.tpopmassn.zieleinheit_anzahl AS massn_zieleinheit_anzahl,
  apflora.tpopmassn.wirtspflanze AS massn_wirtspflanze,
  apflora.tpopmassn.herkunft_pop AS massn_herkunft_pop,
  apflora.tpopmassn.sammeldatum AS massn_sammeldatum,
  apflora.tpopmassn.von_anzahl_individuen AS massn_von_anzahl_individuen,
  apflora.tpopmassn.bemerkungen AS massn_bemerkungen,
  apflora.tpopmassn.created_at AS massn_created_at,
  apflora.tpopmassn.updated_at AS massn_updated_at,
  apflora.tpopmassn.changed_by AS massn_changed_by
FROM
  apflora.tpopmassn;

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
  tpopkontrzaehl_einheit_werte.text AS "MASSNZIELEINHEITEINHEIT",
  apflora.tpopmassn.zieleinheit_anzahl AS "MASSNZIELEINHEITANZAHL",
  apflora.tpopmassn.wirtspflanze AS "MASSNWIRTSPFLANZEN",
  apflora.tpopmassn.herkunft_pop AS "MASSNHERKUNFTSPOP",
  apflora.tpopmassn.sammeldatum AS "MASSNSAMMELDAT",
  apflora.tpopmassn.von_anzahl_individuen AS "MASSNVONANZAHLINDIVIDUEN",
  to_char(apflora.tpopmassn.updated_at, 'DD.MM.YY') AS "MASSNCHANGEDAT",
  apflora.tpopmassn.changed_by AS "MASSNCHANGEBY"
FROM ((((((apflora.ae_taxonomies
            INNER JOIN apflora.ap ON apflora.ae_taxonomies.id = apflora.ap.art_id)
          INNER JOIN ((apflora.pop
              INNER JOIN apflora.tpop
              LEFT JOIN apflora.tpop_apberrelevant_grund_werte AS apberrelevant_grund_werte ON apflora.tpop.apber_relevant_grund = apberrelevant_grund_werte.code ON apflora.pop.id = apflora.tpop.pop_id)
            INNER JOIN (apflora.tpopmassn
              LEFT JOIN apflora.tpopkontrzaehl_einheit_werte ON apflora.tpopmassn.zieleinheit_einheit = apflora.tpopkontrzaehl_einheit_werte.code
              LEFT JOIN apflora.tpopmassn_typ_werte ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code) ON apflora.tpop.id = apflora.tpopmassn.tpop_id) ON apflora.ap.id = apflora.pop.ap_id)
        LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
      LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
    LEFT JOIN apflora.pop_status_werte ON apflora.pop.status = pop_status_werte.code)
  LEFT JOIN apflora.pop_status_werte AS pop_status_werte_2 ON apflora.tpop.status = pop_status_werte_2.code)
  LEFT JOIN apflora.adresse ON apflora.tpopmassn.bearbeiter = apflora.adresse.id
WHERE
  apflora.ae_taxonomies.taxid > 150
  AND apflora.tpop.status NOT IN (202, 300)
  AND (apflora.tpop.apber_relevant_grund != 3
    OR apflora.tpop.apber_relevant_grund IS NULL)
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr,
  apflora.tpopmassn.jahr,
  apflora.tpopmassn.datum,
  tpopmassn_typ_werte.text;

