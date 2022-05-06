-- used in export
DROP VIEW IF EXISTS apflora.v_pop_mit_letzter_popber CASCADE;

CREATE OR REPLACE VIEW apflora.v_pop_mit_letzter_popber AS
with letzter_popber AS (
  SELECT DISTINCT ON (apflora.popber.pop_id)
    apflora.popber.pop_id,
    apflora.popber.jahr
  FROM
    apflora.popber
  WHERE
    apflora.popber.jahr IS NOT NULL
  ORDER BY
    apflora.popber.pop_id,
    apflora.popber.jahr DESC
)
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
  apflora.pop.created_at AS pop_created_at,
  apflora.pop.updated_at AS pop_updated_at,
  apflora.pop.changed_by AS pop_changed_by,
  apflora.popber.id AS popber_id,
  apflora.popber.jahr AS popber_jahr,
  tpop_entwicklung_werte.text AS popber_entwicklung,
  apflora.popber.bemerkungen AS popber_bemerkungen,
  apflora.popber.created_at AS popber_created_at,
  apflora.popber.updated_at AS popber_updated_at,
  apflora.popber.changed_by AS popber_changed_by
FROM
  apflora.ae_taxonomies
  INNER JOIN apflora.ap
  LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code
  LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code
  INNER JOIN apflora.pop
  LEFT JOIN letzter_popber
  LEFT JOIN apflora.popber
  LEFT JOIN apflora.tpop_entwicklung_werte ON apflora.popber.entwicklung = tpop_entwicklung_werte.code ON (letzter_popber.jahr = apflora.popber.jahr)
    AND (letzter_popber.pop_id = apflora.popber.pop_id) ON apflora.pop.id = letzter_popber.pop_id
  LEFT JOIN apflora.pop_status_werte ON apflora.pop.status = pop_status_werte.code ON apflora.ap.id = apflora.pop.ap_id ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  apflora.ae_taxonomies.taxid > 150
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  letzter_popber.jahr;

COMMENT ON VIEW apflora.v_pop_mit_letzter_popber IS '@foreignKey (pop_id) references pop (id)';

-- used in export
DROP VIEW IF EXISTS apflora.v_pop_mit_letzter_popmassnber CASCADE;

CREATE OR REPLACE VIEW apflora.v_pop_mit_letzter_popmassnber AS
with pop_letztes_massnberjahr AS (
  SELECT DISTINCT ON (apflora.popmassnber.pop_id)
    apflora.popmassnber.pop_id AS id,
    apflora.popmassnber.jahr
  FROM
    apflora.popmassnber
  WHERE
    apflora.popmassnber.jahr IS NOT NULL
  ORDER BY
    apflora.popmassnber.pop_id,
    apflora.popmassnber.jahr DESC
)
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
  apflora.pop.created_at AS pop_created_at,
  apflora.pop.updated_at AS pop_updated_at,
  apflora.pop.changed_by AS pop_changed_by,
  apflora.popmassnber.id AS popmassnber_id,
  apflora.popmassnber.jahr AS popmassnber_jahr,
  tpopmassn_erfbeurt_werte.text AS popmassnber_entwicklung,
  apflora.popmassnber.bemerkungen AS popmassnber_bemerkungen,
  apflora.popmassnber.created_at AS popmassnber_created_at,
  apflora.popmassnber.updated_at AS popmassnber_updated_at,
  apflora.popmassnber.changed_by AS popmassnber_changed_by
FROM
  apflora.ae_taxonomies
  INNER JOIN apflora.ap
  LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code
  LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code
  INNER JOIN apflora.pop
  LEFT JOIN apflora.pop_status_werte ON apflora.pop.status = pop_status_werte.code
  LEFT JOIN pop_letztes_massnberjahr
  LEFT JOIN apflora.popmassnber
  LEFT JOIN apflora.tpopmassn_erfbeurt_werte ON apflora.popmassnber.beurteilung = tpopmassn_erfbeurt_werte.code ON (pop_letztes_massnberjahr.jahr = apflora.popmassnber.jahr)
    AND (pop_letztes_massnberjahr.id = apflora.popmassnber.pop_id) ON apflora.pop.id = pop_letztes_massnberjahr.id ON apflora.ap.id = apflora.pop.ap_id ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  apflora.ae_taxonomies.taxid > 150
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  pop_letztes_massnberjahr.jahr;

COMMENT ON VIEW apflora.v_pop_mit_letzter_popmassnber IS '@foreignKey (pop_id) references pop (id)';

-- used for export
DROP VIEW IF EXISTS apflora.v_pop_popberundmassnber CASCADE;

CREATE OR REPLACE VIEW apflora.v_pop_popberundmassnber AS
with berjahre AS (
  SELECT DISTINCT
    apflora.pop.id,
    apflora.popber.jahr
  FROM
    apflora.pop
    INNER JOIN apflora.popber ON apflora.pop.id = apflora.popber.pop_id
UNION
SELECT DISTINCT
  apflora.pop.id,
  apflora.popmassnber.jahr
FROM
  apflora.pop
  INNER JOIN apflora.popmassnber ON apflora.pop.id = apflora.popmassnber.pop_id
)
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
  apflora.pop.created_at AS pop_created_at,
  apflora.pop.updated_at AS pop_updated_at,
  apflora.pop.changed_by AS pop_changed_by,
  berjahre.jahr,
  apflora.popber.id AS popber_id,
  apflora.popber.jahr AS popber_jahr,
  tpop_entwicklung_werte.text AS popber_entwicklung,
  apflora.popber.bemerkungen AS popber_bemerkungen,
  apflora.popber.created_at AS popber_created_at,
  apflora.popber.updated_at AS popber_updated_at,
  apflora.popber.changed_by AS popber_changed_by,
  apflora.popmassnber.id AS popmassnber_id,
  apflora.popmassnber.jahr AS popmassnber_jahr,
  tpopmassn_erfbeurt_werte.text AS popmassnber_entwicklung,
  apflora.popmassnber.bemerkungen AS popmassnber_bemerkungen,
  apflora.popmassnber.created_at AS popmassnber_created_at,
  apflora.popmassnber.updated_at AS popmassnber_updated_at,
  apflora.popmassnber.changed_by AS popmassnber_changed_by
FROM
  apflora.ae_taxonomies
  INNER JOIN apflora.ap
  LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code
  LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code
  INNER JOIN apflora.pop
  LEFT JOIN apflora.pop_status_werte ON apflora.pop.status = pop_status_werte.code
  LEFT JOIN berjahre
  LEFT JOIN apflora.popber
  LEFT JOIN apflora.tpop_entwicklung_werte ON apflora.popber.entwicklung = tpop_entwicklung_werte.code ON (berjahre.jahr = apflora.popber.jahr)
    AND (berjahre.id = apflora.popber.pop_id)
  LEFT JOIN apflora.popmassnber
  LEFT JOIN apflora.tpopmassn_erfbeurt_werte ON apflora.popmassnber.beurteilung = tpopmassn_erfbeurt_werte.code ON (berjahre.jahr = apflora.popmassnber.jahr)
    AND (berjahre.id = apflora.popmassnber.pop_id) ON apflora.pop.id = berjahre.id ON apflora.ap.id = apflora.pop.ap_id ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  apflora.ae_taxonomies.taxid > 150
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  berjahre.jahr;

COMMENT ON VIEW apflora.v_pop_popberundmassnber IS '@foreignKey (pop_id) references pop (id)';

-- used for export
DROP VIEW IF EXISTS apflora.v_popmassnber_anzmassn CASCADE;

CREATE OR REPLACE VIEW apflora.v_popmassnber_anzmassn AS
with anz_massn_pro_jahr AS (
  SELECT
    apflora.popmassnber.pop_id,
    apflora.popmassnber.jahr,
    count(apflora.tpopmassn.id) AS anzahl_massnahmen
  FROM
    apflora.popmassnber
    INNER JOIN apflora.tpop
    LEFT JOIN apflora.tpopmassn ON apflora.tpop.id = apflora.tpopmassn.tpop_id ON apflora.popmassnber.pop_id = apflora.tpop.pop_id
  WHERE
    apflora.tpopmassn.jahr = apflora.popmassnber.jahr
    OR apflora.tpopmassn.jahr IS NULL
  GROUP BY
    apflora.popmassnber.pop_id,
    apflora.popmassnber.jahr
  ORDER BY
    apflora.popmassnber.pop_id,
    apflora.popmassnber.jahr
)
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
  apflora.pop.created_at AS pop_created_at,
  apflora.pop.updated_at AS pop_updated_at,
  apflora.pop.changed_by AS pop_changed_by,
  apflora.popmassnber.id AS id,
  apflora.popmassnber.jahr AS jahr,
  tpopmassn_erfbeurt_werte.text AS entwicklung,
  apflora.popmassnber.bemerkungen AS bemerkungen,
  apflora.popmassnber.created_at AS created_at,
  apflora.popmassnber.updated_at AS updated_at,
  apflora.popmassnber.changed_by AS changed_by,
  anz_massn_pro_jahr.anzahl_massnahmen
FROM
  apflora.ae_taxonomies
  INNER JOIN apflora.ap
  LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code
  LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code
  INNER JOIN apflora.pop
  LEFT JOIN apflora.pop_status_werte ON apflora.pop.status = pop_status_werte.code
  INNER JOIN apflora.popmassnber
  LEFT JOIN apflora.tpopmassn_erfbeurt_werte ON apflora.popmassnber.beurteilung = tpopmassn_erfbeurt_werte.code
  LEFT JOIN anz_massn_pro_jahr ON anz_massn_pro_jahr.pop_id = apflora.popmassnber.pop_id
    AND anz_massn_pro_jahr.jahr = apflora.popmassnber.jahr ON apflora.pop.id = apflora.popmassnber.pop_id ON apflora.ap.id = apflora.pop.ap_id ON apflora.ae_taxonomies.id = apflora.ap.art_id
  ORDER BY
    apflora.ae_taxonomies.artname,
    apflora.pop.nr;

COMMENT ON VIEW apflora.v_popmassnber_anzmassn IS '@foreignKey (id) references popmassnber (id)';

-- used for export
DROP VIEW IF EXISTS apflora.v_ap_apberundmassn;

CREATE OR REPLACE VIEW apflora.v_ap_apberundmassn AS
with massn_jahre AS (
  SELECT
    jahr
  FROM
    apflora.tpopmassn
  GROUP BY
    jahr
  HAVING
    jahr BETWEEN 1900 AND 2100
  ORDER BY
    jahr
),
ap_massn_jahre AS (
  SELECT
    apflora.ap.id,
    massn_jahre.jahr
  FROM
    apflora.ap,
    massn_jahre
  WHERE
    apflora.ap.bearbeitung < 4
  ORDER BY
    apflora.ap.id,
    massn_jahre.jahr
),
ap_anzmassnprojahr0 AS (
  SELECT
    apflora.ap.id,
    apflora.tpopmassn.jahr,
    count(apflora.tpopmassn.id) AS anz_tpopmassn
  FROM
    apflora.ap
    INNER JOIN apflora.pop
    INNER JOIN apflora.tpop ON apflora.pop.id = apflora.tpop.pop_id
    INNER JOIN apflora.tpopmassn ON apflora.tpop.id = apflora.tpopmassn.tpop_id ON apflora.ap.id = apflora.pop.ap_id
  WHERE
    apflora.ap.bearbeitung BETWEEN 1 AND 3
    AND apflora.tpop.apber_relevant = TRUE
    AND apflora.pop.status <> 300
  GROUP BY
    apflora.ap.id,
    apflora.tpopmassn.jahr
  HAVING
    apflora.tpopmassn.jahr IS NOT NULL
),
ap_anzmassnprojahr AS (
  SELECT
    ap_massn_jahre.id,
    ap_massn_jahre.jahr,
    coalesce(ap_anzmassnprojahr0.anz_tpopmassn, 0) AS anzahl_massnahmen
  FROM
    ap_massn_jahre
    LEFT JOIN ap_anzmassnprojahr0 ON (ap_massn_jahre.jahr = ap_anzmassnprojahr0.jahr)
      AND (ap_massn_jahre.id = ap_anzmassnprojahr0.id)
    ORDER BY
      ap_massn_jahre.id,
      ap_massn_jahre.jahr
),
ap_anzmassn_alle_jahre AS (
  SELECT
    ap_massn_jahre.id,
    ap_massn_jahre.jahr,
    coalesce(ap_anzmassnprojahr0.anz_tpopmassn, 0) AS anzahl_massnahmen
  FROM
    ap_massn_jahre
  LEFT JOIN ap_anzmassnprojahr0 ON (ap_massn_jahre.jahr = ap_anzmassnprojahr0.jahr)
    AND (ap_massn_jahre.id = ap_anzmassnprojahr0.id)
),
ap_anzmassnbisjahr AS (
  SELECT
    ap_massn_jahre.id,
    ap_massn_jahre.jahr,
    sum(ap_anzmassn_alle_jahre.anzahl_massnahmen) AS anzahl_massnahmen
FROM
  ap_massn_jahre
  INNER JOIN ap_anzmassn_alle_jahre ON ap_massn_jahre.id = ap_anzmassn_alle_jahre.id
  WHERE
    ap_anzmassn_alle_jahre.jahr <= ap_massn_jahre.jahr
  GROUP BY
    ap_massn_jahre.id,
    ap_massn_jahre.jahr
)
SELECT
  apflora.ap.id,
  ap_anzmassnprojahr.jahr AS massn_jahr,
  ap_anzmassnprojahr.anzahl_massnahmen AS massn_anzahl,
  ap_anzmassnbisjahr.anzahl_massnahmen AS massn_anzahl_bisher,
  CASE WHEN apflora.apber.jahr > 0 THEN
    'ja'
  ELSE
    'nein'
  END AS bericht_erstellt
FROM
  apflora.ap
  INNER JOIN ap_anzmassnprojahr
  INNER JOIN ap_anzmassnbisjahr
  LEFT JOIN apflora.apber ON (ap_anzmassnbisjahr.jahr = apflora.apber.jahr)
    AND (ap_anzmassnbisjahr.id = apflora.apber.ap_id) ON (ap_anzmassnprojahr.jahr = ap_anzmassnbisjahr.jahr)
    AND (ap_anzmassnprojahr.id = ap_anzmassnbisjahr.id) ON apflora.ap.id = ap_anzmassnprojahr.id;

COMMENT ON VIEW apflora.v_ap_apberundmassn IS '@foreignKey (id) references ap (id)';

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

-- used for export
DROP VIEW IF EXISTS apflora.v_tpop_anzmassn CASCADE;

CREATE OR REPLACE VIEW apflora.v_tpop_anzmassn AS
SELECT
  apflora.ap.id AS ap_id,
  apflora.ae_taxonomies.familie,
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
  apflora.tpop.id,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname,
  pop_status_werte_2.text AS status,
  apflora.tpop.bekannt_seit,
  apflora.tpop.status_unklar,
  apflora.tpop.status_unklar_grund,
  apflora.tpop.lv95_x AS x,
  apflora.tpop.lv95_y AS y,
  apflora.tpop.radius,
  apflora.tpop.hoehe,
  apflora.tpop.exposition,
  apflora.tpop.klima,
  apflora.tpop.neigung,
  apflora.tpop.boden_typ,
  apflora.tpop.boden_kalkgehalt,
  apflora.tpop.boden_durchlaessigkeit,
  apflora.tpop.boden_humus,
  apflora.tpop.boden_naehrstoffgehalt,
  apflora.tpop.boden_abtrag,
  apflora.tpop.wasserhaushalt,
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
  INNER JOIN (((apflora.ap
        INNER JOIN ((apflora.pop
            LEFT JOIN apflora.pop_status_werte ON apflora.pop.status = pop_status_werte.code)
          INNER JOIN ((apflora.tpop
              LEFT JOIN apflora.tpopmassn ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
            LEFT JOIN apflora.pop_status_werte AS pop_status_werte_2 ON apflora.tpop.status = pop_status_werte_2.code) ON apflora.pop.id = apflora.tpop.pop_id) ON apflora.ap.id = apflora.pop.ap_id)
      LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
    LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code) ON apflora.ae_taxonomies.id = apflora.ap.art_id
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
  apflora.tpop.boden_typ,
  apflora.tpop.boden_kalkgehalt,
  apflora.tpop.boden_durchlaessigkeit,
  apflora.tpop.boden_humus,
  apflora.tpop.boden_naehrstoffgehalt,
  apflora.tpop.boden_abtrag,
  apflora.tpop.wasserhaushalt,
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

COMMENT ON VIEW apflora.v_tpop_anzmassn IS '@foreignKey (id) references tpop (id)';

-- used for export
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
  apflora.pop.lv95_x AS x,
  apflora.pop.lv95_y AS y,
  count(apflora.tpopmassn.id) AS anzahl_massnahmen
FROM ((((apflora.ae_taxonomies
        INNER JOIN apflora.ap ON apflora.ae_taxonomies.id = apflora.ap.art_id)
      INNER JOIN ((apflora.pop
          LEFT JOIN apflora.tpop ON apflora.pop.id = apflora.tpop.pop_id)
        LEFT JOIN apflora.tpopmassn ON apflora.tpop.id = apflora.tpopmassn.tpop_id) ON apflora.ap.id = apflora.pop.ap_id)
    LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
  LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
  LEFT JOIN apflora.pop_status_werte ON apflora.pop.status = pop_status_werte.code
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

COMMENT ON VIEW apflora.v_pop_anzmassn IS '@foreignKey (id) references pop (id)';

-- used for export
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
  apflora.pop.lv95_x AS x,
  apflora.pop.lv95_y AS y,
  count(apflora.tpopkontr.id) AS anzahl_kontrollen
FROM ((((apflora.ae_taxonomies
        INNER JOIN apflora.ap ON apflora.ae_taxonomies.id = apflora.ap.art_id)
      INNER JOIN ((apflora.pop
          LEFT JOIN apflora.tpop ON apflora.pop.id = apflora.tpop.pop_id)
        LEFT JOIN apflora.tpopkontr ON apflora.tpop.id = apflora.tpopkontr.tpop_id) ON apflora.ap.id = apflora.pop.ap_id)
    LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
  LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
  LEFT JOIN apflora.pop_status_werte ON apflora.pop.status = pop_status_werte.code
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

COMMENT ON VIEW apflora.v_pop_anzkontr IS '@foreignKey (id) references pop (id)'
-- used for export
DROP VIEW IF EXISTS apflora.v_ap_anzmassn CASCADE;

CREATE OR REPLACE VIEW apflora.v_ap_anzmassn AS
SELECT
  apflora.ap.id,
  count(apflora.tpopmassn.id) AS anzahl_massnahmen
FROM
  apflora.ap
  LEFT JOIN apflora.pop
  LEFT JOIN apflora.tpop
  LEFT JOIN apflora.tpopmassn ON apflora.tpop.id = apflora.tpopmassn.tpop_id ON apflora.pop.id = apflora.tpop.pop_id ON apflora.ap.id = apflora.pop.ap_id
GROUP BY
  apflora.ap.id;

COMMENT ON VIEW apflora.v_ap_anzmassn IS '@foreignKey (id) references ap (id)'
-- used for export
DROP VIEW IF EXISTS apflora.v_ap_anzkontr CASCADE;

CREATE OR REPLACE VIEW apflora.v_ap_anzkontr AS
SELECT
  apflora.ap.id,
  count(apflora.tpopkontr.id) AS anzahl_kontrollen
FROM
  apflora.ap
  LEFT JOIN apflora.pop
  LEFT JOIN apflora.tpop
  LEFT JOIN apflora.tpopkontr ON apflora.tpop.id = apflora.tpopkontr.tpop_id ON apflora.pop.id = apflora.tpop.pop_id ON apflora.ap.id = apflora.pop.ap_id
GROUP BY
  apflora.ap.id;

COMMENT ON VIEW apflora.v_ap_anzkontr IS '@foreignKey (id) references ap (id)'
-- used for export
DROP VIEW IF EXISTS apflora.v_pop_ohnekoord CASCADE;

CREATE OR REPLACE VIEW apflora.v_pop_ohnekoord AS
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
  apflora.pop.lv95_x AS x,
  apflora.pop.lv95_y AS y,
  apflora.pop.created_at,
  apflora.pop.updated_at,
  apflora.pop.changed_by
FROM ((((apflora.ae_taxonomies
        INNER JOIN apflora.ap ON apflora.ae_taxonomies.id = apflora.ap.art_id)
      INNER JOIN apflora.pop ON apflora.ap.id = apflora.pop.ap_id)
    LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
  LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
  LEFT JOIN apflora.pop_status_werte ON apflora.pop.status = pop_status_werte.code
WHERE
  apflora.pop.lv95_x IS NULL
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr;

COMMENT ON VIEW apflora.v_pop_ohnekoord IS '@foreignKey (id) references pop (id)';

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
  apflora.pop.created_at,
  apflora.pop.updated_at,
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
  apflora.pop.lv95_x AS x,
  apflora.pop.lv95_y AS y,
  apflora.pop.created_at,
  apflora.pop.updated_at,
  apflora.pop.changed_by
FROM ((((apflora.ae_taxonomies
        INNER JOIN apflora.ap ON apflora.ae_taxonomies.id = apflora.ap.art_id)
      INNER JOIN apflora.pop ON apflora.ap.id = apflora.pop.ap_id)
    LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
  LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
  LEFT JOIN apflora.pop_status_werte ON apflora.pop.status = pop_status_werte.code
WHERE
  apflora.pop.lv95_x > 0
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_tpop_erste_und_letzte_kontrolle_und_letzter_tpopber CASCADE;

CREATE OR REPLACE VIEW apflora.v_tpop_erste_und_letzte_kontrolle_und_letzter_tpopber AS
with anz_kontr AS (
  SELECT
    apflora.tpop.id AS tpop_id,
    count(apflora.tpopkontr.id) AS anz_tpopkontr
  FROM
    apflora.tpop
    LEFT JOIN apflora.tpopkontr ON apflora.tpop.id = apflora.tpopkontr.tpop_id
  WHERE
    apflora.tpopkontr.jahr IS NOT NULL
    AND apflora.tpopkontr.typ IS NOT NULL
    AND apflora.tpopkontr.typ NOT IN ('ziel', 'zwischenziel')
    AND apflora.tpopkontr.apber_nicht_relevant IS NOT TRUE
  GROUP BY
    apflora.tpop.id
),
letzte_kontr AS (
  SELECT DISTINCT ON (apflora.tpop.id)
    apflora.tpop.id,
    apflora.tpopkontr.id AS tpopkontr_id
  FROM
    apflora.tpop
    INNER JOIN apflora.tpopkontr ON apflora.tpop.id = apflora.tpopkontr.tpop_id
  WHERE
    apflora.tpopkontr.jahr IS NOT NULL
    AND apflora.tpopkontr.typ IS NOT NULL
    AND apflora.tpopkontr.typ NOT IN ('ziel', 'zwischenziel')
    AND apflora.tpopkontr.apber_nicht_relevant IS NOT TRUE
  ORDER BY
    apflora.tpop.id,
    tpopkontr.jahr DESC,
    tpopkontr.datum DESC
),
letzte_kontr_anzahlen AS (
  SELECT
    apflora.tpopkontr.tpop_id,
    array_to_string(array_agg(apflora.tpopkontrzaehl.anzahl), ', ') AS anzahlen,
  string_agg(apflora.tpopkontrzaehl_einheit_werte.text, ', ') AS einheiten,
  string_agg(apflora.tpopkontrzaehl_methode_werte.text, ', ') AS methoden
FROM
  apflora.tpopkontr
  INNER JOIN apflora.tpopkontrzaehl
    LEFT JOIN apflora.tpopkontrzaehl_einheit_werte ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code
    LEFT JOIN apflora.tpopkontrzaehl_methode_werte ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code ON apflora.tpopkontrzaehl.tpopkontr_id = apflora.tpopkontr.id
    INNER JOIN letzte_kontr ON letzte_kontr.tpopkontr_id = apflora.tpopkontr.id
      AND letzte_kontr.id = apflora.tpopkontr.tpop_id
  GROUP BY
    apflora.tpopkontr.tpop_id
),
erste_kontr AS (
  SELECT DISTINCT ON (apflora.tpop.id)
    apflora.tpop.id,
    apflora.tpopkontr.id AS tpopkontr_id
  FROM
    apflora.tpop
    INNER JOIN apflora.tpopkontr ON apflora.tpop.id = apflora.tpopkontr.tpop_id
  WHERE
    apflora.tpopkontr.jahr IS NOT NULL
    AND apflora.tpopkontr.typ IS NOT NULL
    AND apflora.tpopkontr.typ NOT IN ('ziel', 'zwischenziel')
    AND apflora.tpopkontr.apber_nicht_relevant IS NOT TRUE
  ORDER BY
    apflora.tpop.id,
    tpopkontr.jahr ASC,
    tpopkontr.datum ASC
),
erste_kontr_anzahlen AS (
  SELECT
    apflora.tpopkontr.tpop_id,
    array_to_string(array_agg(apflora.tpopkontrzaehl.anzahl), ', ') AS anzahlen,
  string_agg(apflora.tpopkontrzaehl_einheit_werte.text, ', ') AS einheiten,
  string_agg(apflora.tpopkontrzaehl_methode_werte.text, ', ') AS methoden
FROM
  apflora.tpopkontr
  INNER JOIN apflora.tpopkontrzaehl
    LEFT JOIN apflora.tpopkontrzaehl_einheit_werte ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code
    LEFT JOIN apflora.tpopkontrzaehl_methode_werte ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code ON apflora.tpopkontrzaehl.tpopkontr_id = apflora.tpopkontr.id
    INNER JOIN erste_kontr ON erste_kontr.tpopkontr_id = apflora.tpopkontr.id
      AND erste_kontr.id = apflora.tpopkontr.tpop_id
  GROUP BY
    apflora.tpopkontr.tpop_id
),
anz_tpopber AS (
  SELECT
    apflora.tpop.id AS tpop_id,
    count(apflora.tpopber.id) AS anzahl
  FROM
    apflora.tpop
    LEFT JOIN apflora.tpopber ON apflora.tpop.id = apflora.tpopber.tpop_id
  WHERE
    apflora.tpopber.jahr IS NOT NULL
    AND apflora.tpopber.entwicklung IS NOT NULL
  GROUP BY
    apflora.tpop.id
),
letzte_tpopber AS (
  SELECT DISTINCT ON (apflora.tpopber.tpop_id)
    apflora.tpopber.tpop_id,
    apflora.tpopber.id,
    apflora.tpopber.jahr,
    apflora.tpop_entwicklung_werte.text AS entwicklung,
    apflora.tpopber.bemerkungen,
    apflora.tpopber.created_at,
    apflora.tpopber.updated_at,
    apflora.tpopber.changed_by
  FROM
    apflora.tpopber
    LEFT JOIN apflora.tpop_entwicklung_werte ON apflora.tpopber.entwicklung = tpop_entwicklung_werte.code
  WHERE
    apflora.tpopber.jahr IS NOT NULL
    AND apflora.tpopber.entwicklung IS NOT NULL
  ORDER BY
    apflora.tpopber.tpop_id,
    apflora.tpopber.jahr DESC,
    apflora.tpopber.updated_at DESC
)
SELECT
  apflora.pop.ap_id,
  apflora.ae_taxonomies.familie,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  apflora.adresse.name AS ap_bearbeiter,
  apflora.pop.id AS pop_id,
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
  apflora.tpop.lv95_x AS x,
  apflora.tpop.lv95_y AS y,
  apflora.tpop.radius,
  apflora.tpop.hoehe,
  apflora.tpop.exposition,
  apflora.tpop.klima,
  apflora.tpop.neigung,
  apflora.tpop.boden_typ,
  apflora.tpop.boden_kalkgehalt,
  apflora.tpop.boden_durchlaessigkeit,
  apflora.tpop.boden_humus,
  apflora.tpop.boden_naehrstoffgehalt,
  apflora.tpop.boden_abtrag,
  apflora.tpop.wasserhaushalt,
  apflora.tpop.beschreibung,
  apflora.tpop.kataster_nr,
  apflora.tpop.apber_relevant,
  apflora.tpop.apber_relevant_grund,
  apflora.tpop.eigentuemer,
  apflora.tpop.kontakt,
  apflora.tpop.nutzungszone,
  apflora.tpop.bewirtschafter,
  apflora.tpop.bewirtschaftung,
  apflora.ekfrequenz.code AS ekfrequenz,
  apflora.tpop.ekfrequenz_abweichend,
  apflora.tpop.created_at,
  apflora.tpop.updated_at,
  apflora.tpop.changed_by,
  coalesce(anz_kontr.anz_tpopkontr, 0) AS anzahl_kontrollen,
  lk.id AS letzte_kontrolle_id,
  lk.jahr AS letzte_kontrolle_jahr,
  lk.datum AS letzte_kontrolle_datum,
  lk.typ AS letzte_kontrolle_typ,
  lk_adresse.name AS letzte_kontrolle_bearbeiter,
  lk.ueberlebensrate AS letzte_kontrolle_ueberlebensrate,
  lk.vitalitaet AS letzte_kontrolle_vitalitaet,
  lk_entwicklung_werte.text AS letzte_kontrolle_entwicklung,
  lk.ursachen AS letzte_kontrolle_ursachen,
  lk.erfolgsbeurteilung AS letzte_kontrolle_erfolgsbeurteilung,
  lk.umsetzung_aendern AS letzte_kontrolle_umsetzung_aendern,
  lk.kontrolle_aendern AS letzte_kontrolle_kontrolle_aendern,
  lk.bemerkungen AS letzte_kontrolle_bemerkungen,
  lk.lr_delarze AS letzte_kontrolle_lr_delarze,
  lk.lr_umgebung_delarze AS letzte_kontrolle_lr_umgebung_delarze,
  lk.vegetationstyp AS letzte_kontrolle_vegetationstyp,
  lk.konkurrenz AS letzte_kontrolle_konkurrenz,
  lk.moosschicht AS letzte_kontrolle_moosschicht,
  lk.krautschicht AS letzte_kontrolle_krautschicht,
  lk.strauchschicht AS letzte_kontrolle_strauchschicht,
  lk.baumschicht AS letzte_kontrolle_baumschicht,
  lk_idbiotuebereinst_werte.text AS letzte_kontrolle_idealbiotop_uebereinstimmung,
  lk.handlungsbedarf AS letzte_kontrolle_handlungsbedarf,
  lk.flaeche_ueberprueft AS letzte_kontrolle_flaeche_ueberprueft,
  lk.flaeche AS letzte_kontrolle_flaeche,
  lk.plan_vorhanden AS letzte_kontrolle_plan_vorhanden,
  lk.deckung_vegetation AS letzte_kontrolle_deckung_vegetation,
  lk.deckung_nackter_boden AS letzte_kontrolle_deckung_nackter_boden,
  lk.deckung_ap_art AS letzte_kontrolle_deckung_ap_art,
  lk.jungpflanzen_vorhanden AS letzte_kontrolle_jungpflanzen_vorhanden,
  lk.vegetationshoehe_maximum AS letzte_kontrolle_vegetationshoehe_maximum,
  lk.vegetationshoehe_mittel AS letzte_kontrolle_vegetationshoehe_mittel,
  lk.gefaehrdung AS letzte_kontrolle_gefaehrdung,
  lk.created_at AS letzte_kontrolle_created_at,
  lk.updated_at AS letzte_kontrolle_updated_at,
  lk.changed_by AS letzte_kontrolle_changed_by,
  lk.apber_nicht_relevant AS letzte_kontrolle_apber_nicht_relevant,
  lk.apber_nicht_relevant_grund AS letzte_kontrolle_apber_nicht_relevant_grund,
  lk.ekf_bemerkungen AS letzte_kontrolle_ekf_bemerkungen,
  letzte_kontr_anzahlen.anzahlen AS letzte_kontrolle_zaehlung_anzahlen,
  letzte_kontr_anzahlen.einheiten AS letzte_kontrolle_zaehlung_einheiten,
  letzte_kontr_anzahlen.methoden AS letzte_kontrolle_zaehlung_methoden,
  ek.id AS erste_kontrolle_id,
  ek.jahr AS erste_kontrolle_jahr,
  ek.datum AS erste_kontrolle_datum,
  ek.typ AS erste_kontrolle_typ,
  ek_adresse.name AS erste_kontrolle_bearbeiter,
  ek.ueberlebensrate AS erste_kontrolle_ueberlebensrate,
  ek.vitalitaet AS erste_kontrolle_vitalitaet,
  ek_entwicklung_werte.text AS erste_kontrolle_entwicklung,
  ek.ursachen AS erste_kontrolle_ursachen,
  ek.erfolgsbeurteilung AS erste_kontrolle_erfolgsbeurteilung,
  ek.umsetzung_aendern AS erste_kontrolle_umsetzung_aendern,
  ek.kontrolle_aendern AS erste_kontrolle_kontrolle_aendern,
  ek.bemerkungen AS erste_kontrolle_bemerkungen,
  ek.lr_delarze AS erste_kontrolle_lr_delarze,
  ek.lr_umgebung_delarze AS erste_kontrolle_lr_umgebung_delarze,
  ek.vegetationstyp AS erste_kontrolle_vegetationstyp,
  ek.konkurrenz AS erste_kontrolle_konkurrenz,
  ek.moosschicht AS erste_kontrolle_moosschicht,
  ek.krautschicht AS erste_kontrolle_krautschicht,
  ek.strauchschicht AS erste_kontrolle_strauchschicht,
  ek.baumschicht AS erste_kontrolle_baumschicht,
  ek_idbiotuebereinst_werte.text AS erste_kontrolle_idealbiotop_uebereinstimmung,
  ek.handlungsbedarf AS erste_kontrolle_handlungsbedarf,
  ek.flaeche_ueberprueft AS erste_kontrolle_flaeche_ueberprueft,
  ek.flaeche AS erste_kontrolle_flaeche,
  ek.plan_vorhanden AS erste_kontrolle_plan_vorhanden,
  ek.deckung_vegetation AS erste_kontrolle_deckung_vegetation,
  ek.deckung_nackter_boden AS erste_kontrolle_deckung_nackter_boden,
  ek.deckung_ap_art AS erste_kontrolle_deckung_ap_art,
  ek.jungpflanzen_vorhanden AS erste_kontrolle_jungpflanzen_vorhanden,
  ek.vegetationshoehe_maximum AS erste_kontrolle_vegetationshoehe_maximum,
  ek.vegetationshoehe_mittel AS erste_kontrolle_vegetationshoehe_mittel,
  ek.gefaehrdung AS erste_kontrolle_gefaehrdung,
  ek.created_at AS erste_kontrolle_created_at,
  ek.updated_at AS erste_kontrolle_updated_at,
  ek.changed_by AS erste_kontrolle_changed_by,
  ek.apber_nicht_relevant AS erste_kontrolle_apber_nicht_relevant,
  ek.apber_nicht_relevant_grund AS erste_kontrolle_apber_nicht_relevant_grund,
  ek.ekf_bemerkungen AS erste_kontrolle_ekf_bemerkungen,
  erste_kontr_anzahlen.anzahlen AS erste_kontrolle_zaehlung_anzahlen,
  erste_kontr_anzahlen.einheiten AS erste_kontrolle_zaehlung_einheiten,
  erste_kontr_anzahlen.methoden AS erste_kontrolle_zaehlung_methoden,
  anz_tpopber.anzahl AS tpopber_anz,
  letzte_tpopber.id AS tpopber_id,
  letzte_tpopber.jahr AS tpopber_jahr,
  letzte_tpopber.entwicklung AS tpopber_entwicklung,
  letzte_tpopber.bemerkungen AS tpopber_bemerkungen,
  letzte_tpopber.created_at AS tpopber_created_at,
  letzte_tpopber.updated_at AS tpopber_updated_at,
  letzte_tpopber.changed_by AS tpopber_changed_by
FROM
  apflora.ae_taxonomies
  INNER JOIN apflora.ap
  LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code
  LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code
  LEFT JOIN apflora.adresse ON apflora.ap.bearbeiter = apflora.adresse.id
  INNER JOIN apflora.pop
  LEFT JOIN apflora.pop_status_werte ON apflora.pop.status = pop_status_werte.code
  INNER JOIN apflora.tpop
  LEFT JOIN apflora.ekfrequenz ON apflora.ekfrequenz.id = apflora.tpop.ekfrequenz
  LEFT JOIN letzte_kontr_anzahlen ON letzte_kontr_anzahlen.tpop_id = apflora.tpop.id
  LEFT JOIN erste_kontr_anzahlen ON erste_kontr_anzahlen.tpop_id = apflora.tpop.id
  LEFT JOIN anz_tpopber ON anz_tpopber.tpop_id = apflora.tpop.id
  LEFT JOIN anz_kontr ON anz_kontr.tpop_id = apflora.tpop.id
  LEFT JOIN apflora.pop_status_werte AS pop_status_werte_2 ON apflora.tpop.status = pop_status_werte_2.code
  LEFT JOIN letzte_tpopber ON apflora.tpop.id = letzte_tpopber.tpop_id
  LEFT JOIN letzte_kontr
  INNER JOIN apflora.tpopkontr AS lk
  LEFT JOIN apflora.adresse lk_adresse ON lk.bearbeiter = lk_adresse.id
  LEFT JOIN apflora.tpop_entwicklung_werte lk_entwicklung_werte ON lk.entwicklung = lk_entwicklung_werte.code
  LEFT JOIN apflora.tpopkontr_idbiotuebereinst_werte lk_idbiotuebereinst_werte ON lk.idealbiotop_uebereinstimmung = lk_idbiotuebereinst_werte.code ON letzte_kontr.tpopkontr_id = lk.id ON letzte_kontr.id = apflora.tpop.id
  LEFT JOIN erste_kontr
  INNER JOIN apflora.tpopkontr AS ek
  LEFT JOIN apflora.adresse ek_adresse ON ek.bearbeiter = ek_adresse.id
  LEFT JOIN apflora.tpop_entwicklung_werte ek_entwicklung_werte ON ek.entwicklung = ek_entwicklung_werte.code
  LEFT JOIN apflora.tpopkontr_idbiotuebereinst_werte ek_idbiotuebereinst_werte ON ek.idealbiotop_uebereinstimmung = ek_idbiotuebereinst_werte.code ON erste_kontr.tpopkontr_id = ek.id ON erste_kontr.id = apflora.tpop.id ON apflora.pop.id = apflora.tpop.pop_id ON apflora.ap.id = apflora.pop.ap_id ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  apflora.ae_taxonomies.taxid > 150
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr;

COMMENT ON VIEW apflora.v_tpop_erste_und_letzte_kontrolle_und_letzter_tpopber IS '@foreignKey (id) references tpop (id)';

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
  apflora.tpop.boden_typ AS "TPOPBODENTYP",
  apflora.tpop.boden_kalkgehalt AS "TPOPBODENKALKGEHALT",
  apflora.tpop.boden_durchlaessigkeit AS "TPOPBODENDURCHLAESSIGKEIT",
  apflora.tpop.boden_humus AS "TPOPBODENHUMUS",
  apflora.tpop.boden_naehrstoffgehalt AS "TPOPBODENNAEHRSTOFFGEHALT",
  apflora.tpop.boden_abtrag AS "TPOPBODENABTRAG",
  apflora.tpop.wasserhaushalt AS "TPOPWASSERHAUSHALT",
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
  to_char(apflora.tpop.updated_at, 'DD.MM.YY') AS "TPOPCHANGEDAT",
  apflora.tpop.changed_by AS "TPOPCHANGEBY"
FROM ((((((apflora.ae_taxonomies
            INNER JOIN apflora.ap ON apflora.ae_taxonomies.id = apflora.ap.art_id)
          INNER JOIN (apflora.pop
            INNER JOIN apflora.tpop
            LEFT JOIN apflora.tpop_apberrelevant_grund_werte AS apberrelevant_grund_werte ON apflora.tpop.apber_relevant_grund = apberrelevant_grund_werte.code ON apflora.pop.id = apflora.tpop.pop_id) ON apflora.ap.id = apflora.pop.ap_id)
        LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
      LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
    LEFT JOIN apflora.pop_status_werte ON apflora.pop.status = pop_status_werte.code)
  LEFT JOIN apflora.pop_status_werte AS pop_status_werte_2 ON apflora.tpop.status = pop_status_werte_2.code)
  LEFT JOIN apflora.adresse ON apflora.ap.bearbeiter = apflora.adresse.id
WHERE
  apflora.ae_taxonomies.taxid > 150
  AND apflora.tpop.status NOT IN (202, 300)
  AND (apflora.tpop.apber_relevant_grund != 3
    OR apflora.tpop.apber_relevant_grund IS NULL)
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
  apflora.tpop.boden_typ AS tpop_boden_typ,
  apflora.tpop.boden_kalkgehalt AS tpop_boden_kalkgehalt,
  apflora.tpop.boden_durchlaessigkeit AS tpop_boden_durchlaessigkeit,
  apflora.tpop.boden_humus AS tpop_boden_humus,
  apflora.tpop.boden_naehrstoffgehalt AS tpop_boden_naehrstoffgehalt,
  apflora.tpop.boden_abtrag AS tpop_boden_abtrag,
  apflora.tpop.wasserhaushalt AS tpop_wasserhaushalt,
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
  apflora.tpop.created_at AS tpop_created_at,
  apflora.tpop.updated_at AS tpop_updated_at,
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
  apflora.tpop.boden_typ AS tpop_boden_typ,
  apflora.tpop.boden_kalkgehalt AS tpop_boden_kalkgehalt,
  apflora.tpop.boden_durchlaessigkeit AS tpop_boden_durchlaessigkeit,
  apflora.tpop.boden_humus AS tpop_boden_humus,
  apflora.tpop.boden_naehrstoffgehalt AS tpop_boden_naehrstoffgehalt,
  apflora.tpop.boden_abtrag AS tpop_boden_abtrag,
  apflora.tpop.wasserhaushalt AS tpop_wasserhaushalt,
  apflora.tpop.beschreibung AS tpop_beschreibung,
  apflora.tpop.kataster_nr AS tpop_kataster_nr,
  apflora.tpop.apber_relevant AS tpop_apber_relevant,
  apflora.tpop.apber_relevant_grund AS tpop_apber_relevant_grund,
  apflora.tpop.eigentuemer AS tpop_eigentuemer,
  apflora.tpop.kontakt AS tpop_kontakt,
  apflora.tpop.nutzungszone AS tpop_nutzungszone,
  apflora.tpop.bewirtschafter AS tpop_bewirtschafter,
  apflora.tpop.bewirtschaftung AS tpop_bewirtschaftung,
  apflora.tpop.created_at AS tpop_created_at,
  apflora.tpop.updated_at AS tpop_updated_at,
  apflora.tpop.changed_by AS tpop_changed_by
FROM (((((apflora.ae_taxonomies
          INNER JOIN apflora.ap ON apflora.ae_taxonomies.id = apflora.ap.art_id)
        INNER JOIN (apflora.pop
          INNER JOIN apflora.tpop ON apflora.pop.id = apflora.tpop.pop_id) ON apflora.ap.id = apflora.pop.ap_id)
      LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
    LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
  LEFT JOIN apflora.pop_status_werte ON apflora.pop.status = pop_status_werte.code)
  LEFT JOIN apflora.pop_status_werte AS pop_status_werte_2 ON apflora.tpop.status = pop_status_werte_2.code
WHERE
  apflora.tpop.lv95_y > 0
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr;

-- used for export
DROP VIEW IF EXISTS apflora.v_pop_vonapohnestatus CASCADE;

CREATE OR REPLACE VIEW apflora.v_pop_vonapohnestatus AS
SELECT
  apflora.ap.id AS ap_id,
  apflora.ae_taxonomies.artname,
  apflora.ap.bearbeitung AS ap_bearbeitung,
  apflora.pop.id,
  apflora.pop.nr,
  apflora.pop.name,
  apflora.pop.status,
  apflora.pop.lv95_x AS x,
  apflora.pop.lv95_y AS y
FROM
  apflora.ae_taxonomies
  INNER JOIN (apflora.ap
    INNER JOIN apflora.pop ON apflora.ap.id = apflora.pop.ap_id) ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  apflora.ap.bearbeitung = 3
  AND apflora.pop.status IS NULL
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr;

COMMENT ON VIEW apflora.v_pop_vonapohnestatus IS '@foreignKey (id) references pop (id)';

-- used for export
DROP VIEW IF EXISTS apflora.v_tpop_ohnebekanntseit CASCADE;

CREATE OR REPLACE VIEW apflora.v_tpop_ohnebekanntseit AS
SELECT
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.pop.nr AS pop_nr,
  apflora.pop.name AS pop_name,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname,
  apflora.tpop.bekannt_seit,
  apflora.tpop.id,
  apflora.tpop.lv95_x AS x,
  apflora.tpop.lv95_y AS y
FROM ((apflora.ae_taxonomies
    INNER JOIN apflora.ap ON apflora.ae_taxonomies.id = apflora.ap.art_id)
  INNER JOIN apflora.ap_bearbstand_werte ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
INNER JOIN (apflora.pop
  INNER JOIN apflora.tpop ON apflora.pop.id = apflora.tpop.pop_id) ON apflora.ap.id = apflora.pop.ap_id
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
  to_char(apflora.tpopkontr.updated_at, 'DD.MM.YY') AS "KONTRCHANGEDAT",
  apflora.tpopkontr.changed_by AS "KONTRCHANGEBY",
  string_agg(apflora.tpopkontrzaehl_einheit_werte.text, ', ') AS "ZAEHLEINHEITEN",
  array_to_string(array_agg(apflora.tpopkontrzaehl.anzahl), ', ') AS "ANZAHLEN",
  string_agg(apflora.tpopkontrzaehl_methode_werte.text, ', ') AS "METHODEN"
FROM (((((((apflora.ae_taxonomies
              INNER JOIN apflora.ap ON apflora.ae_taxonomies.id = apflora.ap.art_id)
            INNER JOIN (apflora.pop
              INNER JOIN (apflora.tpop
                LEFT JOIN apflora.pop_status_werte AS pop_status_werte_2 ON apflora.tpop.status = pop_status_werte_2.code
                LEFT JOIN apflora.tpop_apberrelevant_grund_werte AS apberrelevant_grund_werte ON apflora.tpop.apber_relevant_grund = apberrelevant_grund_werte.code
                INNER JOIN ((((((apflora.tpopkontr
                            LEFT JOIN apflora.tpopkontr_typ_werte ON apflora.tpopkontr.typ = apflora.tpopkontr_typ_werte.text)
                          LEFT JOIN apflora.adresse ON apflora.tpopkontr.bearbeiter = apflora.adresse.id)
                        LEFT JOIN apflora.tpop_entwicklung_werte ON apflora.tpopkontr.entwicklung = apflora.tpop_entwicklung_werte.code)
                      LEFT JOIN apflora.tpopkontrzaehl ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
                    LEFT JOIN apflora.tpopkontrzaehl_einheit_werte ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code)
                  LEFT JOIN apflora.tpopkontrzaehl_methode_werte ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code) ON apflora.tpop.id = apflora.tpopkontr.tpop_id) ON apflora.pop.id = apflora.tpop.pop_id) ON apflora.ap.id = apflora.pop.ap_id)
          LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
        LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
      LEFT JOIN apflora.pop_status_werte ON apflora.pop.status = apflora.pop_status_werte.code)
    LEFT JOIN apflora.tpopkontr_idbiotuebereinst_werte ON apflora.tpopkontr.idealbiotop_uebereinstimmung = apflora.tpopkontr_idbiotuebereinst_werte.code)
  LEFT JOIN apflora.adresse AS apflora_adresse_1 ON apflora.ap.bearbeiter = apflora_adresse_1.id)
WHERE
  apflora.ae_taxonomies.taxid > 150
  AND apflora.tpop.status NOT IN (202, 300)
  AND (apflora.tpop.apber_relevant_grund != 3
    OR apflora.tpop.apber_relevant_grund IS NULL)
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
  apflora.tpopkontr.updated_at,
  apflora.tpopkontr.changed_by
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr;

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
  apflora.tpopkontr.created_at,
  apflora.tpopkontr.updated_at,
  apflora.tpopkontr.changed_by
FROM
  apflora.tpopkontr;

DROP VIEW IF EXISTS apflora.v_tpopkontr_fuergis_read CASCADE;

CREATE OR REPLACE VIEW apflora.v_tpopkontr_fuergis_read AS
SELECT
  apflora.ap.id AS ap_id,
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
  apflora.tpopkontr.created_at,
  apflora.tpopkontr.updated_at,
  apflora.tpopkontr.changed_by
FROM (((((apflora.ae_taxonomies
          INNER JOIN apflora.ap ON apflora.ae_taxonomies.id = apflora.ap.art_id)
        INNER JOIN (apflora.pop
          INNER JOIN (apflora.tpop
            INNER JOIN (((apflora.tpopkontr
                  LEFT JOIN apflora.tpopkontr_typ_werte ON apflora.tpopkontr.typ = apflora.tpopkontr_typ_werte.text)
                LEFT JOIN apflora.adresse ON apflora.tpopkontr.bearbeiter = apflora.adresse.id)
              LEFT JOIN apflora.tpop_entwicklung_werte ON apflora.tpopkontr.entwicklung = apflora.tpop_entwicklung_werte.code) ON apflora.tpop.id = apflora.tpopkontr.tpop_id) ON apflora.pop.id = apflora.tpop.pop_id) ON apflora.ap.id = apflora.pop.ap_id)
      LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
    LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
  LEFT JOIN apflora.pop_status_werte ON apflora.pop.status = apflora.pop_status_werte.code)
  LEFT JOIN apflora.tpopkontr_idbiotuebereinst_werte ON apflora.tpopkontr.idealbiotop_uebereinstimmung = apflora.tpopkontr_idbiotuebereinst_werte.code
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr,
  apflora.tpopkontr.jahr,
  apflora.tpopkontr.datum;

-- used for export
DROP VIEW IF EXISTS apflora.v_beob CASCADE;

CREATE OR REPLACE VIEW apflora.v_beob AS
SELECT
  beob.id,
  beob.quelle,
  beob.id_field,
  beob.data ->> beob.id_field AS "OriginalId",
  beob.art_id,
  beob.art_id_original,
  tax.artname AS "Artname",
  pop.id AS pop_id,
  pop.nr AS pop_nr,
  tpop.id AS tpop_id,
  tpop.nr AS tpop_nr,
  pop_status_werte.text AS tpop_status,
  tpop.gemeinde AS tpop_gemeinde,
  tpop.flurname AS tpop_flurname,
  beob.lv95_x AS x,
  beob.lv95_y AS y,
  CASE WHEN beob.lv95_x > 0
    AND tpop.lv95_x > 0 THEN
    round(ST_Distance (ST_Transform (beob.geom_point, 2056), ST_Transform (tpop.geom_point, 2056)))
  ELSE
    NULL
  END AS distanz_zur_teilpopulation,
  beob.datum,
  beob.autor,
  beob.nicht_zuordnen,
  beob.bemerkungen,
  beob.created_at,
  beob.updated_at,
  beob.changed_by
FROM (apflora.beob beob
  INNER JOIN apflora.ae_taxonomies tax
  INNER JOIN apflora.ap ap ON ap.art_id = tax.id ON beob.art_id = tax.id)
  LEFT JOIN apflora.tpop tpop ON tpop.id = beob.tpop_id
  LEFT JOIN apflora.pop_status_werte AS pop_status_werte ON tpop.status = pop_status_werte.code
  LEFT JOIN apflora.pop pop ON pop.id = tpop.pop_id
WHERE
  tax.taxid > 150
ORDER BY
  tax.artname ASC,
  pop.nr ASC,
  tpop.nr ASC,
  beob.datum DESC;

-- unsed in exports
DROP VIEW IF EXISTS apflora.v_beob_art_changed CASCADE;

CREATE OR REPLACE VIEW apflora.v_beob_art_changed AS
SELECT
  apflora.beob.id,
  apflora.beob.quelle,
  beob.id_field,
  beob.data ->> (
    SELECT
      id_field
    FROM apflora.beob
    WHERE
      id = beob2.id) AS "original_id",
apflora.beob.art_id_original,
ae_artidoriginal.artname AS "artname_original",
ae_artidoriginal.taxid AS "taxonomie_id_original",
apflora.beob.art_id,
ae_artid.artname AS "artname",
ae_artid.taxid AS "taxonomie_id",
apflora.pop.id AS pop_id,
apflora.pop.nr AS pop_nr,
apflora.tpop.id AS tpop_id,
apflora.tpop.nr AS tpop_nr,
pop_status_werte.text AS tpop_status,
apflora.tpop.gemeinde AS tpop_gemeinde,
apflora.tpop.flurname AS tpop_flurname,
apflora.beob.lv95_x AS x,
apflora.beob.lv95_y AS y,
CASE WHEN apflora.beob.lv95_x > 0
  AND apflora.tpop.lv95_x > 0 THEN
  round(ST_Distance (ST_Transform (apflora.beob.geom_point, 2056), ST_Transform (apflora.tpop.geom_point, 2056)))
ELSE
  NULL
END AS distanz_zur_teilpopulation,
apflora.beob.datum,
apflora.beob.autor,
apflora.beob.nicht_zuordnen,
apflora.beob.geom_point,
apflora.beob.bemerkungen,
apflora.beob.created_at,
apflora.beob.updated_at,
apflora.beob.changed_by
FROM
  apflora.beob
  INNER JOIN apflora.beob AS beob2 ON beob2.id = beob.id
  INNER JOIN apflora.ae_taxonomies AS ae_artid
  INNER JOIN apflora.ap AS artidsap ON artidsap.art_id = ae_artid.id ON apflora.beob.art_id = ae_artid.id
  INNER JOIN apflora.ae_taxonomies AS ae_artidoriginal
  INNER JOIN apflora.ap AS artidoriginalsap ON artidoriginalsap.art_id = ae_artidoriginal.id ON apflora.beob.art_id_original = ae_artidoriginal.id
  LEFT JOIN apflora.tpop ON apflora.tpop.id = apflora.beob.tpop_id
  LEFT JOIN apflora.pop_status_werte AS pop_status_werte ON apflora.tpop.status = pop_status_werte.code
  LEFT JOIN apflora.pop ON apflora.pop.id = apflora.tpop.pop_id
WHERE
  ae_artid.taxid > 150
  AND apflora.beob.art_id <> apflora.beob.art_id_original
ORDER BY
  ae_artid.artname ASC,
  apflora.pop.nr ASC,
  apflora.tpop.nr ASC,
  apflora.beob.datum DESC;

-- used in exports
DROP VIEW IF EXISTS apflora.v_tpop_kml CASCADE;

CREATE OR REPLACE VIEW apflora.v_tpop_kml AS
SELECT
  apflora.ae_taxonomies.artname AS "art",
  concat(apflora.pop.nr, '/', apflora.tpop.nr) AS "label",
  substring(concat('Population: ', apflora.pop.nr, ' ', apflora.pop.name, '<br /> Teilpopulation: ', apflora.tpop.nr, ' ', apflora.tpop.gemeinde, ' ', apflora.tpop.flurname)
    FROM 1 FOR 225) AS "inhalte",
  concat('https://apflora.ch/Daten/Projekte/', apflora.ap.proj_id, '/Aktionspläne/', apflora.ap.id, '/Populationen/', apflora.pop.id, '/Teil-Populationen/', apflora.tpop.id) AS url,
  apflora.tpop.id,
  apflora.tpop.wgs84_lat,
  apflora.tpop.wgs84_long
FROM (apflora.ae_taxonomies
  INNER JOIN apflora.ap ON apflora.ae_taxonomies.id = apflora.ap.art_id)
INNER JOIN (apflora.pop
  INNER JOIN apflora.tpop ON apflora.pop.id = apflora.tpop.pop_id) ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.tpop.lv95_x IS NOT NULL
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.pop.name,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname;

COMMENT ON VIEW apflora.v_tpop_kml IS '@foreignKey (id) references tpop (id)';

-- used in exports
DROP VIEW IF EXISTS apflora.v_tpop_kmlnamen CASCADE;

CREATE OR REPLACE VIEW apflora.v_tpop_kmlnamen AS
SELECT
  apflora.ae_taxonomies.artname AS "art",
  concat(apflora.ae_taxonomies.artname, ' ', apflora.pop.nr, '/', apflora.tpop.nr) AS "label",
  substring(concat('Population: ', apflora.pop.nr, ' ', apflora.pop.name, '<br /> Teilpopulation: ', apflora.tpop.nr, ' ', apflora.tpop.gemeinde, ' ', apflora.tpop.flurname)
    FROM 1 FOR 225) AS "inhalte",
  concat('https://apflora.ch/Daten/Projekte/', apflora.ap.proj_id, '/Aktionspläne/', apflora.ap.id, '/Populationen/', apflora.pop.id, '/Teil-Populationen/', apflora.tpop.id) AS url,
  apflora.tpop.id,
  apflora.tpop.wgs84_lat,
  apflora.tpop.wgs84_long
FROM (apflora.ae_taxonomies
  INNER JOIN apflora.ap ON apflora.ae_taxonomies.id = apflora.ap.art_id)
INNER JOIN (apflora.pop
  INNER JOIN apflora.tpop ON apflora.pop.id = apflora.tpop.pop_id) ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.tpop.lv95_x IS NOT NULL
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.pop.name,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname;

COMMENT ON VIEW apflora.v_tpop_kmlnamen IS '@foreignKey (id) references tpop (id)';

-- used in exports
DROP VIEW IF EXISTS apflora.v_pop_kml CASCADE;

CREATE OR REPLACE VIEW apflora.v_pop_kml AS
SELECT
  apflora.ae_taxonomies.artname AS "art",
  apflora.pop.nr AS "label",
  substring(concat('Population: ', apflora.pop.nr, ' ', apflora.pop.name)
    FROM 1 FOR 225) AS "inhalte",
  concat('https://apflora.ch/Daten/Projekte/', apflora.ap.proj_id, '/Aktionspläne/', apflora.ap.id, '/Populationen/', apflora.pop.id) AS url,
  apflora.pop.id,
  apflora.pop.wgs84_lat,
  apflora.pop.wgs84_long
FROM
  apflora.ae_taxonomies
  INNER JOIN apflora.ap
  INNER JOIN apflora.pop ON apflora.ap.id = apflora.pop.ap_id ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  apflora.pop.lv95_x IS NOT NULL
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.pop.name;

COMMENT ON VIEW apflora.v_pop_kml IS '@foreignKey (id) references pop (id)';

-- used in exports
DROP VIEW IF EXISTS apflora.v_pop_kmlnamen CASCADE;

CREATE OR REPLACE VIEW apflora.v_pop_kmlnamen AS
SELECT
  apflora.ae_taxonomies.artname AS "art",
  concat(apflora.ae_taxonomies.artname, ' ', apflora.pop.nr) AS "label",
  substring(concat('Population: ', apflora.pop.nr, ' ', apflora.pop.name)
    FROM 1 FOR 225) AS "inhalte",
  concat('https://apflora.ch/Daten/Projekte/', apflora.ap.proj_id, '/Aktionspläne/', apflora.ap.id, '/Populationen/', apflora.pop.id) AS url,
  apflora.pop.id,
  apflora.pop.wgs84_lat,
  apflora.pop.wgs84_long
FROM
  apflora.ae_taxonomies
  INNER JOIN (apflora.ap
    INNER JOIN apflora.pop ON apflora.ap.id = apflora.pop.ap_id) ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  apflora.pop.lv95_x IS NOT NULL
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.pop.name;

COMMENT ON VIEW apflora.v_pop_kmlnamen IS '@foreignKey (id) references pop (id)';

-- used in exports
DROP VIEW IF EXISTS apflora.v_kontrzaehl_anzproeinheit CASCADE;

CREATE OR REPLACE VIEW apflora.v_kontrzaehl_anzproeinheit AS
SELECT
  apflora.ap.id AS ap_id,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  apflora_adresse_1.name AS ap_bearbeiter,
  apflora.pop.id AS pop_id,
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
  apflora.tpop.boden_typ AS tpop_boden_typ,
  apflora.tpop.boden_kalkgehalt AS tpop_boden_kalkgehalt,
  apflora.tpop.boden_durchlaessigkeit AS tpop_boden_durchlaessigkeit,
  apflora.tpop.boden_humus AS tpop_boden_humus,
  apflora.tpop.boden_naehrstoffgehalt AS tpop_boden_naehrstoffgehalt,
  apflora.tpop.boden_abtrag AS tpop_boden_abtrag,
  apflora.tpop.wasserhaushalt AS tpop_wasserhaushalt,
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
  apflora.tpopkontr.created_at AS kontr_created_at,
  apflora.tpopkontr.updated_at AS kontr_updated_at,
  apflora.tpopkontr.changed_by AS kontr_changed_by,
  apflora.tpopkontr.apber_nicht_relevant AS kontr_apber_nicht_relevant,
  apflora.tpopkontr.apber_nicht_relevant_grund AS kontr_apber_nicht_relevant_grund,
  apflora.tpopkontr.ekf_bemerkungen AS kontr_ekf_bemerkungen,
  apflora.tpopkontrzaehl.id,
  apflora.tpopkontrzaehl_einheit_werte.text AS einheit,
  apflora.tpopkontrzaehl_methode_werte.text AS methode,
  apflora.tpopkontrzaehl.anzahl
FROM
  apflora.ae_taxonomies
  INNER JOIN ((((apflora.ap
          LEFT JOIN apflora.adresse AS apflora_adresse_1 ON apflora.ap.bearbeiter = apflora_adresse_1.id)
        LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
      LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
    INNER JOIN ((apflora.pop
        LEFT JOIN apflora.pop_status_werte ON apflora.pop.status = apflora.pop_status_werte.code)
      INNER JOIN ((apflora.tpop
          LEFT JOIN apflora.pop_status_werte AS tpop_status_werte ON tpop_status_werte.code = apflora.tpop.status)
        INNER JOIN (((((apflora.tpopkontr
                  LEFT JOIN apflora.tpopkontr_idbiotuebereinst_werte ON apflora.tpopkontr.idealbiotop_uebereinstimmung = apflora.tpopkontr_idbiotuebereinst_werte.code)
                LEFT JOIN apflora.tpopkontr_typ_werte ON apflora.tpopkontr.typ = apflora.tpopkontr_typ_werte.text)
              LEFT JOIN apflora.adresse ON apflora.tpopkontr.bearbeiter = apflora.adresse.id)
            LEFT JOIN apflora.tpop_entwicklung_werte ON apflora.tpopkontr.entwicklung = apflora.tpop_entwicklung_werte.code)
          LEFT JOIN ((apflora.tpopkontrzaehl
              LEFT JOIN apflora.tpopkontrzaehl_einheit_werte ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code)
            LEFT JOIN apflora.tpopkontrzaehl_methode_werte ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code) ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id) ON apflora.tpop.id = apflora.tpopkontr.tpop_id) ON apflora.pop.id = apflora.tpop.pop_id) ON apflora.ap.id = apflora.pop.ap_id) ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  apflora.ae_taxonomies.taxid > 150
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr,
  apflora.tpopkontr.jahr,
  apflora.tpopkontr.datum;

-- used in exports
-- TODO: make this query more efficient. Takes 48s to run
DROP VIEW IF EXISTS apflora.v_tpop_popberundmassnber CASCADE;

CREATE OR REPLACE VIEW apflora.v_tpop_popberundmassnber AS
with berjahre AS (
  SELECT
    apflora.tpop.id,
    apflora.tpopber.jahr
  FROM
    apflora.tpop
    INNER JOIN apflora.tpopber ON apflora.tpop.id = apflora.tpopber.tpop_id
UNION
SELECT
  apflora.tpop.id,
  apflora.tpopmassnber.jahr
FROM
  apflora.tpop
  INNER JOIN apflora.tpopmassnber ON apflora.tpop.id = apflora.tpopmassnber.tpop_id
)
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
  apflora.tpop.boden_typ AS tpop_boden_typ,
  apflora.tpop.boden_kalkgehalt AS tpop_boden_kalkgehalt,
  apflora.tpop.boden_durchlaessigkeit AS tpop_boden_durchlaessigkeit,
  apflora.tpop.boden_humus AS tpop_boden_humus,
  apflora.tpop.boden_naehrstoffgehalt AS tpop_boden_naehrstoffgehalt,
  apflora.tpop.boden_abtrag AS tpop_boden_abtrag,
  apflora.tpop.wasserhaushalt AS tpop_wasserhaushalt,
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
  apflora.tpopber.created_at AS tpopber_created_at,
  apflora.tpopber.updated_at AS tpopber_updated_at,
  apflora.tpopber.changed_by AS tpopber_changed_by,
  apflora.tpopmassnber.id AS tpopmassnber_id,
  apflora.tpopmassnber.jahr AS tpopmassnber_jahr,
  tpopmassn_erfbeurt_werte.text AS tpopmassnber_entwicklung,
  apflora.tpopmassnber.bemerkungen AS tpopmassnber_bemerkungen,
  apflora.tpopmassnber.created_at AS tpopmassnber_created_at,
  apflora.tpopmassnber.updated_at AS tpopmassnber_updated_at,
  apflora.tpopmassnber.changed_by AS tpopmassnber_changed_by
FROM
  apflora.ae_taxonomies
  RIGHT JOIN apflora.ap
  RIGHT JOIN apflora.pop
  RIGHT JOIN apflora.tpop
  LEFT JOIN apflora.pop_status_werte AS tpop_status_werte ON apflora.tpop.status = tpop_status_werte.code
  LEFT JOIN berjahre
  LEFT JOIN apflora.tpopmassnber
  LEFT JOIN apflora.tpopmassn_erfbeurt_werte ON apflora.tpopmassnber.beurteilung = tpopmassn_erfbeurt_werte.code ON (berjahre.id = apflora.tpopmassnber.tpop_id)
    AND (berjahre.jahr = apflora.tpopmassnber.jahr)
  LEFT JOIN apflora.tpopber
  LEFT JOIN apflora.tpop_entwicklung_werte ON apflora.tpopber.entwicklung = tpop_entwicklung_werte.code ON (berjahre.jahr = apflora.tpopber.jahr)
    AND (berjahre.id = apflora.tpopber.tpop_id) ON apflora.tpop.id = berjahre.id ON apflora.pop.id = apflora.tpop.pop_id
  LEFT JOIN apflora.pop_status_werte ON apflora.pop.status = pop_status_werte.code ON apflora.ap.id = apflora.pop.ap_id
  LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code
  LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code ON apflora.ae_taxonomies.id = apflora.ap.art_id
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr,
  berjahre.jahr;

-- used in exports
DROP VIEW IF EXISTS apflora.v_tpop_ohneapberichtrelevant CASCADE;

CREATE OR REPLACE VIEW apflora.v_tpop_ohneapberichtrelevant AS
SELECT
  apflora.ae_taxonomies.artname AS "Artname",
  apflora.pop.nr AS pop_nr,
  apflora.pop.name AS pop_name,
  apflora.tpop.id,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname,
  apflora.tpop.apber_relevant,
  apflora.tpop.apber_relevant_grund,
  apflora.tpop.lv95_x AS x,
  apflora.tpop.lv95_y AS y
FROM
  apflora.ae_taxonomies
  INNER JOIN (apflora.ap
    INNER JOIN (apflora.pop
      INNER JOIN apflora.tpop ON apflora.tpop.pop_id = apflora.pop.id) ON apflora.pop.ap_id = apflora.ap.id) ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  apflora.tpop.apber_relevant IS NULL
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_q_tpop_bekanntseit_juenger_als_aelteste_beob CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_tpop_bekanntseit_juenger_als_aelteste_beob AS SELECT DISTINCT
  apflora.projekt.id AS proj_id,
  apflora.ap.id AS ap_id,
  apflora.pop.id AS pop_id,
  apflora.pop.nr AS pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.projekt
  INNER JOIN apflora.ap
  INNER JOIN apflora.pop
  INNER JOIN apflora.tpop
  INNER JOIN apflora.beob ON apflora.beob.tpop_id = apflora.tpop.id ON apflora.tpop.pop_id = apflora.pop.id ON apflora.pop.ap_id = apflora.ap.id ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.tpop.bekannt_seit > (
    SELECT
      min(date_part('year', apflora.beob.datum)) AS "MinJahr"
    FROM
      apflora.beob
    WHERE
      tpop_id = apflora.tpop.id
      -- Baumann-Manuskript enthält viele Beobachtungen ohne Datum (auch andere haben unvollständige)
      -- Müssen ausgeschlossen werden
      AND date_part('year', apflora.beob.datum) > 0
    GROUP BY
      tpop_id)
ORDER BY
  apflora.projekt.id,
  apflora.ap.id,
  apflora.pop.nr,
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_q_tpop_popnrtpopnrmehrdeutig CASCADE;

-- 2022.05.06 correct to solve 534
CREATE OR REPLACE VIEW apflora.v_q_tpop_popnrtpopnrmehrdeutig AS
with multiples AS (
  SELECT
    ap.id AS ap_id,
    pop.nr AS pop_nr,
    tpop.nr AS tpop_nr,
    count(tpop.id) AS tpop_id_count
  FROM
    apflora.ap ap
    INNER JOIN apflora.pop pop ON ap.id = pop.ap_id
    INNER JOIN apflora.tpop tpop ON tpop.pop_id = pop.id
  GROUP BY
    ap.id,
    pop.nr,
    tpop.nr
  HAVING
    count(tpop.id) > 1
)
SELECT
  projekt.id AS proj_id,
  ap.id AS ap_id,
  pop.id AS pop_id,
  pop.nr AS pop_nr,
  tpop.id,
  tpop.nr,
  m.tpop_id_count AS count
FROM
  apflora.projekt projekt
  INNER JOIN apflora.ap ap
  INNER JOIN apflora.pop pop
  INNER JOIN apflora.tpop tpop ON tpop.pop_id = pop.id ON pop.ap_id = ap.id ON projekt.id = ap.proj_id
  INNER JOIN multiples m ON m.ap_id = ap.id
    AND m.pop_nr = pop.nr
    AND m.tpop_nr = tpop.nr
  ORDER BY
    projekt.id,
    ap.id,
    pop.nr,
    tpop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_bekanntseit_nicht_aeltestetpop CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_pop_bekanntseit_nicht_aeltestetpop AS
SELECT
  apflora.projekt.id AS proj_id,
  apflora.ap.id AS ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.projekt
  INNER JOIN apflora.ap
  INNER JOIN apflora.pop ON apflora.pop.ap_id = apflora.ap.id ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.pop.bekannt_seit <> (
    SELECT
      min(bekannt_seit)
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.pop_id = apflora.pop.id)
ORDER BY
  apflora.projekt.id,
  apflora.ap.id,
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_popnrmehrdeutig CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_pop_popnrmehrdeutig AS
SELECT
  apflora.projekt.id AS proj_id,
  apflora.ap.id AS ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.projekt
  INNER JOIN apflora.ap
  INNER JOIN apflora.pop ON apflora.pop.ap_id = apflora.ap.id ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.pop.ap_id IN ( SELECT DISTINCT
      ap_id
    FROM
      apflora.pop
    GROUP BY
      ap_id,
      nr
    HAVING
      COUNT(*) > 1)
  AND apflora.pop.nr IN ( SELECT DISTINCT
      nr
    FROM
      apflora.pop
    GROUP BY
      ap_id,
      nr
    HAVING
      COUNT(*) > 1)
ORDER BY
  apflora.projekt.id,
  apflora.ap.id,
  apflora.pop.nr;

-- TODO: seems only to output pops with koord but no tpop
DROP VIEW IF EXISTS apflora.v_q_pop_koordentsprechenkeinertpop CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_pop_koordentsprechenkeinertpop AS SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.pop.ap_id,
  apflora.pop.id,
  apflora.pop.nr,
  apflora.pop.lv95_x AS x,
  apflora.pop.lv95_y AS y
FROM
  apflora.ap
  INNER JOIN apflora.pop ON apflora.pop.ap_id = apflora.ap.id
WHERE
  apflora.pop.lv95_x IS NOT NULL
  AND apflora.pop.lv95_y IS NOT NULL
  AND apflora.pop.id NOT IN (
    SELECT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
      INNER JOIN apflora.pop ON apflora.pop.id = apflora.tpop.pop_id
    WHERE
      apflora.tpop.lv95_x = apflora.pop.lv95_x
      AND apflora.tpop.lv95_y = apflora.pop.lv95_y)
ORDER BY
  apflora.ap.proj_id,
  apflora.pop.ap_id,
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_statusansaatversuchmitaktuellentpop CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_pop_statusansaatversuchmitaktuellentpop AS SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.pop.ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.ap
  INNER JOIN apflora.pop ON apflora.pop.ap_id = apflora.ap.id
WHERE
  apflora.pop.status = 201
  AND apflora.pop.id IN ( SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.status IN (100, 101, 200))
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_statusansaatversuchalletpoperloschen CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_pop_statusansaatversuchalletpoperloschen AS SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.pop.ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.ap
  INNER JOIN apflora.pop
  INNER JOIN apflora.tpop ON apflora.tpop.pop_id = apflora.pop.id ON apflora.pop.ap_id = apflora.ap.id
WHERE
  apflora.pop.status = 201
  AND EXISTS (
    SELECT
      1
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.status IN (101, 202)
      AND apflora.tpop.pop_id = apflora.pop.id)
  AND NOT EXISTS (
    SELECT
      1
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.status NOT IN (101, 202)
      AND apflora.tpop.pop_id = apflora.pop.id)
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_statusansaatversuchmittpopursprerloschen CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_pop_statusansaatversuchmittpopursprerloschen AS SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.pop.ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.ap
  INNER JOIN apflora.pop ON apflora.pop.ap_id = apflora.ap.id
WHERE
  apflora.pop.status = 201
  AND apflora.pop.id IN ( SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.status = 101)
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_statuserloschenmittpopaktuell CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_pop_statuserloschenmittpopaktuell AS SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.pop.ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.ap
  INNER JOIN apflora.pop ON apflora.pop.ap_id = apflora.ap.id
WHERE
  apflora.pop.status IN (101, 202)
  AND apflora.pop.id IN ( SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.status IN (100, 200))
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_statuserloschenmittpopansaatversuch CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_pop_statuserloschenmittpopansaatversuch AS SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.pop.ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.ap
  INNER JOIN apflora.pop ON apflora.pop.ap_id = apflora.ap.id
WHERE
  apflora.pop.status IN (101, 202)
  AND apflora.pop.id IN ( SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.status = 201)
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_statusangesiedeltmittpopurspruenglich CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_pop_statusangesiedeltmittpopurspruenglich AS SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.pop.ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.ap
  INNER JOIN apflora.pop ON apflora.pop.ap_id = apflora.ap.id
WHERE
  apflora.pop.status IN (200, 201, 202)
  AND apflora.pop.id IN ( SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.status = 100)
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_tpop_mitstatusansaatversuchundzaehlungmitanzahl CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_tpop_mitstatusansaatversuchundzaehlungmitanzahl AS SELECT DISTINCT
  apflora.projekt.id AS proj_id,
  apflora.pop.ap_id,
  apflora.pop.id AS pop_id,
  apflora.pop.nr AS pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.projekt
  INNER JOIN apflora.ap
  INNER JOIN apflora.pop
  INNER JOIN apflora.tpop ON apflora.tpop.pop_id = apflora.pop.id ON apflora.pop.ap_id = apflora.ap.id ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.tpop.status = 201
  AND apflora.tpop.status_unklar = FALSE
  AND apflora.tpop.id IN ( SELECT DISTINCT
      apflora.tpopkontr.tpop_id
    FROM
      apflora.tpopkontr
      INNER JOIN apflora.tpopkontrzaehl ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id
    WHERE
      apflora.tpopkontr.typ NOT IN ('Zwischenziel', 'Ziel')
      AND apflora.tpopkontrzaehl.anzahl > 0)
ORDER BY
  apflora.pop.id,
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_q_tpop_mitstatuspotentiellundzaehlungmitanzahl CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_tpop_mitstatuspotentiellundzaehlungmitanzahl AS SELECT DISTINCT
  apflora.projekt.id AS proj_id,
  apflora.pop.ap_id,
  apflora.pop.id AS pop_id,
  apflora.pop.nr AS pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.projekt
  INNER JOIN apflora.ap
  INNER JOIN apflora.pop
  INNER JOIN apflora.tpop ON apflora.tpop.pop_id = apflora.pop.id ON apflora.pop.ap_id = apflora.ap.id ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.tpop.status = 300
  AND apflora.tpop.status_unklar = FALSE
  AND apflora.tpop.id IN ( SELECT DISTINCT
      apflora.tpopkontr.tpop_id
    FROM
      apflora.tpopkontr
      INNER JOIN apflora.tpopkontrzaehl ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id
    WHERE
      apflora.tpopkontr.typ NOT IN ('Zwischenziel', 'Ziel')
      AND apflora.tpopkontrzaehl.anzahl > 0)
ORDER BY
  apflora.pop.id,
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_q_tpop_mitstatuspotentiellundmassnansiedlung CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_tpop_mitstatuspotentiellundmassnansiedlung AS SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.pop.ap_id,
  apflora.pop.id AS pop_id,
  apflora.pop.nr AS pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.ap
  INNER JOIN apflora.pop
  INNER JOIN apflora.tpop ON apflora.tpop.pop_id = apflora.pop.id ON apflora.pop.ap_id = apflora.ap.id
WHERE
  apflora.tpop.status = 300
  AND apflora.tpop.id IN ( SELECT DISTINCT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.typ < 4)
ORDER BY
  apflora.pop.nr,
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_q_tpop_statuserloschenletzterpopberaktuell CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_tpop_statuserloschenletzterpopberaktuell AS
with tpop_letzterpopber AS (
  SELECT DISTINCT ON (tpop_id)
    tpop_id,
    jahr AS tpopber_jahr
  FROM
    apflora.tpopber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    tpop_id,
    jahr DESC
)
SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.pop.ap_id,
  apflora.pop.id AS pop_id,
  apflora.pop.nr AS pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.ap
  INNER JOIN apflora.pop
  INNER JOIN apflora.tpop
  INNER JOIN apflora.tpopber
  INNER JOIN tpop_letzterpopber ON (tpop_letzterpopber.tpopber_jahr = apflora.tpopber.jahr)
    AND (tpop_letzterpopber.tpop_id = apflora.tpopber.tpop_id) ON apflora.tpopber.tpop_id = apflora.tpop.id ON apflora.tpop.pop_id = apflora.pop.id ON apflora.pop.ap_id = apflora.ap.id
WHERE
  apflora.tpopber.entwicklung < 8
  AND apflora.tpop.status IN (101, 202)
  AND apflora.tpop.id NOT IN (
    -- Ansiedlungen since apflora.tpopber.jahr
    SELECT
      apflora.tpopmassn.tpop_id FROM apflora.tpopmassn
      WHERE
        apflora.tpopmassn.tpop_id = apflora.tpop.id
        AND apflora.tpopmassn.typ BETWEEN 1 AND 3
        AND apflora.tpopmassn.jahr IS NOT NULL
        AND apflora.tpopmassn.jahr > apflora.tpopber.jahr);

DROP VIEW IF EXISTS apflora.v_q_pop_statuserloschenletzterpopberaktuell CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_pop_statuserloschenletzterpopberaktuell AS
with letzter_popber AS (
  SELECT DISTINCT ON (pop_id)
    pop_id,
    jahr
  FROM
    apflora.popber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    pop_id,
    jahr DESC
)
SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.pop.ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.ap
  INNER JOIN apflora.pop
  INNER JOIN apflora.popber
  INNER JOIN letzter_popber ON (letzter_popber.jahr = apflora.popber.jahr)
    AND (letzter_popber.pop_id = apflora.popber.pop_id) ON apflora.popber.pop_id = apflora.pop.id
  INNER JOIN apflora.tpop ON apflora.tpop.pop_id = apflora.pop.id ON apflora.pop.ap_id = apflora.ap.id
WHERE
  apflora.popber.entwicklung < 8
  AND apflora.pop.status IN (101, 202)
  AND apflora.tpop.apber_relevant = TRUE
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_tpop_erloschenundrelevantaberletztebeobvor1950 CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_tpop_erloschenundrelevantaberletztebeobvor1950 AS
with tpop_max_beobjahr AS (
  SELECT
    tpop_id AS id,
    max(date_part('year', datum)) AS jahr
  FROM
    apflora.beob
  WHERE
    datum IS NOT NULL
    AND tpop_id IS NOT NULL
  GROUP BY
    tpop_id
)
SELECT
  apflora.ap.proj_id,
  apflora.ap.id AS ap_id,
  apflora.pop.id AS pop_id,
  apflora.pop.nr AS pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.ap
  INNER JOIN apflora.pop
  INNER JOIN apflora.tpop ON apflora.pop.id = apflora.tpop.pop_id ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.tpop.status IN (101, 202)
  AND apflora.tpop.apber_relevant = TRUE
  AND apflora.tpop.id NOT IN ( SELECT DISTINCT
      apflora.tpopkontr.tpop_id
    FROM
      apflora.tpopkontr
      INNER JOIN apflora.tpopkontrzaehl ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id
    WHERE
      apflora.tpopkontr.typ NOT IN ('zwischenziel', 'ziel')
      AND apflora.tpopkontrzaehl.anzahl > 0)
  AND apflora.tpop.id IN (
    SELECT
      apflora.beob.tpop_id
    FROM
      apflora.beob
      INNER JOIN tpop_max_beobjahr ON apflora.beob.tpop_id = tpop_max_beobjahr.id
    WHERE
      tpop_max_beobjahr.jahr < 1950)
ORDER BY
  apflora.pop.nr,
  apflora.tpop.nr;

-- new views beginning 2017.10.04
DROP VIEW IF EXISTS apflora.v_q_pop_mit_ber_zunehmend_ohne_tpopber_zunehmend CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_pop_mit_ber_zunehmend_ohne_tpopber_zunehmend AS SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.ap.id AS ap_id,
  apflora.pop.id,
  apflora.pop.nr,
  apflora.popber.jahr AS berichtjahr
FROM
  apflora.ap
  INNER JOIN apflora.pop
  INNER JOIN apflora.popber ON apflora.pop.id = apflora.popber.pop_id ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.popber.entwicklung = 3
  AND apflora.popber.pop_id NOT IN ( SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
      INNER JOIN apflora.tpopber ON apflora.tpop.id = apflora.tpopber.tpop_id
    WHERE
      apflora.tpopber.entwicklung = 3
      AND apflora.tpopber.jahr = apflora.popber.jahr)
ORDER BY
  apflora.ap.proj_id,
  apflora.ap.id,
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_mit_ber_abnehmend_ohne_tpopber_abnehmend CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_pop_mit_ber_abnehmend_ohne_tpopber_abnehmend AS SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.ap.id AS ap_id,
  apflora.pop.id,
  apflora.pop.nr,
  apflora.popber.jahr AS berichtjahr
FROM
  apflora.ap
  INNER JOIN apflora.pop
  INNER JOIN apflora.popber ON apflora.pop.id = apflora.popber.pop_id ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.popber.entwicklung = 1
  AND apflora.popber.pop_id NOT IN ( SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
      INNER JOIN apflora.tpopber ON apflora.tpop.id = apflora.tpopber.tpop_id
    WHERE
      apflora.tpopber.entwicklung = 1
      AND apflora.tpopber.jahr = apflora.popber.jahr)
ORDER BY
  apflora.ap.proj_id,
  apflora.ap.id,
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_mit_ber_erloschen_ohne_tpopber_erloschen CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_pop_mit_ber_erloschen_ohne_tpopber_erloschen AS SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.ap.id AS ap_id,
  apflora.pop.id,
  apflora.pop.nr,
  apflora.popber.jahr AS berichtjahr
FROM
  apflora.ap
  INNER JOIN apflora.pop
  INNER JOIN apflora.popber ON apflora.pop.id = apflora.popber.pop_id ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.popber.entwicklung = 8
  AND apflora.popber.pop_id NOT IN ( SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
      INNER JOIN apflora.tpopber ON apflora.tpop.id = apflora.tpopber.tpop_id
    WHERE
      apflora.tpopber.entwicklung = 8
      AND apflora.tpopber.jahr = apflora.popber.jahr)
ORDER BY
  apflora.ap.proj_id,
  apflora.ap.id,
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_mit_ber_erloschen_und_tpopber_nicht_erloschen CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_pop_mit_ber_erloschen_und_tpopber_nicht_erloschen AS SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.ap.id AS ap_id,
  apflora.pop.id,
  apflora.pop.nr,
  apflora.popber.jahr AS berichtjahr
FROM
  apflora.ap
  INNER JOIN apflora.pop
  INNER JOIN apflora.popber ON apflora.pop.id = apflora.popber.pop_id ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.popber.entwicklung = 8
  AND apflora.popber.pop_id IN ( SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
      INNER JOIN apflora.tpopber ON apflora.tpop.id = apflora.tpopber.tpop_id
    WHERE
      apflora.tpopber.entwicklung < 8
      AND apflora.tpopber.jahr = apflora.popber.jahr)
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
  apflora.projekt.id AS proj_id,
  apflora.ap.id AS ap_id,
  apflora.pop.id AS pop_id,
  apflora.pop.nr AS pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.projekt
  INNER JOIN apflora.ap
  INNER JOIN apflora.pop
  INNER JOIN apflora.tpop
  INNER JOIN lasttpopber ON apflora.tpop.id = lasttpopber.tpop_id ON apflora.pop.id = apflora.tpop.pop_id ON apflora.ap.id = apflora.pop.ap_id ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.tpop.status IN (100, 200, 201, 300)
  AND lasttpopber.entwicklung = 8
  AND apflora.tpop.id NOT IN (
    -- Ansiedlungen since apflora.tpopber.jahr
    SELECT
      apflora.tpopmassn.tpop_id FROM apflora.tpopmassn
      WHERE
        apflora.tpopmassn.tpop_id = apflora.tpop.id
        AND apflora.tpopmassn.typ BETWEEN 1 AND 3
        AND apflora.tpopmassn.jahr IS NOT NULL
        AND apflora.tpopmassn.jahr >= lasttpopber.jahr)
ORDER BY
  apflora.pop.nr,
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_urspruenglich_wiederauferstanden CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_pop_urspruenglich_wiederauferstanden AS
with pop_id_ansiedlung_jahre AS (
  SELECT DISTINCT
    tpop.pop_id AS id,
    massn.jahr
  FROM
    apflora.tpop tpop
    INNER JOIN apflora.tpopmassn massn
    INNER JOIN apflora.tpopmassn_typ_werte massntyp ON massn.typ = massntyp.code ON tpop.id = massn.tpop_id
  WHERE
    massntyp.ansiedlung = TRUE
  ORDER BY
    tpop.pop_id,
    massn.jahr
)
SELECT
  projekt.id AS proj_id,
  tax.artname,
  ap.id AS ap_id,
  pop.id,
  pop.nr,
  pop_id_ansiedlung_jahre.jahr
FROM
  apflora.pop pop
  INNER JOIN pop_id_ansiedlung_jahre
  INNER JOIN apflora.pop_history pop_history ON pop_id_ansiedlung_jahre.id = pop_history.id
    AND pop_history.year = pop_id_ansiedlung_jahre.jahr - 1 ON pop.id = pop_id_ansiedlung_jahre.id
  INNER JOIN apflora.ap ap
  INNER JOIN apflora.projekt projekt ON projekt.id = ap.proj_id
  INNER JOIN apflora.ae_taxonomies tax ON ap.art_id = tax.id ON ap.id = pop.ap_id
WHERE
  pop.status = 101
  AND pop_history.status IN (100, 200, 201);

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
  apflora.projekt.id AS proj_id,
  apflora.ap.id AS ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.projekt
  INNER JOIN apflora.ap
  INNER JOIN apflora.pop
  INNER JOIN lastpopber ON apflora.pop.id = lastpopber.pop_id ON apflora.ap.id = apflora.pop.ap_id ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.pop.status IN (100, 200, 201, 300)
  AND lastpopber.entwicklung = 8
  AND apflora.pop.id NOT IN (
    -- Ansiedlungen since lastpopber.jahr
    SELECT DISTINCT
      apflora.tpop.pop_id FROM apflora.tpop
      INNER JOIN apflora.tpopmassn ON apflora.tpop.id = apflora.tpopmassn.tpop_id
      WHERE
        apflora.tpopmassn.typ BETWEEN 1 AND 3
        AND apflora.tpopmassn.jahr >= lastpopber.jahr)
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
  apflora.projekt.id AS proj_id,
  apflora.ap.id AS ap_id,
  apflora.pop.id AS pop_id,
  apflora.pop.nr AS pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.projekt
  INNER JOIN apflora.ap
  INNER JOIN apflora.pop
  INNER JOIN apflora.tpop
  INNER JOIN lasttpopber ON apflora.tpop.id = lasttpopber.tpop_id ON apflora.pop.id = apflora.tpop.pop_id ON apflora.ap.id = apflora.pop.ap_id ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.tpop.status IN (101, 201, 202, 300)
  AND lasttpopber.entwicklung = 3
  AND apflora.tpop.id NOT IN (
    -- Ansiedlungen since apflora.tpopber.jahr
    SELECT
      apflora.tpopmassn.tpop_id FROM apflora.tpopmassn
      WHERE
        apflora.tpopmassn.tpop_id = apflora.tpop.id
        AND apflora.tpopmassn.typ BETWEEN 1 AND 3
        AND apflora.tpopmassn.jahr IS NOT NULL
        AND apflora.tpopmassn.jahr >= lasttpopber.jahr)
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
  apflora.projekt.id AS proj_id,
  apflora.ap.id AS ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.projekt
  INNER JOIN apflora.ap
  INNER JOIN apflora.pop
  INNER JOIN lastpopber ON apflora.pop.id = lastpopber.pop_id ON apflora.ap.id = apflora.pop.ap_id ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.pop.status IN (101, 201, 202, 300)
  AND lastpopber.entwicklung = 3
  AND apflora.pop.id NOT IN (
    -- Ansiedlungen since lastpopber.jahr
    SELECT DISTINCT
      apflora.tpop.pop_id FROM apflora.tpop
      INNER JOIN apflora.tpopmassn ON apflora.tpop.id = apflora.tpopmassn.tpop_id
      WHERE
        apflora.tpopmassn.typ BETWEEN 1 AND 3
        AND apflora.tpopmassn.jahr >= lastpopber.jahr)
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
  apflora.projekt.id AS proj_id,
  apflora.ap.id AS ap_id,
  apflora.pop.id AS pop_id,
  apflora.pop.nr AS pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.projekt
  INNER JOIN apflora.ap
  INNER JOIN apflora.pop
  INNER JOIN apflora.tpop
  INNER JOIN lasttpopber ON apflora.tpop.id = lasttpopber.tpop_id ON apflora.pop.id = apflora.tpop.pop_id ON apflora.ap.id = apflora.pop.ap_id ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.tpop.status IN (101, 201, 202, 300)
  AND lasttpopber.entwicklung = 2
  AND apflora.tpop.id NOT IN (
    -- Ansiedlungen since apflora.tpopber.jahr
    SELECT
      apflora.tpopmassn.tpop_id FROM apflora.tpopmassn
      WHERE
        apflora.tpopmassn.tpop_id = apflora.tpop.id
        AND apflora.tpopmassn.typ BETWEEN 1 AND 3
        AND apflora.tpopmassn.jahr IS NOT NULL
        AND apflora.tpopmassn.jahr >= lasttpopber.jahr)
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
  apflora.projekt.id AS proj_id,
  apflora.ap.id AS ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.projekt
  INNER JOIN apflora.ap
  INNER JOIN apflora.pop
  INNER JOIN lastpopber ON apflora.pop.id = lastpopber.pop_id ON apflora.ap.id = apflora.pop.ap_id ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.pop.status IN (101, 201, 202, 300)
  AND lastpopber.entwicklung = 2
  AND apflora.pop.id NOT IN (
    -- Ansiedlungen since lastpopber.jahr
    SELECT DISTINCT
      apflora.tpop.pop_id FROM apflora.tpop
      INNER JOIN apflora.tpopmassn ON apflora.tpop.id = apflora.tpopmassn.tpop_id
      WHERE
        apflora.tpopmassn.typ BETWEEN 1 AND 3
        AND apflora.tpopmassn.jahr >= lastpopber.jahr)
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
  apflora.projekt.id AS proj_id,
  apflora.ap.id AS ap_id,
  apflora.pop.id AS pop_id,
  apflora.pop.nr AS pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.projekt
  INNER JOIN apflora.ap
  INNER JOIN apflora.pop
  INNER JOIN apflora.tpop
  INNER JOIN lasttpopber ON apflora.tpop.id = lasttpopber.tpop_id ON apflora.pop.id = apflora.tpop.pop_id ON apflora.ap.id = apflora.pop.ap_id ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.tpop.status IN (101, 201, 202, 300)
  AND lasttpopber.entwicklung = 1
  AND apflora.tpop.id NOT IN (
    -- Ansiedlungen since apflora.tpopber.jahr
    SELECT
      apflora.tpopmassn.tpop_id FROM apflora.tpopmassn
      WHERE
        apflora.tpopmassn.tpop_id = apflora.tpop.id
        AND apflora.tpopmassn.typ BETWEEN 1 AND 3
        AND apflora.tpopmassn.jahr IS NOT NULL
        AND apflora.tpopmassn.jahr >= lasttpopber.jahr)
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
  apflora.projekt.id AS proj_id,
  apflora.ap.id AS ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.projekt
  INNER JOIN apflora.ap
  INNER JOIN apflora.pop
  INNER JOIN lastpopber ON apflora.pop.id = lastpopber.pop_id ON apflora.ap.id = apflora.pop.ap_id ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.pop.status IN (101, 201, 202, 300)
  AND lastpopber.entwicklung = 1
  AND apflora.pop.id NOT IN (
    -- Ansiedlungen since lastpopber.jahr
    SELECT DISTINCT
      apflora.tpop.pop_id FROM apflora.tpop
      INNER JOIN apflora.tpopmassn ON apflora.tpop.id = apflora.tpopmassn.tpop_id
      WHERE
        apflora.tpopmassn.typ BETWEEN 1 AND 3
        AND apflora.tpopmassn.jahr >= lastpopber.jahr)
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
  apflora.projekt.id AS proj_id,
  apflora.ap.id AS ap_id,
  apflora.pop.id AS pop_id,
  apflora.pop.nr AS pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.projekt
  INNER JOIN apflora.ap
  INNER JOIN apflora.pop
  INNER JOIN apflora.tpop
  INNER JOIN lasttpopber ON apflora.tpop.id = lasttpopber.tpop_id ON apflora.pop.id = apflora.tpop.pop_id ON apflora.ap.id = apflora.pop.ap_id ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.tpop.status IN (101, 202, 300)
  AND lasttpopber.entwicklung = 4
  AND apflora.tpop.id NOT IN (
    -- Ansiedlungen since jahr
    SELECT
      apflora.tpopmassn.tpop_id FROM apflora.tpopmassn
      WHERE
        apflora.tpopmassn.tpop_id = apflora.tpop.id
        AND apflora.tpopmassn.typ BETWEEN 1 AND 3
        AND apflora.tpopmassn.jahr IS NOT NULL
        AND apflora.tpopmassn.jahr >= lasttpopber.jahr)
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
  apflora.projekt.id AS proj_id,
  apflora.ap.id AS ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.projekt
  INNER JOIN apflora.ap
  INNER JOIN apflora.pop
  INNER JOIN lastpopber ON apflora.pop.id = lastpopber.pop_id ON apflora.ap.id = apflora.pop.ap_id ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.pop.status IN (101, 202, 300)
  AND lastpopber.entwicklung = 4
  AND apflora.pop.id NOT IN (
    -- Ansiedlungen since lastpopber.jahr
    SELECT DISTINCT
      apflora.tpop.pop_id FROM apflora.tpop
      INNER JOIN apflora.tpopmassn ON apflora.tpop.id = apflora.tpopmassn.tpop_id
      WHERE
        apflora.tpopmassn.typ BETWEEN 1 AND 3
        AND apflora.tpopmassn.jahr >= lastpopber.jahr)
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_ohnetpopmitgleichemstatus CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_pop_ohnetpopmitgleichemstatus AS
SELECT
  apflora.projekt.id AS proj_id,
  apflora.ap.id AS ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.projekt
  INNER JOIN apflora.ap
  INNER JOIN apflora.pop ON apflora.ap.id = apflora.pop.ap_id ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.pop.id NOT IN ( SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.pop_id = apflora.pop.id
      AND apflora.tpop.status = apflora.pop.status)
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_status300tpopstatusanders CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_pop_status300tpopstatusanders AS
SELECT
  apflora.projekt.id AS proj_id,
  apflora.ap.id AS ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.projekt
  INNER JOIN apflora.ap
  INNER JOIN apflora.pop ON apflora.ap.id = apflora.pop.ap_id ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.pop.status = 300
  AND apflora.pop.id IN ( SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.pop_id = apflora.pop.id
      AND apflora.tpop.status <> 300)
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_status201tpopstatusunzulaessig CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_pop_status201tpopstatusunzulaessig AS
SELECT
  apflora.projekt.id AS proj_id,
  apflora.ap.id AS ap_id,
  apflora.pop.nr,
  apflora.pop.id
FROM
  apflora.projekt
  INNER JOIN apflora.ap
  INNER JOIN apflora.pop ON apflora.ap.id = apflora.pop.ap_id ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.pop.status = 201
  AND apflora.pop.id IN ( SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.pop_id = apflora.pop.id
      AND apflora.tpop.status IN (100, 101, 200))
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_status202tpopstatusanders CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_pop_status202tpopstatusanders AS
SELECT
  apflora.projekt.id AS proj_id,
  apflora.ap.id AS ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.projekt
  INNER JOIN apflora.ap
  INNER JOIN apflora.pop ON apflora.ap.id = apflora.pop.ap_id ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.pop.status = 202
  AND apflora.pop.id IN ( SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.pop_id = apflora.pop.id
      AND apflora.tpop.status <> 202)
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_status211tpopstatusunzulaessig CASCADE;

DROP VIEW IF EXISTS apflora.v_q_pop_status200tpopstatusunzulaessig CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_pop_status200tpopstatusunzulaessig AS
SELECT
  apflora.projekt.id AS proj_id,
  apflora.ap.id AS ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.projekt
  INNER JOIN apflora.ap
  INNER JOIN apflora.pop ON apflora.ap.id = apflora.pop.ap_id ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.pop.status = 200
  AND apflora.pop.id IN ( SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.pop_id = apflora.pop.id
      AND apflora.tpop.status IN (100, 101))
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_status210tpopstatusunzulaessig CASCADE;

DROP VIEW IF EXISTS apflora.v_q_pop_status101tpopstatusanders CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_pop_status101tpopstatusanders AS
SELECT
  apflora.projekt.id AS proj_id,
  apflora.ap.id AS ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.projekt
  INNER JOIN apflora.ap
  INNER JOIN apflora.pop ON apflora.ap.id = apflora.pop.ap_id ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.pop.status = 101
  AND apflora.pop.id IN ( SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.pop_id = apflora.pop.id
      AND apflora.tpop.status NOT IN (101, 300))
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
  apflora.projekt.id AS proj_id,
  apflora.ap.id AS ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.projekt
  INNER JOIN apflora.ap
  INNER JOIN apflora.pop
  INNER JOIN lastpopber ON apflora.pop.id = lastpopber.pop_id ON apflora.ap.id = apflora.pop.ap_id ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.pop.status IN (101, 202)
  AND lastpopber.entwicklung = 8
  AND apflora.pop.id IN (
    -- Ansiedlungen since lastpopber.jahr
    SELECT DISTINCT
      apflora.tpop.pop_id FROM apflora.tpop
      INNER JOIN apflora.tpopmassn ON apflora.tpop.id = apflora.tpopmassn.tpop_id
      WHERE
        apflora.tpopmassn.typ BETWEEN 1 AND 3
        AND apflora.tpopmassn.jahr > lastpopber.jahr)
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
  apflora.projekt.id AS proj_id,
  apflora.ap.id AS ap_id,
  apflora.pop.id AS pop_id,
  apflora.pop.nr AS pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.projekt
  INNER JOIN apflora.ap
  INNER JOIN apflora.pop
  INNER JOIN apflora.tpop
  INNER JOIN lasttpopber ON apflora.tpop.id = lasttpopber.tpop_id ON apflora.pop.id = apflora.tpop.pop_id ON apflora.ap.id = apflora.pop.ap_id ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.tpop.status IN (101, 202)
  AND lasttpopber.entwicklung = 8
  AND apflora.tpop.id IN (
    -- Ansiedlungen since apflora.tpopber.jahr
    SELECT
      apflora.tpopmassn.tpop_id FROM apflora.tpopmassn
      WHERE
        apflora.tpopmassn.tpop_id = apflora.tpop.id
        AND apflora.tpopmassn.typ BETWEEN 1 AND 3
        AND apflora.tpopmassn.jahr IS NOT NULL
        AND apflora.tpopmassn.jahr > lasttpopber.jahr)
ORDER BY
  apflora.pop.nr,
  apflora.tpop.nr;

-- need this because filtering on apart
-- in graphql overwhelms the server
CREATE OR REPLACE VIEW apflora.v_apbeob AS
SELECT
  beob.id,
  beob.quelle,
  beob.id_field,
  beob.art_id,
  beob.datum,
  beob.autor,
  beob.geom_point,
  beob.data,
  beob.tpop_id,
  beob.nicht_zuordnen,
  beob.infoflora_informiert_datum,
  beob.bemerkungen,
  beob.changed_by,
  beob.wgs84_lat,
  beob.wgs84_long,
  apflora.apart.ap_id,
  concat(to_char(beob.datum, 'YYYY.MM.DD'), ': ', coalesce(beob.autor, '(kein Autor)'), ' (', beob.quelle, ')') AS label
FROM
  apflora.beob beob
  INNER JOIN apflora.apart ON apflora.apart.art_id = beob.art_id
ORDER BY
  beob.datum DESC,
  beob.autor ASC,
  beob.quelle ASC;

-- used in exports
-- use https://github.com/hnsl/colpivot instead?
DROP VIEW IF EXISTS apflora.v_tpop_last_count CASCADE;

CREATE OR REPLACE VIEW apflora.v_tpop_last_count AS
SELECT
  tax.artname,
  ap.id AS ap_id,
  pop.id AS pop_id,
  pop.nr AS pop_nr,
  pop.name AS pop_name,
  psw.text AS pop_status,
  tpop.nr AS tpop_nr,
  tpop.gemeinde AS tpop_gemeinde,
  tpop.flurname AS tpop_flurname,
  tpsw.text AS tpop_status,
  (
    SELECT
      kontr4.jahr
    FROM
      apflora.tpopkontrzaehl zaehl3
      INNER JOIN apflora.tpopkontr kontr4
      INNER JOIN apflora.tpop tpop3 ON tpop3.id = kontr4.tpop_id ON zaehl3.tpopkontr_id = kontr4.id
    WHERE
      tpop3.apber_relevant IS TRUE
      AND kontr4.jahr IS NOT NULL
      AND zaehl3.anzahl IS NOT NULL
      AND kontr4.tpop_id = tpop.id
      AND kontr4.apber_nicht_relevant IS NOT TRUE
    ORDER BY
      kontr4.jahr DESC,
      kontr4.datum DESC
    LIMIT 1) AS jahr,
anzahl.*
FROM
  crosstab ($$
    SELECT
      tpop_id, zaehleinheit, anzahl FROM ( SELECT DISTINCT ON (tpop2.id, apflora.tpopkontrzaehl_einheit_werte.text)
  tpop2.id AS tpop_id, apflora.tpopkontrzaehl_einheit_werte.text AS zaehleinheit, zaehl2.anzahl FROM apflora.tpopkontrzaehl zaehl2
  INNER JOIN apflora.tpopkontrzaehl_einheit_werte ON apflora.tpopkontrzaehl_einheit_werte.code = zaehl2.einheit
  INNER JOIN apflora.tpopkontr kontr2
  INNER JOIN apflora.tpop tpop2 ON tpop2.id = kontr2.tpop_id ON zaehl2.tpopkontr_id = kontr2.id
  WHERE
    tpop2.apber_relevant IS TRUE
    -- nur Kontrollen mit Jahr berücksichtigen
    AND kontr2.jahr IS NOT NULL
    AND kontr2.apber_nicht_relevant IS NOT TRUE
    -- nur Zählungen mit Anzahl berücksichtigen
    AND zaehl2.anzahl IS NOT NULL
    AND kontr2.id = (
      SELECT
        kontr3.id
      FROM apflora.tpopkontrzaehl zaehl3
      INNER JOIN apflora.tpopkontr kontr3
      INNER JOIN apflora.tpop tpop3 ON tpop3.id = kontr3.tpop_id ON zaehl3.tpopkontr_id = kontr3.id
      WHERE
        tpop3.apber_relevant IS TRUE
        AND kontr3.jahr IS NOT NULL
        AND zaehl3.anzahl IS NOT NULL
        AND kontr3.tpop_id = tpop2.id
        AND kontr3.apber_nicht_relevant IS NOT TRUE ORDER BY kontr3.jahr DESC, kontr3.datum DESC LIMIT 1)
ORDER BY tpop2.id, apflora.tpopkontrzaehl_einheit_werte.text, kontr2.jahr DESC, kontr2.datum DESC) AS tbl ORDER BY 1, 2, 3 $$, $$
  SELECT
    unnest('{Pflanzen total, Pflanzen (ohne Jungpflanzen), Triebe total, Triebe Beweidung, Keimlinge, davon Rosetten, Jungpflanzen, Blätter, davon blühende Pflanzen, davon blühende Triebe, Blüten, Fertile Pflanzen, fruchtende Triebe, Blütenstände, Fruchtstände, Gruppen, Deckung (%), Pflanzen/5m2, Triebe in 30 m2, Triebe/50m2, Triebe Mähfläche, Fläche (m2), Pflanzstellen, Stellen, andere Zaehleinheit, Art ist vorhanden}'::text[]) $$) AS anzahl ("tpop_id" uuid,
    "Pflanzen total" integer,
    "Pflanzen (ohne Jungpflanzen)" integer,
    "Triebe total" integer,
    "Triebe Beweidung" integer,
    "Keimlinge" integer,
    "davon Rosetten" integer,
    "Jungpflanzen" integer,
    "Blätter" integer,
    "davon blühende Pflanzen" integer,
    "davon blühende Triebe" integer,
    "Blüten" integer,
    "Fertile Pflanzen" integer,
    "fruchtende Triebe" integer,
    "Blütenstände" integer,
    "Fruchtstände" integer,
    "Gruppen" integer,
    "Deckung (%)" integer,
    "Pflanzen/5m2" integer,
    "Triebe in 30 m2" integer,
    "Triebe/50m2" integer,
    "Triebe Mähfläche" integer,
    "Fläche (m2)" integer,
    "Pflanzstellen" integer,
    "Stellen" integer,
    "andere Zaehleinheit" integer,
    "Art ist vorhanden" text)
    INNER JOIN apflora.tpop tpop
    INNER JOIN apflora.pop_status_werte tpsw ON tpsw.code = tpop.status
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.pop_status_werte psw ON psw.code = pop.status
    INNER JOIN apflora.ap
    INNER JOIN apflora.ae_taxonomies tax ON ap.art_id = tax.id ON apflora.ap.id = pop.ap_id ON pop.id = tpop.pop_id ON tpop.id = anzahl.tpop_id
  ORDER BY
    tax.artname,
    pop.nr,
    tpop.nr;

COMMENT ON VIEW apflora.v_tpop_last_count IS '@foreignKey (tpop_id) references tpop (id)';

-- used by: v_pop_last_count_with_massn
-- also used in export
-- use https://github.com/hnsl/colpivot instead?
DROP VIEW IF EXISTS apflora.v_tpop_last_count_with_massn CASCADE;

CREATE OR REPLACE VIEW apflora.v_tpop_last_count_with_massn AS
SELECT
  tax.artname,
  ap.id AS ap_id,
  pop.nr AS pop_nr,
  pop.name AS pop_name,
  pop.id AS pop_id,
  psw.text AS pop_status,
  tpop.nr AS tpop_nr,
  tpop.gemeinde AS tpop_gemeinde,
  tpop.flurname AS tpop_flurname,
  tpsw.text AS tpop_status,
  anzahl.*
FROM
  crosstab ($$
    SELECT
      tpop_id, jahr, zaehleinheit, anzahl FROM ( WITH letzte_kontrollen AS ( SELECT DISTINCT ON (tpop5.id, apflora.tpopkontrzaehl_einheit_werte.text)
  tpop5.id AS tpop_id, kontr5.jahr, kontr5.datum, apflora.tpopkontrzaehl_einheit_werte.text AS zaehleinheit, zaehl5.anzahl FROM apflora.tpopkontrzaehl zaehl5
  INNER JOIN apflora.tpopkontrzaehl_einheit_werte ON apflora.tpopkontrzaehl_einheit_werte.code = zaehl5.einheit
  INNER JOIN apflora.tpopkontr kontr5
  INNER JOIN apflora.tpop tpop5 ON tpop5.id = kontr5.tpop_id ON zaehl5.tpopkontr_id = kontr5.id
    WHERE
      tpop5.apber_relevant IS TRUE
      -- nur Kontrollen mit Jahr berücksichtigen
      AND kontr5.jahr IS NOT NULL
      AND kontr5.apber_nicht_relevant IS NOT TRUE
      -- nur Zählungen mit Anzahl berücksichtigen
      AND zaehl5.anzahl IS NOT NULL
      -- letzte zu berücksichtigende Kontrolle dieser tpop
      AND kontr5.id = (
        SELECT
          kontr6.id
        FROM apflora.tpopkontrzaehl zaehl6
        INNER JOIN apflora.tpopkontr kontr6
        INNER JOIN apflora.tpop tpop6 ON tpop6.id = kontr6.tpop_id ON zaehl6.tpopkontr_id = kontr6.id
        WHERE
          -- nur Berichts-relevante tpop
          tpop6.apber_relevant IS TRUE
          -- nur Kontrollen mit Jahr berücksichtigen
          AND kontr6.jahr IS NOT NULL
          -- nur Berichts-relevante kontrollen
          AND kontr6.apber_nicht_relevant IS NOT TRUE
          -- nur Zählungen mit Anzahl berücksichtigen
          AND zaehl6.anzahl IS NOT NULL
          -- derselben tpop
          AND kontr6.tpop_id = tpop5.id ORDER BY
          -- nur die jüngste
          kontr6.jahr DESC, kontr6.datum DESC LIMIT 1)
ORDER BY tpop5.id, apflora.tpopkontrzaehl_einheit_werte.text, kontr5.jahr DESC, kontr5.datum DESC
), massn_triebe AS ( SELECT DISTINCT ON (tpop.id)
    tpop.id AS tpop_id, massn.jahr, 'Triebe total' AS zaehleinheit, massn.anz_triebe AS anzahl FROM apflora.tpopmassn massn
    INNER JOIN apflora.tpop tpop
    LEFT JOIN letzte_kontrollen letzte_kontrolle ON letzte_kontrolle.tpop_id = tpop.id ON tpop.id = massn.tpop_id
  WHERE
    tpop.apber_relevant IS TRUE
    AND massn.jahr IS NOT NULL
    -- nur Ansiedlungen
    AND tpop.status IN (200, 201)
    -- bei denen anz_triebe gezählt wurde
    AND massn.anz_triebe IS NOT NULL
    AND (((massn.datum IS NOT NULL
      AND letzte_kontrolle.datum IS NOT NULL
      AND massn.datum > letzte_kontrolle.datum)
    OR massn.jahr > letzte_kontrolle.jahr)
  OR letzte_kontrolle.tpop_id IS NULL)
ORDER BY tpop.id, massn.jahr DESC, massn.datum DESC
), massn_pflanzen AS ( SELECT DISTINCT ON (tpop.id)
    tpop.id AS tpop_id, massn.jahr, 'Pflanzen total' AS zaehleinheit, massn.anz_pflanzen AS anzahl FROM apflora.tpopmassn massn
    INNER JOIN apflora.tpop tpop
    LEFT JOIN letzte_kontrollen letzte_kontrolle ON letzte_kontrolle.tpop_id = tpop.id ON tpop.id = massn.tpop_id
  WHERE
    tpop.apber_relevant IS TRUE
    AND massn.jahr IS NOT NULL
    -- nur Ansiedlungen
    AND tpop.status IN (200, 201)
  -- bei denen anz_pflanzen gezählt wurde
  AND massn.anz_pflanzen IS NOT NULL
  AND (((massn.datum IS NOT NULL
    AND letzte_kontrolle.datum IS NOT NULL
    AND massn.datum > letzte_kontrolle.datum)
  OR massn.jahr > letzte_kontrolle.jahr)
  OR letzte_kontrolle.tpop_id IS NULL)
ORDER BY tpop.id, massn.jahr DESC, massn.datum DESC
), massn_pflanzstellen AS ( SELECT DISTINCT ON (tpop.id)
    tpop.id AS tpop_id, massn.jahr, 'Pflanzstellen' AS zaehleinheit, massn.anz_pflanzstellen AS anzahl FROM apflora.tpopmassn massn
    INNER JOIN apflora.tpop tpop
    LEFT JOIN letzte_kontrollen letzte_kontrolle ON letzte_kontrolle.tpop_id = tpop.id ON tpop.id = massn.tpop_id
  WHERE
    tpop.apber_relevant IS TRUE
    AND massn.jahr IS NOT NULL
    -- nur Ansiedlungen
    AND tpop.status IN (200, 201)
    -- bei denen anz_pflanzstellen gezählt wurde
    AND massn.anz_pflanzstellen IS NOT NULL
    AND (((massn.datum IS NOT NULL
      AND letzte_kontrolle.datum IS NOT NULL
      AND massn.datum > letzte_kontrolle.datum)
    OR massn.jahr > letzte_kontrolle.jahr)
  OR letzte_kontrolle.tpop_id IS NULL)
ORDER BY tpop.id, massn.jahr DESC, massn.datum DESC
), letzte_kontrolle_und_ansiedlungen AS (
  SELECT
    * FROM massn_triebe
  UNION ALL
  SELECT
    * FROM massn_pflanzen
  UNION ALL
  SELECT
    * FROM massn_pflanzstellen
    -- 3. get all einheits from tpopkontr counts
  UNION ALL
  SELECT
    tpop_id, jahr, zaehleinheit, anzahl FROM letzte_kontrollen)
  -- sum all kontr and anpflanzung
  SELECT
    tpop_id, max(jahr) AS jahr, zaehleinheit, sum(anzahl) AS anzahl FROM letzte_kontrolle_und_ansiedlungen GROUP BY tpop_id, zaehleinheit ORDER BY tpop_id, jahr, zaehleinheit) AS tbl ORDER BY 1, 2, 3 $$, $$
  SELECT
    unnest('{Pflanzen total, Pflanzen (ohne Jungpflanzen), Triebe total, Triebe Beweidung, Keimlinge, davon Rosetten, Jungpflanzen, Blätter, davon blühende Pflanzen, davon blühende Triebe, Blüten, Fertile Pflanzen, fruchtende Triebe, Blütenstände, Fruchtstände, Gruppen, Deckung (%), Pflanzen/5m2, Triebe in 30 m2, Triebe/50m2, Triebe Mähfläche, Fläche (m2), Pflanzstellen, Stellen, andere Zaehleinheit, Art ist vorhanden}'::text[]) $$) AS anzahl ("tpop_id" uuid,
    "jahr" integer,
    "Pflanzen total" integer,
    "Pflanzen (ohne Jungpflanzen)" integer,
    "Triebe total" integer,
    "Triebe Beweidung" integer,
    "Keimlinge" integer,
    "davon Rosetten" integer,
    "Jungpflanzen" integer,
    "Blätter" integer,
    "davon blühende Pflanzen" integer,
    "davon blühende Triebe" integer,
    "Blüten" integer,
    "Fertile Pflanzen" integer,
    "fruchtende Triebe" integer,
    "Blütenstände" integer,
    "Fruchtstände" integer,
    "Gruppen" integer,
    "Deckung (%)" integer,
    "Pflanzen/5m2" integer,
    "Triebe in 30 m2" integer,
    "Triebe/50m2" integer,
    "Triebe Mähfläche" integer,
    "Fläche (m2)" integer,
    "Pflanzstellen" integer,
    "Stellen" integer,
    "andere Zaehleinheit" integer,
    "Art ist vorhanden" text)
    INNER JOIN apflora.tpop tpop
    INNER JOIN apflora.pop_status_werte tpsw ON tpsw.code = tpop.status
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.pop_status_werte psw ON psw.code = pop.status
    INNER JOIN apflora.ap
    INNER JOIN apflora.ae_taxonomies tax ON ap.art_id = tax.id ON apflora.ap.id = pop.ap_id ON pop.id = tpop.pop_id ON tpop.id = anzahl.tpop_id
  WHERE
    -- keine Testarten
    tax.taxid > 150
  ORDER BY
    tax.artname,
    pop.nr,
    tpop.nr;

COMMENT ON VIEW apflora.v_tpop_last_count_with_massn IS '@foreignKey (tpop_id) references tpop (id)';

-- used in form ap
-- 2021.01.03: not in use any more
DROP VIEW IF EXISTS apflora.v_ap_ausw_pop_status CASCADE;

CREATE OR REPLACE VIEW apflora.v_ap_ausw_pop_status AS
with data AS (
  SELECT
    ap_id,
    year,
    status,
    count(*) AS anzahl
  FROM
    apflora.pop_history pop
  WHERE
    status IS NOT NULL
    AND EXISTS (
      SELECT
        1
      FROM
        apflora.tpop_history tpop
      WHERE
        tpop.apber_relevant = TRUE
        AND tpop.pop_id = pop.id
        AND tpop.year = pop.year)
    GROUP BY
      ap_id,
      year,
      status
    ORDER BY
      ap_id,
      year,
      status
)
SELECT
  ap_id,
  year AS jahr,
  json_object_agg(status, anzahl) AS
VALUES
  FROM data
GROUP BY
  ap_id,
  year
ORDER BY
  ap_id,
  year;

-- refresh materialized view apflora.v_ap_ausw_pop_menge;
-- ACHTUNG: Original dieses Views in 20222-01-21_v_ap_ausw_pop_menge_v5.sql
DROP MATERIALIZED VIEW IF EXISTS apflora.v_ap_ausw_pop_menge CASCADE;

CREATE MATERIALIZED VIEW apflora.v_ap_ausw_pop_menge AS
with massnahmen AS (
  SELECT
    tpop.id AS tpop_id,
    massn.jahr,
    CASE WHEN massn.datum IS NOT NULL THEN
      massn.datum
    ELSE
      to_date(concat(massn.jahr, '-01-01'), 'YYYY-MM-DD')
    END AS datum,
    massn.zieleinheit_anzahl AS anzahl
  FROM
    apflora.tpopmassn massn
    INNER JOIN apflora.tpopmassn_typ_werte tw ON tw.code = massn.typ
      AND tw.anpflanzung = TRUE
    INNER JOIN apflora.tpop_history tpop
    INNER JOIN apflora.pop_history pop
    INNER JOIN apflora.ap_history ap
    INNER JOIN apflora.ekzaehleinheit ekze
    INNER JOIN apflora.tpopkontrzaehl_einheit_werte ze ON ze.id = ekze.zaehleinheit_id ON ekze.ap_id = ap.id
      AND ekze.zielrelevant = TRUE ON ap.id = pop.ap_id
      AND ap.year = pop.year ON pop.id = tpop.pop_id
      AND pop.year = tpop.year ON tpop.id = massn.tpop_id
      AND tpop.year = massn.jahr
  WHERE
    massn.jahr IS NOT NULL
    AND tpop.status IN (200, 201)
    AND tpop.apber_relevant = TRUE
    AND massn.zieleinheit_einheit = ze.code
    AND massn.zieleinheit_anzahl IS NOT NULL
  ORDER BY
    tpop.id,
    massn.jahr DESC,
    massn.datum DESC
),
zaehlungen AS (
  SELECT
    tpop.id AS tpop_id,
    kontr.jahr,
    CASE WHEN kontr.datum IS NOT NULL THEN
      kontr.datum
    ELSE
      to_date(concat(kontr.jahr, '-01-01'), 'YYYY-MM-DD')
    END AS datum,
    zaehlungen.anzahl
  FROM
    apflora.tpopkontrzaehl zaehlungen
    INNER JOIN apflora.tpopkontr kontr
    INNER JOIN apflora.tpop_history tpop
    INNER JOIN apflora.pop_history pop
    INNER JOIN apflora.ap_history ap
    INNER JOIN apflora.ekzaehleinheit ekze
    INNER JOIN apflora.tpopkontrzaehl_einheit_werte ze ON ze.id = ekze.zaehleinheit_id ON ekze.ap_id = ap.id
      AND ekze.zielrelevant = TRUE ON ap.id = pop.ap_id
      AND ap.year = pop.year ON pop.id = tpop.pop_id
      AND pop.year = tpop.year ON tpop.id = kontr.tpop_id
      AND tpop.year = kontr.jahr ON zaehlungen.tpopkontr_id = kontr.id
      AND zaehlungen.einheit = ze.code
  WHERE
    kontr.jahr IS NOT NULL
    AND tpop.status IN (100, 200, 201)
    AND tpop.apber_relevant = TRUE
    AND zaehlungen.anzahl IS NOT NULL
    -- nur Zählungen mit der Ziel-Einheit
    AND ze.code = zaehlungen.einheit
  ORDER BY
    tpop.id,
    kontr.jahr DESC,
    kontr.datum DESC
),
tpop_letzte_anzahlen AS (
  SELECT
    tpop.id AS tpop_id,
    tpop.year AS jahr,
    zaehl.anzahl AS letzte_zaehlung_anzahl,
    zaehl.datum AS datum,
    massn.anzahl AS massn_anz_seither
  FROM
    apflora.tpop_history AS tpop
    LEFT JOIN zaehlungen zaehl ON zaehl.tpop_id = tpop.id
      AND zaehl.datum = (
        SELECT
          max(datum)
        FROM
          zaehlungen
      WHERE
        tpop_id = tpop.id
        AND datum <= to_date(concat(tpop.year, '-12-31'), 'YYYY-MM-DD'))
      LEFT JOIN massnahmen massn ON massn.tpop_id = tpop.id
        AND massn.datum <= to_date(concat(tpop.year, '-12-31'), 'YYYY-MM-DD')
        AND massn.datum >= coalesce(zaehl.datum, to_date(concat(tpop.year, '-01-01'), 'YYYY-MM-DD'))
      ORDER BY
        tpop.id,
        tpop.year
),
tpop_letzte_anzahl AS (
  SELECT
    tpop_id,
    jahr,
    datum,
    CASE WHEN la.tpop_id IS NULL THEN
      NULL
    WHEN la.letzte_zaehlung_anzahl IS NOT NULL
      AND la.massn_anz_seither IS NOT NULL THEN
      la.letzte_zaehlung_anzahl + la.massn_anz_seither
    WHEN la.letzte_zaehlung_anzahl IS NULL
      AND la.massn_anz_seither IS NOT NULL THEN
      la.massn_anz_seither
    WHEN la.letzte_zaehlung_anzahl IS NOT NULL
      AND la.massn_anz_seither IS NULL THEN
      la.letzte_zaehlung_anzahl
    ELSE
      NULL
    END AS anzahl
  FROM
    tpop_letzte_anzahlen la
),
pop_data AS (
  SELECT
    ap.id AS ap_id,
    pop.year AS jahr,
    pop.id AS pop_id,
    sum(anzahl) AS anzahl
FROM
  tpop_letzte_anzahl tpla
  INNER JOIN apflora.tpop_history tpop
  INNER JOIN apflora.pop_history pop
  INNER JOIN apflora.ap_history ap ON ap.id = pop.ap_id
    AND ap.year = pop.year ON pop.id = tpop.pop_id
    AND pop.year = tpop.year ON tpop.id = tpla.tpop_id
    AND tpop.year = tpla.jahr
  WHERE
    pop.status IN (100, 200, 201)
    AND tpla.anzahl IS NOT NULL
    AND pop.bekannt_seit <= pop.year
    AND tpop.bekannt_seit <= tpop.year
    AND tpop.apber_relevant = TRUE
  GROUP BY
    ap.id,
    pop.year,
    pop.id
  ORDER BY
    ap.id,
    pop.year
)
SELECT
  ap_id,
  jahr,
  json_object_agg(pop_id, anzahl) AS
VALUES
  FROM pop_data
GROUP BY
  ap_id,
  jahr
ORDER BY
  ap_id,
  jahr;

-- Achtung: Das Original dieses Views is hier: 2020-03-27_tpop_kontrolliert_pro_jahr.sql
-- used in form ap
DROP VIEW IF EXISTS apflora.v_ap_ausw_tpop_kontrolliert CASCADE;

CREATE VIEW apflora.v_ap_ausw_tpop_kontrolliert AS
with anpflanz AS (
  SELECT DISTINCT ON (tpop0.id,
    massn0.jahr)
    tpop0.id AS tpop_id,
    massn0.jahr
  FROM
    apflora.tpopmassn massn0
    INNER JOIN apflora.tpopmassn_typ_werte tw ON tw.code = massn0.typ
      AND tw.anpflanzung = TRUE
    INNER JOIN apflora.tpop_history tpop0
    INNER JOIN apflora.pop_history pop0
    INNER JOIN apflora.ap_history ap0
    INNER JOIN apflora.ekzaehleinheit ekze0
    INNER JOIN apflora.tpopkontrzaehl_einheit_werte ze0 ON ze0.id = ekze0.zaehleinheit_id ON ekze0.ap_id = ap0.id
      AND ekze0.zielrelevant = TRUE ON ap0.id = pop0.ap_id
      AND ap0.year = pop0.year ON pop0.id = tpop0.pop_id
      AND pop0.year = tpop0.year ON tpop0.id = massn0.tpop_id
      AND tpop0.year = massn0.jahr
  WHERE
    massn0.jahr IS NOT NULL
    AND tpop0.status IN (200, 201)
    AND tpop0.apber_relevant = TRUE
    AND massn0.zieleinheit_einheit = ze0.code
    AND massn0.zieleinheit_anzahl IS NOT NULL
  ORDER BY
    tpop0.id,
    massn0.jahr DESC
),
kontr AS (
  SELECT DISTINCT ON (tpop2.id,
    kontr2.jahr)
    tpop2.id AS tpop_id,
    kontr2.jahr
  FROM
    apflora.tpopkontrzaehl zaehl2
    INNER JOIN apflora.tpopkontr kontr2
    INNER JOIN apflora.tpop_history tpop2
    INNER JOIN apflora.pop_history pop2
    INNER JOIN apflora.ap_history ap2
    INNER JOIN apflora.ekzaehleinheit ekze2
    INNER JOIN apflora.tpopkontrzaehl_einheit_werte ze2 ON ze2.id = ekze2.zaehleinheit_id ON ekze2.ap_id = ap2.id
      AND ekze2.zielrelevant = TRUE ON ap2.id = pop2.ap_id
      AND ap2.year = pop2.year ON pop2.id = tpop2.pop_id
      AND pop2.year = tpop2.year ON tpop2.id = kontr2.tpop_id
      AND tpop2.year = kontr2.jahr ON zaehl2.tpopkontr_id = kontr2.id
      AND zaehl2.einheit = ze2.code
  WHERE
    -- Jahr muss existieren
    kontr2.jahr IS NOT NULL
    -- nur aktuelle Stati
    AND tpop2.status IN (100, 200, 201)
    -- nur von berichts-relevanten tpop
    AND tpop2.apber_relevant = TRUE
    -- nur wenn eine Anzahl erfasst wurde
    AND zaehl2.anzahl IS NOT NULL
    -- nur wenn die Ziel-Einheit erfasst wurde
    AND ze2.code = zaehl2.einheit
  ORDER BY
    tpop2.id,
    kontr2.jahr DESC
),
kontr_oder_anpflanz AS (
  SELECT
    *
  FROM
    kontr
  UNION
  SELECT
    *
  FROM
    anpflanz
),
tpop_data AS (
  SELECT
    ap4.id AS ap_id,
    pop4.year AS jahr,
    tpop4.id AS tpop_id,
    CASE WHEN koa.tpop_id IS NOT NULL THEN
      1
    ELSE
      0
    END AS kontrolliert
  FROM
    kontr_oder_anpflanz koa
    RIGHT JOIN apflora.tpop_history tpop4
    INNER JOIN apflora.pop_history pop4
    INNER JOIN apflora.ap_history ap4 ON ap4.id = pop4.ap_id
      AND ap4.year = pop4.year ON pop4.id = tpop4.pop_id
      AND pop4.year = tpop4.year ON tpop4.id = koa.tpop_id
      AND tpop4.year = koa.jahr
  WHERE
    pop4.status IN (100, 200, 201)
    AND tpop4.status IN (100, 200, 201)
    AND tpop4.apber_relevant = TRUE
  ORDER BY
    ap4.id,
    pop4.year
)
SELECT
  ap_id,
  jahr,
  count(tpop_id)::int AS anzahl_tpop,
  sum(kontrolliert)::int AS anzahl_kontrolliert
FROM
  tpop_data
GROUP BY
  ap_id,
  jahr
ORDER BY
  ap_id,
  jahr;

-- original was created here: 2020-04-09_qk_tpop_mit_kontr_keine_zielrelev_einheit.sql
DROP VIEW IF EXISTS apflora.v_q_ap_mit_aktuellen_kontrollen_ohne_zielrelevante_einheit CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_ap_mit_aktuellen_kontrollen_ohne_zielrelevante_einheit AS
with ap_mit_zielrelevanter_zaehleinheit AS (
  SELECT DISTINCT
    apflora.ap.id
  FROM
    apflora.ap
    INNER JOIN apflora.ekzaehleinheit ON apflora.ekzaehleinheit.ap_id = apflora.ap.id
  WHERE
    apflora.ekzaehleinheit.zielrelevant = TRUE
),
ap_ohne_zielrelevante_zaehleinheit AS (
  SELECT DISTINCT
    apflora.ap.id
  FROM
    apflora.ap
    LEFT JOIN ap_mit_zielrelevanter_zaehleinheit ON ap_mit_zielrelevanter_zaehleinheit.id = apflora.ap.id
  WHERE
    ap_mit_zielrelevanter_zaehleinheit.id IS NULL
),
tpop_mit_aktuellen_kontrollen_ohne_zielrelevante_zaehleinheit AS (
  SELECT DISTINCT
    apflora.tpop.id
  FROM
    apflora.tpop
    INNER JOIN apflora.tpopkontr ON apflora.tpop.id = apflora.tpopkontr.tpop_id
    INNER JOIN apflora.pop
    INNER JOIN ap_ohne_zielrelevante_zaehleinheit ON ap_ohne_zielrelevante_zaehleinheit.id = apflora.pop.ap_id ON apflora.pop.id = apflora.tpop.pop_id
  WHERE
    apflora.tpopkontr.jahr = date_part('year', CURRENT_DATE))
SELECT DISTINCT
  apflora.projekt.id AS proj_id,
  apflora.ap.id AS ap_id
FROM
  apflora.projekt
  INNER JOIN apflora.ap
  INNER JOIN apflora.pop
  INNER JOIN apflora.tpop
  INNER JOIN tpop_mit_aktuellen_kontrollen_ohne_zielrelevante_zaehleinheit ON tpop_mit_aktuellen_kontrollen_ohne_zielrelevante_zaehleinheit.id = apflora.tpop.id ON apflora.tpop.pop_id = apflora.pop.id ON apflora.pop.ap_id = apflora.ap.id ON apflora.projekt.id = apflora.ap.proj_id
ORDER BY
  apflora.projekt.id,
  apflora.ap.id;

-- original was created here: 2020-04-09_qk_tpop_mit_kontr_keine_zielrelev_einheit.sql
DROP VIEW IF EXISTS apflora.v_q_tpop_mit_aktuellen_kontrollen_ohne_zielrelevante_einheit CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_tpop_mit_aktuellen_kontrollen_ohne_zielrelevante_einheit AS
with zielrelevante_zaehleinheit_pro_ap AS (
  SELECT
    apflora.ap.id,
    apflora.tpopkontrzaehl_einheit_werte.code AS zaehleinheit_code
  FROM
    apflora.ap
    LEFT JOIN apflora.ekzaehleinheit
    INNER JOIN apflora.tpopkontrzaehl_einheit_werte ON apflora.tpopkontrzaehl_einheit_werte.id = apflora.ekzaehleinheit.zaehleinheit_id ON apflora.ekzaehleinheit.ap_id = apflora.ap.id
      AND apflora.ekzaehleinheit.zielrelevant = TRUE
),
tpop_mit_aktuellen_kontrollen AS (
  SELECT DISTINCT
    apflora.tpop.id
  FROM
    apflora.tpop
  INNER JOIN apflora.tpopkontr ON apflora.tpop.id = apflora.tpopkontr.tpop_id
  WHERE
    apflora.tpopkontr.jahr = date_part('year', CURRENT_DATE)
),
tpop_mit_aktuellen_kontrollen_zielrelevanter_einheit AS (
  SELECT DISTINCT
    apflora.tpop.id
  FROM
    apflora.tpop
    INNER JOIN apflora.tpopkontr
    INNER JOIN apflora.tpopkontrzaehl ON apflora.tpopkontrzaehl.tpopkontr_id = apflora.tpopkontr.id ON apflora.tpop.id = apflora.tpopkontr.tpop_id
    INNER JOIN apflora.pop
    INNER JOIN zielrelevante_zaehleinheit_pro_ap ON zielrelevante_zaehleinheit_pro_ap.id = apflora.pop.ap_id ON apflora.pop.id = apflora.tpop.pop_id
  WHERE
    apflora.tpopkontr.jahr = date_part('year', CURRENT_DATE)
    AND apflora.tpopkontrzaehl.einheit = zielrelevante_zaehleinheit_pro_ap.zaehleinheit_code
),
tpop_ohne_aktuelle_kontrollen_zielrelevanter_einheit AS (
  SELECT
    tpop_mit_aktuellen_kontrollen.id
  FROM
    tpop_mit_aktuellen_kontrollen
    LEFT JOIN tpop_mit_aktuellen_kontrollen_zielrelevanter_einheit ON tpop_mit_aktuellen_kontrollen_zielrelevanter_einheit.id = tpop_mit_aktuellen_kontrollen.id
  WHERE
    tpop_mit_aktuellen_kontrollen_zielrelevanter_einheit IS NULL
)
SELECT
  apflora.projekt.id AS proj_id,
  apflora.ap.id AS ap_id,
  apflora.pop.id AS pop_id,
  apflora.pop.nr AS pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.projekt
  INNER JOIN apflora.ap
  INNER JOIN apflora.pop
  INNER JOIN apflora.tpop
  INNER JOIN tpop_ohne_aktuelle_kontrollen_zielrelevanter_einheit ON tpop_ohne_aktuelle_kontrollen_zielrelevanter_einheit.id = apflora.tpop.id ON apflora.pop.id = apflora.tpop.pop_id ON apflora.ap.id = apflora.pop.ap_id ON apflora.projekt.id = apflora.ap.proj_id
ORDER BY
  apflora.pop.nr,
  apflora.tpop.nr;

-- the original is here: 2021-01-08_tpop_mit_aktuellen_anpflanzungen_ohne_zielrelevante_einheit.sql
DROP VIEW IF EXISTS apflora.v_q_tpop_mit_aktuellen_anpflanzungen_ohne_zielrelevante_einheit CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_tpop_mit_aktuellen_anpflanzungen_ohne_zielrelevante_einheit AS
with tpop_mit_aktuellen_anpflanzungen AS (
  SELECT DISTINCT
    apflora.tpop.id
  FROM
    apflora.tpop
    INNER JOIN apflora.tpopmassn
    INNER JOIN apflora.tpopmassn_typ_werte ON apflora.tpopmassn_typ_werte.code = apflora.tpopmassn.typ ON apflora.tpop.id = apflora.tpopmassn.tpop_id
  WHERE
    apflora.tpopmassn.jahr = date_part('year', CURRENT_DATE)
    AND apflora.tpopmassn_typ_werte.anpflanzung = TRUE
    AND (apflora.tpopmassn.zieleinheit_einheit IS NULL
      OR apflora.tpopmassn.zieleinheit_anzahl IS NULL))
SELECT
  apflora.projekt.id AS proj_id,
  apflora.ap.id AS ap_id,
  apflora.pop.id AS pop_id,
  apflora.pop.nr AS pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.projekt
  INNER JOIN apflora.ap
  INNER JOIN apflora.pop
  INNER JOIN apflora.tpop
  INNER JOIN tpop_mit_aktuellen_anpflanzungen ON tpop_mit_aktuellen_anpflanzungen.id = apflora.tpop.id ON apflora.pop.id = apflora.tpop.pop_id ON apflora.ap.id = apflora.pop.ap_id ON apflora.projekt.id = apflora.ap.proj_id
ORDER BY
  apflora.pop.nr,
  apflora.tpop.nr;

-- the original of this view is here:
-- 2020-04-12_ap_pop_ek_prio.sql
DROP VIEW IF EXISTS apflora.v_ap_pop_ek_prio CASCADE;

CREATE OR REPLACE VIEW apflora.v_ap_pop_ek_prio AS
with last_year AS (
  SELECT DISTINCT
    year
  FROM
    apflora.ap_history
  ORDER BY
    year DESC
  LIMIT 1
),
previous_year AS (
  SELECT DISTINCT
    year
  FROM
    apflora.ap_history
  ORDER BY
    year DESC
  LIMIT 1 offset 1
),
count_urspr_last AS (
  SELECT
    apflora.pop_history.ap_id,
    count(apflora.pop_history.id) AS anzahl
  FROM
    last_year,
    apflora.pop_history
  WHERE
    apflora.pop_history.year = last_year.year
    AND apflora.pop_history.status = 100
    AND EXISTS (
      SELECT
        *
      FROM
        apflora.tpop_history
      WHERE
        apflora.tpop_history.pop_id = apflora.pop_history.id
        AND apflora.tpop_history.year = last_year.year
        AND apflora.tpop_history.apber_relevant = TRUE)
    GROUP BY
      apflora.pop_history.ap_id
),
count_anges_last AS (
  SELECT
    apflora.pop_history.ap_id,
    count(apflora.pop_history.id) AS anzahl
FROM
  last_year,
  apflora.pop_history
  WHERE
    apflora.pop_history.year = last_year.year
    AND apflora.pop_history.status = 200
    AND EXISTS (
      SELECT
        *
      FROM
        apflora.tpop_history
      WHERE
        apflora.tpop_history.pop_id = apflora.pop_history.id
        AND apflora.tpop_history.year = last_year.year
        AND apflora.tpop_history.apber_relevant = TRUE)
    GROUP BY
      apflora.pop_history.ap_id
),
count_urspr_prev AS (
  SELECT
    apflora.pop_history.ap_id,
    count(apflora.pop_history.id) AS anzahl
  FROM
    last_year,
    apflora.pop_history
  WHERE
    apflora.pop_history.year = last_year.year
    AND apflora.pop_history.status = 100
    AND EXISTS (
      SELECT
        *
      FROM
        apflora.tpop_history
      WHERE
        apflora.tpop_history.pop_id = apflora.pop_history.id
        AND apflora.tpop_history.year = last_year.year
        AND apflora.tpop_history.apber_relevant = TRUE)
    GROUP BY
      apflora.pop_history.ap_id
),
count_anges_prev AS (
  SELECT
    apflora.pop_history.ap_id,
    count(apflora.pop_history.id) AS anzahl
FROM
  last_year,
  apflora.pop_history
  WHERE
    apflora.pop_history.year = last_year.year
    AND apflora.pop_history.status = 200
    AND EXISTS (
      SELECT
        *
      FROM
        apflora.tpop_history
      WHERE
        apflora.tpop_history.pop_id = apflora.pop_history.id
        AND apflora.tpop_history.year = last_year.year
        AND apflora.tpop_history.apber_relevant = TRUE)
    GROUP BY
      apflora.pop_history.ap_id
),
count_total_prev AS (
  SELECT
    apflora.pop_history.ap_id,
    count(apflora.pop_history.id) AS anzahl
  FROM
    last_year,
    apflora.pop_history
  WHERE
    apflora.pop_history.year = last_year.year
    AND apflora.pop_history.status IN (100, 200)
    AND EXISTS (
      SELECT
        *
      FROM
        apflora.tpop_history
      WHERE
        apflora.tpop_history.pop_id = apflora.pop_history.id
        AND apflora.tpop_history.year = last_year.year
        AND apflora.tpop_history.apber_relevant = TRUE)
    GROUP BY
      apflora.pop_history.ap_id
)
SELECT
  apflora.ap_history.id AS ap_id,
  apflora.ae_taxonomies.artname,
  previous_year.year AS jahr_zuvor,
  last_year.year AS jahr_zuletzt,
  coalesce(count_urspr_prev.anzahl, 0) AS anz_pop_urspr_zuvor,
  coalesce(count_anges_prev.anzahl, 0) AS anz_pop_anges_zuvor,
  coalesce(count_urspr_prev.anzahl, 0) + coalesce(count_anges_prev.anzahl, 0) AS anz_pop_aktuell_zuvor,
  coalesce(count_urspr_last.anzahl, 0) AS anz_pop_urspr_zuletzt,
  coalesce(count_anges_last.anzahl, 0) AS anz_pop_anges_zuletzt,
  coalesce(count_urspr_last.anzahl, 0) + coalesce(count_anges_last.anzahl, 0) AS anz_pop_aktuell_zuletzt,
  coalesce(count_urspr_last.anzahl, 0) - coalesce(count_urspr_prev.anzahl, 0) AS diff_pop_urspr,
  coalesce(count_anges_last.anzahl, 0) - coalesce(count_anges_prev.anzahl, 0) AS diff_pop_anges,
    (coalesce(count_urspr_last.anzahl, 0) + coalesce(count_anges_last.anzahl, 0)) - (coalesce(count_urspr_prev.anzahl, 0) + coalesce(count_anges_prev.anzahl, 0)) AS diff_pop_aktuell,
    apflora.ap_erfkrit_werte.text AS beurteilung_zuletzt
  FROM
    last_year,
    previous_year,
    apflora.ap_history
    INNER JOIN apflora.ae_taxonomies ON apflora.ae_taxonomies.id = apflora.ap_history.art_id
    LEFT JOIN apflora.apber
    LEFT JOIN apflora.ap_erfkrit_werte ON apflora.ap_erfkrit_werte.code = apflora.apber.beurteilung ON apflora.apber.ap_id = apflora.ap_history.id
    LEFT JOIN count_urspr_last ON count_urspr_last.ap_id = apflora.ap_history.id
    LEFT JOIN count_anges_last ON count_anges_last.ap_id = apflora.ap_history.id
    LEFT JOIN count_urspr_prev ON count_urspr_prev.ap_id = apflora.ap_history.id
    LEFT JOIN count_anges_prev ON count_anges_prev.ap_id = apflora.ap_history.id
  WHERE
    apflora.ap_history.bearbeitung < 4
    AND apflora.ap_history.year = last_year.year
    AND (apflora.apber.jahr = last_year.year
      OR apflora.apber.jahr IS NULL)
  ORDER BY
    apflora.ae_taxonomies.artname;

COMMENT ON VIEW apflora.v_ap_pop_ek_prio IS '@foreignKey (ap_id) references ap (id)';

-- original of this view is here: 2021-01-25_ek-planung_nach_abrechnungstyp_3.sql
DROP VIEW IF EXISTS apflora.v_ek_planung_nach_abrechnungstyp CASCADE;

CREATE OR REPLACE VIEW apflora.v_ek_planung_nach_abrechnungstyp AS
with data AS (
  SELECT
    ap.id,
    ekplan.jahr,
    ek_abrechnungstyp_werte.code AS ek_abrechnungstyp,
    count(ekplan.id)::int AS anzahl
  FROM
    apflora.ekplan ekplan
    INNER JOIN apflora.tpop tpop
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.ap ap
    INNER JOIN apflora.ae_taxonomies tax ON tax.id = ap.art_id ON ap.id = pop.ap_id ON pop.id = tpop.pop_id ON tpop.id = ekplan.tpop_id
    INNER JOIN apflora.ekfrequenz ekfrequenz
    INNER JOIN apflora.ek_abrechnungstyp_werte ek_abrechnungstyp_werte ON ek_abrechnungstyp_werte.code = ekfrequenz.ek_abrechnungstyp ON tpop.ekfrequenz = ekfrequenz.id
  WHERE
    tax.taxid > 150
  GROUP BY
    ap.id,
    ekplan.jahr,
    ek_abrechnungstyp_werte.code
)
SELECT
  tax.artname,
  ap.id AS ap_id,
  adresse.name AS artverantwortlich,
  ekplan.jahr,
  (
    SELECT
      anzahl
    FROM
      data
    WHERE
      id = ap.id
      AND jahr = ekplan.jahr
      AND ek_abrechnungstyp = 'A') AS A,
  (
    SELECT
      anzahl
    FROM
      data
    WHERE
      id = ap.id
      AND jahr = ekplan.jahr
      AND ek_abrechnungstyp = 'B') AS B,
  (
    SELECT
      anzahl
    FROM
      data
    WHERE
      id = ap.id
      AND jahr = ekplan.jahr
      AND ek_abrechnungstyp = 'D') AS D,
  (
    SELECT
      anzahl
    FROM
      data
    WHERE
      id = ap.id
      AND jahr = ekplan.jahr
      AND ek_abrechnungstyp = 'EKF') AS EKF
FROM
  apflora.ekplan ekplan
  INNER JOIN apflora.tpop tpop
  INNER JOIN apflora.pop pop
  INNER JOIN apflora.ap ap
  INNER JOIN apflora.ae_taxonomies tax ON tax.id = ap.art_id
  LEFT JOIN apflora.adresse adresse ON adresse.id = ap.bearbeiter ON ap.id = pop.ap_id ON pop.id = tpop.pop_id ON tpop.id = ekplan.tpop_id
  INNER JOIN apflora.ekfrequenz ekfrequenz
  INNER JOIN apflora.ek_abrechnungstyp_werte ek_abrechnungstyp_werte ON ek_abrechnungstyp_werte.code = ekfrequenz.ek_abrechnungstyp ON tpop.ekfrequenz = ekfrequenz.id
WHERE
  tax.taxid > 150
GROUP BY
  tax.artname,
  ap.id,
  adresse.name,
  ekplan.jahr
ORDER BY
  tax.artname,
  ekplan.jahr;

-- the original query is here: 2021-01-31_v_q_ekzieleinheit_ohne_massn_zaehleinheit.sql
DROP VIEW IF EXISTS apflora.v_q_anpflanzung_ohne_zielrelevante_einheit CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_anpflanzung_ohne_zielrelevante_einheit AS
SELECT
  ap.proj_id,
  ap.id AS ap_id,
  pop.id AS pop_id,
  pop.nr AS pop_nr,
  tpop.id AS tpop_id,
  tpop.nr AS tpop_nr,
  massn.id,
  massn.jahr
FROM
  apflora.tpopmassn massn
  INNER JOIN apflora.tpopmassn_typ_werte massn_typ ON massn_typ.code = massn.typ
  INNER JOIN apflora.tpop tpop
  INNER JOIN apflora.pop pop
  INNER JOIN apflora.ap ap
  INNER JOIN apflora.ae_taxonomies tax ON tax.id = ap.art_id ON ap.id = pop.ap_id ON pop.id = tpop.pop_id ON massn.tpop_id = tpop.id
WHERE
  massn.typ = 2
  AND massn.zieleinheit_einheit IS NULL
ORDER BY
  pop.nr,
  tpop.nr,
  massn.jahr;

-- the original view is here: 2021-02-01_qk_anpflanzung_zielrelevante_einheit_falsch.sql
DROP VIEW IF EXISTS apflora.v_q_anpflanzung_zielrelevante_einheit_falsch CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_anpflanzung_zielrelevante_einheit_falsch AS
SELECT
  ap.proj_id,
  ap.id AS ap_id,
  pop.id AS pop_id,
  pop.nr AS pop_nr,
  tpop.id AS tpop_id,
  tpop.nr AS tpop_nr,
  massn.id,
  massn.jahr,
  zaehl_einheit_werte.text AS ek_zieleinheit,
  massn_einheit_werte.text AS massn_zieleinheit
FROM
  apflora.tpopmassn massn
  INNER JOIN apflora.tpopmassn_typ_werte massn_typ ON massn_typ.code = massn.typ
  INNER JOIN apflora.tpopkontrzaehl_einheit_werte massn_einheit_werte ON massn_einheit_werte.code = massn.zieleinheit_einheit
  INNER JOIN apflora.tpop tpop
  INNER JOIN apflora.pop pop
  INNER JOIN apflora.ap ap
  INNER JOIN apflora.ae_taxonomies tax ON tax.id = ap.art_id
  INNER JOIN apflora.ekzaehleinheit AS ekzaehleinheit
  INNER JOIN apflora.tpopkontrzaehl_einheit_werte AS zaehl_einheit_werte ON zaehl_einheit_werte.id = ekzaehleinheit.zaehleinheit_id ON ekzaehleinheit.ap_id = ap.id
    AND ekzaehleinheit.zielrelevant = TRUE ON ap.id = pop.ap_id ON pop.id = tpop.pop_id ON massn.tpop_id = tpop.id
WHERE
  massn.typ = 2
  AND massn.zieleinheit_einheit <> zaehl_einheit_werte.code
  AND ekzaehleinheit.not_massn_count_unit IS FALSE
ORDER BY
  tax.artname,
  pop.nr,
  tpop.nr,
  massn.jahr;

-- the original is here: 2021-02-01_anpflanzung_zielrelevante_anzahl_falsch.sql
DROP VIEW IF EXISTS apflora.v_q_anpflanzung_zielrelevante_anzahl_falsch CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_anpflanzung_zielrelevante_anzahl_falsch AS
with data AS (
  SELECT
    ap.proj_id,
    ap.id AS ap_id,
    pop.id AS pop_id,
    pop.nr AS pop_nr,
    tpop.id AS tpop_id,
    tpop.nr AS tpop_nr,
    massn.id,
    massn.jahr,
    zaehl_einheit_werte.text AS ek_zieleinheit,
    massn.zieleinheit_anzahl AS zieleinheit_anzahl,
    CASE WHEN zaehl_einheit_werte.corresponds_to_massn_anz_triebe = TRUE THEN
      massn.anz_triebe
    WHEN zaehl_einheit_werte.corresponds_to_massn_anz_pflanzen = TRUE THEN
      massn.anz_pflanzen
    END AS anzahl
  FROM
    apflora.tpopmassn massn
    INNER JOIN apflora.tpopmassn_typ_werte massn_typ ON massn_typ.code = massn.typ
    INNER JOIN apflora.tpopkontrzaehl_einheit_werte massn_einheit_werte ON massn_einheit_werte.code = massn.zieleinheit_einheit
    INNER JOIN apflora.tpop tpop
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.ap ap
    INNER JOIN apflora.ae_taxonomies tax ON tax.id = ap.art_id
    INNER JOIN apflora.ekzaehleinheit AS ekzaehleinheit
    INNER JOIN apflora.tpopkontrzaehl_einheit_werte AS zaehl_einheit_werte ON zaehl_einheit_werte.id = ekzaehleinheit.zaehleinheit_id ON ekzaehleinheit.ap_id = ap.id
      AND ekzaehleinheit.zielrelevant = TRUE ON ap.id = pop.ap_id ON pop.id = tpop.pop_id ON massn.tpop_id = tpop.id
  WHERE
    massn.typ = 2
    AND massn.zieleinheit_einheit IS NOT NULL
    AND ekzaehleinheit.not_massn_count_unit IS FALSE
    AND zaehl_einheit_werte.text = massn_einheit_werte.text
    AND ((zaehl_einheit_werte.corresponds_to_massn_anz_triebe = TRUE
        AND massn.anz_triebe IS NOT NULL)
      OR (zaehl_einheit_werte.corresponds_to_massn_anz_pflanzen = TRUE
        AND massn.anz_pflanzen IS NOT NULL)))
SELECT
  *
FROM
  data
WHERE
  zieleinheit_anzahl <> anzahl
  OR (zieleinheit_anzahl IS NULL
    AND anzahl IS NOT NULL)
  OR (zieleinheit_anzahl IS NOT NULL
    AND anzahl IS NULL)
ORDER BY
  pop_nr,
  tpop_nr,
  jahr;

