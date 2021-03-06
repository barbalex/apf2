-- used in export
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
  INNER JOIN apflora.ap
    LEFT JOIN apflora.ap_bearbstand_werte
    ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code
    LEFT JOIN apflora.ap_umsetzung_werte
    ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code
    INNER JOIN apflora.pop
      LEFT JOIN letzter_popber
        LEFT JOIN apflora.popber
          LEFT JOIN apflora.tpop_entwicklung_werte
          ON apflora.popber.entwicklung = tpop_entwicklung_werte.code
        ON
          (letzter_popber.jahr = apflora.popber.jahr)
          AND (letzter_popber.pop_id = apflora.popber.pop_id)
      ON apflora.pop.id = letzter_popber.pop_id
      LEFT JOIN apflora.pop_status_werte
      ON apflora.pop.status  = pop_status_werte.code
    ON apflora.ap.id = apflora.pop.ap_id
  ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  apflora.ae_taxonomies.taxid > 150
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  letzter_popber.jahr;
comment on view apflora.v_pop_mit_letzter_popber is '@foreignKey (pop_id) references pop (id)';

-- used in export
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
  INNER JOIN apflora.ap
    LEFT JOIN apflora.ap_bearbstand_werte
    ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code
    LEFT JOIN apflora.ap_umsetzung_werte
    ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code
    INNER JOIN apflora.pop
      LEFT JOIN apflora.pop_status_werte
      ON apflora.pop.status  = pop_status_werte.code
      LEFT JOIN pop_letztes_massnberjahr
        LEFT JOIN apflora.popmassnber
          LEFT JOIN apflora.tpopmassn_erfbeurt_werte
          ON apflora.popmassnber.beurteilung = tpopmassn_erfbeurt_werte.code
        ON
          (pop_letztes_massnberjahr.jahr = apflora.popmassnber.jahr)
          AND (pop_letztes_massnberjahr.id = apflora.popmassnber.pop_id)
      ON apflora.pop.id = pop_letztes_massnberjahr.id
    ON apflora.ap.id = apflora.pop.ap_id
  ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  apflora.ae_taxonomies.taxid > 150
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  pop_letztes_massnberjahr.jahr;
comment on view apflora.v_pop_mit_letzter_popmassnber is '@foreignKey (pop_id) references pop (id)';

-- used for export
DROP VIEW IF EXISTS apflora.v_pop_popberundmassnber CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_popberundmassnber AS
with berjahre as (
  SELECT distinct
    apflora.pop.id,
    apflora.popber.jahr
  FROM
    apflora.pop
    INNER JOIN
      apflora.popber
      ON apflora.pop.id = apflora.popber.pop_id
  UNION SELECT distinct
    apflora.pop.id,
    apflora.popmassnber.jahr
  FROM
    apflora.pop
    INNER JOIN
      apflora.popmassnber
      ON apflora.pop.id = apflora.popmassnber.pop_id
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
  berjahre.jahr,
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
  INNER JOIN apflora.ap 
    LEFT JOIN apflora.ap_bearbstand_werte
    ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code
    LEFT JOIN apflora.ap_umsetzung_werte
    ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code
    INNER JOIN apflora.pop
      LEFT JOIN apflora.pop_status_werte
      ON apflora.pop.status  = pop_status_werte.code
      LEFT JOIN berjahre
        LEFT JOIN apflora.popber
          LEFT JOIN apflora.tpop_entwicklung_werte
          ON apflora.popber.entwicklung = tpop_entwicklung_werte.code
        ON
          (berjahre.jahr = apflora.popber.jahr)
          AND (berjahre.id = apflora.popber.pop_id)
        LEFT JOIN apflora.popmassnber
          LEFT JOIN apflora.tpopmassn_erfbeurt_werte
          ON apflora.popmassnber.beurteilung = tpopmassn_erfbeurt_werte.code
        ON
          (berjahre.jahr = apflora.popmassnber.jahr)
          AND (berjahre.id = apflora.popmassnber.pop_id)
      ON apflora.pop.id = berjahre.id
    ON apflora.ap.id = apflora.pop.ap_id
  ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  apflora.ae_taxonomies.taxid > 150
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  berjahre.jahr;
comment on view apflora.v_pop_popberundmassnber is '@foreignKey (pop_id) references pop (id)';

-- used for export
DROP VIEW IF EXISTS apflora.v_popmassnber_anzmassn CASCADE;
CREATE OR REPLACE VIEW apflora.v_popmassnber_anzmassn AS
with anz_massn_pro_jahr as (
  SELECT
    apflora.popmassnber.pop_id,
    apflora.popmassnber.jahr,
    count(apflora.tpopmassn.id) AS anzahl_massnahmen
  FROM
    apflora.popmassnber
    INNER JOIN apflora.tpop
      LEFT JOIN apflora.tpopmassn
      ON apflora.tpop.id = apflora.tpopmassn.tpop_id
    ON apflora.popmassnber.pop_id = apflora.tpop.pop_id
  WHERE
    apflora.tpopmassn.jahr = apflora.popmassnber.jahr
    or apflora.tpopmassn.jahr IS NULL
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
  apflora.pop.changed AS pop_changed,
  apflora.pop.changed_by AS pop_changed_by,
  apflora.popmassnber.id AS id,
  apflora.popmassnber.jahr AS jahr,
  tpopmassn_erfbeurt_werte.text AS entwicklung,
  apflora.popmassnber.bemerkungen AS bemerkungen,
  apflora.popmassnber.changed AS changed,
  apflora.popmassnber.changed_by AS changed_by,
  anz_massn_pro_jahr.anzahl_massnahmen
FROM
  apflora.ae_taxonomies
  INNER JOIN apflora.ap
    LEFT JOIN apflora.ap_bearbstand_werte
    ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code
    LEFT JOIN apflora.ap_umsetzung_werte
    ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code
    INNER JOIN apflora.pop
      LEFT JOIN apflora.pop_status_werte
      ON apflora.pop.status  = pop_status_werte.code
      INNER JOIN apflora.popmassnber
        LEFT JOIN apflora.tpopmassn_erfbeurt_werte
        ON apflora.popmassnber.beurteilung = tpopmassn_erfbeurt_werte.code
        LEFT JOIN anz_massn_pro_jahr
        on anz_massn_pro_jahr.pop_id = apflora.popmassnber.pop_id and anz_massn_pro_jahr.jahr = apflora.popmassnber.jahr
      ON apflora.pop.id = apflora.popmassnber.pop_id
    ON apflora.ap.id = apflora.pop.ap_id
  ON apflora.ae_taxonomies.id = apflora.ap.art_id
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr;
comment on view apflora.v_popmassnber_anzmassn is '@foreignKey (id) references popmassnber (id)';

-- used for export
drop view if exists apflora.v_ap_apberundmassn;
create or replace view apflora.v_ap_apberundmassn as
with massn_jahre as (
  select
    jahr
  from
    apflora.tpopmassn
  group by
    jahr
  having
    jahr between 1900 and 2100
  order by
    jahr
),
ap_massn_jahre as (
  select
    apflora.ap.id,
    massn_jahre.jahr
  from
    apflora.ap,
    massn_jahre
  where
    apflora.ap.bearbeitung < 4
  order by
    apflora.ap.id,
    massn_jahre.jahr
),
ap_anzmassnprojahr0 as (
  select
    apflora.ap.id,
    apflora.tpopmassn.jahr,
    count(apflora.tpopmassn.id) as anz_tpopmassn
  from
    apflora.ap
    inner join
      apflora.pop
      inner join
        apflora.tpop
        on apflora.pop.id = apflora.tpop.pop_id
      inner join
        apflora.tpopmassn
        on apflora.tpop.id = apflora.tpopmassn.tpop_id
      on apflora.ap.id = apflora.pop.ap_id
  where
    apflora.ap.bearbeitung between 1 and 3
    and apflora.tpop.apber_relevant = true
    and apflora.pop.status  <> 300
  group by
    apflora.ap.id,
    apflora.tpopmassn.jahr
  having
    apflora.tpopmassn.jahr is not null
),
ap_anzmassnprojahr as (
  select
    ap_massn_jahre.id,
    ap_massn_jahre.jahr,
    coalesce(ap_anzmassnprojahr0.anz_tpopmassn, 0) as anzahl_massnahmen
  from
    ap_massn_jahre
    left join
      ap_anzmassnprojahr0
      on
        (ap_massn_jahre.jahr = ap_anzmassnprojahr0.jahr)
        and (ap_massn_jahre.id = ap_anzmassnprojahr0.id)
  order by
    ap_massn_jahre.id,
    ap_massn_jahre.jahr
),
ap_anzmassn_alle_jahre as (
  select
    ap_massn_jahre.id,
    ap_massn_jahre.jahr,
    coalesce(ap_anzmassnprojahr0.anz_tpopmassn, 0) as anzahl_massnahmen
  from
    ap_massn_jahre
    left join
      ap_anzmassnprojahr0
      on
        (ap_massn_jahre.jahr = ap_anzmassnprojahr0.jahr)
        and (ap_massn_jahre.id = ap_anzmassnprojahr0.id)
),
  ap_anzmassnbisjahr as (select
    ap_massn_jahre.id,
    ap_massn_jahre.jahr,
    sum(ap_anzmassn_alle_jahre.anzahl_massnahmen) as anzahl_massnahmen
  from
    ap_massn_jahre
    inner join
      ap_anzmassn_alle_jahre
      on ap_massn_jahre.id = ap_anzmassn_alle_jahre.id
  where
    ap_anzmassn_alle_jahre.jahr <= ap_massn_jahre.jahr
  group by
    ap_massn_jahre.id,
    ap_massn_jahre.jahr
)
select
  apflora.ap.id,
  ap_anzmassnprojahr.jahr as massn_jahr,
  ap_anzmassnprojahr.anzahl_massnahmen as massn_anzahl,
  ap_anzmassnbisjahr.anzahl_massnahmen as massn_anzahl_bisher,
  case
    when apflora.apber.jahr > 0
    then 'ja'
    else 'nein'
  end as bericht_erstellt
from
  apflora.ap
    inner join ap_anzmassnprojahr
      inner join ap_anzmassnbisjahr
        left join apflora.apber
        on
          (ap_anzmassnbisjahr.jahr = apflora.apber.jahr)
          and (ap_anzmassnbisjahr.id = apflora.apber.ap_id)
      on
        (ap_anzmassnprojahr.jahr = ap_anzmassnbisjahr.jahr)
        and (ap_anzmassnprojahr.id = ap_anzmassnbisjahr.id)
    on apflora.ap.id = ap_anzmassnprojahr.id;
comment on view apflora.v_ap_apberundmassn is '@foreignKey (id) references ap (id)';

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
          apflora.tpopkontrzaehl_einheit_werte
          on apflora.tpopmassn.zieleinheit_einheit = apflora.tpopkontrzaehl_einheit_werte.code
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
  apflora.tpopmassn.zieleinheit_einheit as massn_zieleinheit_einheit,
  apflora.tpopmassn.zieleinheit_anzahl as massn_zieleinheit_anzahl,
  apflora.tpopmassn.wirtspflanze AS massn_wirtspflanze,
  apflora.tpopmassn.herkunft_pop AS massn_herkunft_pop,
  apflora.tpopmassn.sammeldatum AS massn_sammeldatum,
  apflora.tpopmassn.von_anzahl_individuen AS massn_von_anzahl_individuen,
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
  apflora.tpopmassn.changed::timestamp AS massn_changed,
  apflora.tpopmassn.changed_by AS massn_changed_by
FROM
  ((((apflora.ae_taxonomies
  INNER JOIN
    apflora.ap ON apflora.ae_taxonomies.id = apflora.ap.art_id
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.pop.id = apflora.tpop.pop_id
      INNER JOIN
        apflora.tpopmassn
        LEFT JOIN
          apflora.tpopkontrzaehl_einheit_werte
          ON apflora.tpopmassn.zieleinheit_einheit = tpopkontrzaehl_einheit_werte.code
        LEFT JOIN
          apflora.tpopmassn_typ_werte
          ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code
        ON apflora.tpop.id = apflora.tpopmassn.tpop_id
    ON apflora.ap.id = apflora.pop.ap_id
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
comment on view apflora.v_tpop_anzmassn is '@foreignKey (id) references tpop (id)';

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
comment on view apflora.v_pop_anzmassn is '@foreignKey (id) references pop (id)';

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
comment on view apflora.v_pop_anzkontr is '@foreignKey (id) references pop (id)'

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
      LEFT JOIN apflora.tpopmassn
      ON apflora.tpop.id = apflora.tpopmassn.tpop_id
    ON apflora.pop.id = apflora.tpop.pop_id
  ON apflora.ap.id = apflora.pop.ap_id
GROUP BY
  apflora.ap.id;
comment on view apflora.v_ap_anzmassn is '@foreignKey (id) references ap (id)'

-- used for export
DROP VIEW IF EXISTS apflora.v_ap_anzkontr CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_anzkontr AS
SELECT
  apflora.ap.id,
  count(apflora.tpopkontr.id) AS anzahl_kontrollen
FROM
  apflora.ap
  left JOIN apflora.pop
    LEFT JOIN apflora.tpop
      LEFT JOIN apflora.tpopkontr
      ON apflora.tpop.id = apflora.tpopkontr.tpop_id
    ON apflora.pop.id = apflora.tpop.pop_id
  ON apflora.ap.id = apflora.pop.ap_id
GROUP BY
  apflora.ap.id;
comment on view apflora.v_ap_anzkontr is '@foreignKey (id) references ap (id)'

-- used for export
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
comment on view apflora.v_pop_ohnekoord is '@foreignKey (id) references pop (id)'

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

drop view if exists apflora.v_tpop_erste_und_letzte_kontrolle_und_letzter_tpopber cascade;
create or replace view apflora.v_tpop_erste_und_letzte_kontrolle_und_letzter_tpopber as
with anz_kontr as (
  select
    apflora.tpop.id as tpop_id,
    count(apflora.tpopkontr.id) as anz_tpopkontr
  from
    apflora.tpop
    left join apflora.tpopkontr
    on apflora.tpop.id = apflora.tpopkontr.tpop_id
  where
    apflora.tpopkontr.jahr is not null
    and apflora.tpopkontr.typ is not null
    and apflora.tpopkontr.typ not in ('ziel', 'zwischenziel')
    and apflora.tpopkontr.apber_nicht_relevant is not true
  group by
    apflora.tpop.id
),
letzte_kontr as (
  select distinct on (apflora.tpop.id)
    apflora.tpop.id,
    apflora.tpopkontr.id as tpopkontr_id
  from 
    apflora.tpop
    inner join apflora.tpopkontr
    on apflora.tpop.id = apflora.tpopkontr.tpop_id
  where
    apflora.tpopkontr.jahr is not null
    and apflora.tpopkontr.typ is not null
    and apflora.tpopkontr.typ not in ('ziel', 'zwischenziel')
    and apflora.tpopkontr.apber_nicht_relevant is not true
  order by
    apflora.tpop.id,
    tpopkontr.jahr desc,
    tpopkontr.datum desc
),
letzte_kontr_anzahlen as (
  select
    apflora.tpopkontr.tpop_id,
    array_to_string(array_agg(apflora.tpopkontrzaehl.anzahl), ', ') as anzahlen,
    string_agg(apflora.tpopkontrzaehl_einheit_werte.text, ', ') as einheiten,
    string_agg(apflora.tpopkontrzaehl_methode_werte.text, ', ') as methoden
  from
    apflora.tpopkontr
    inner join apflora.tpopkontrzaehl
      left join apflora.tpopkontrzaehl_einheit_werte
      on apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code
      left join apflora.tpopkontrzaehl_methode_werte
      on apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code
    on apflora.tpopkontrzaehl.tpopkontr_id = apflora.tpopkontr.id
    inner join letzte_kontr
    on letzte_kontr.tpopkontr_id = apflora.tpopkontr.id and letzte_kontr.id = apflora.tpopkontr.tpop_id
  group by
    apflora.tpopkontr.tpop_id
),
erste_kontr as (
  select distinct on (apflora.tpop.id)
    apflora.tpop.id,
    apflora.tpopkontr.id as tpopkontr_id
  from 
    apflora.tpop
    inner join apflora.tpopkontr
    on apflora.tpop.id = apflora.tpopkontr.tpop_id
  where
    apflora.tpopkontr.jahr is not null
    and apflora.tpopkontr.typ is not null
    and apflora.tpopkontr.typ not in ('ziel', 'zwischenziel')
    and apflora.tpopkontr.apber_nicht_relevant is not true
  order by
    apflora.tpop.id,
    tpopkontr.jahr asc,
    tpopkontr.datum asc
),
erste_kontr_anzahlen as (
  select
    apflora.tpopkontr.tpop_id,
    array_to_string(array_agg(apflora.tpopkontrzaehl.anzahl), ', ') as anzahlen,
    string_agg(apflora.tpopkontrzaehl_einheit_werte.text, ', ') as einheiten,
    string_agg(apflora.tpopkontrzaehl_methode_werte.text, ', ') as methoden
  from
    apflora.tpopkontr
    inner join apflora.tpopkontrzaehl
      left join apflora.tpopkontrzaehl_einheit_werte
      on apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code
      left join apflora.tpopkontrzaehl_methode_werte
      on apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code
    on apflora.tpopkontrzaehl.tpopkontr_id = apflora.tpopkontr.id
    inner join erste_kontr
    on erste_kontr.tpopkontr_id = apflora.tpopkontr.id and erste_kontr.id = apflora.tpopkontr.tpop_id
  group by
    apflora.tpopkontr.tpop_id
),
anz_tpopber as (
  select
    apflora.tpop.id as tpop_id,
    count(apflora.tpopber.id) as anzahl
  from
    apflora.tpop
    left join apflora.tpopber
    on apflora.tpop.id = apflora.tpopber.tpop_id
  where
    apflora.tpopber.jahr is not null
    and apflora.tpopber.entwicklung is not null
  group by
    apflora.tpop.id
),
letzte_tpopber as (
  select distinct on (apflora.tpopber.tpop_id)
    apflora.tpopber.tpop_id,
    apflora.tpopber.id,
    apflora.tpopber.jahr,
    apflora.tpop_entwicklung_werte.text as entwicklung,
    apflora.tpopber.bemerkungen,
    apflora.tpopber.changed,
    apflora.tpopber.changed_by
  from
    apflora.tpopber
    left join apflora.tpop_entwicklung_werte
    on apflora.tpopber.entwicklung = tpop_entwicklung_werte.code
  where
    apflora.tpopber.jahr is not null
    and apflora.tpopber.entwicklung is not null
  order by
    apflora.tpopber.tpop_id,
    apflora.tpopber.jahr desc,
    apflora.tpopber.changed desc
)
select
  apflora.pop.ap_id,
  apflora.ae_taxonomies.familie,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text as ap_bearbeitung,
  apflora.ap.start_jahr as ap_start_jahr,
  apflora.ap_umsetzung_werte.text as ap_umsetzung,
  apflora.adresse.name as ap_bearbeiter,
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.pop.name as pop_name,
  pop_status_werte.text as pop_status,
  apflora.pop.bekannt_seit as pop_bekannt_seit,
  apflora.pop.status_unklar as pop_status_unklar,
  apflora.pop.status_unklar_begruendung as pop_status_unklar_begruendung,
  apflora.pop.lv95_x as pop_x,
  apflora.pop.lv95_y as pop_y,
  apflora.tpop.id,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname,
  apflora.tpop.status,
  pop_status_werte_2.text as status_decodiert,
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
  apflora.ekfrequenz.code as ekfrequenz,
  apflora.tpop.ekfrequenz_abweichend,
  apflora.tpop.changed,
  apflora.tpop.changed_by,
  coalesce(anz_kontr.anz_tpopkontr, 0) as anzahl_kontrollen,
  lk.id as letzte_kontrolle_id,
  lk.jahr as letzte_kontrolle_jahr,
  lk.datum as letzte_kontrolle_datum,
  lk.typ as letzte_kontrolle_typ,
  lk_adresse.name as letzte_kontrolle_bearbeiter,
  lk.ueberlebensrate as letzte_kontrolle_ueberlebensrate,
  lk.vitalitaet as letzte_kontrolle_vitalitaet,
  lk_entwicklung_werte.text as letzte_kontrolle_entwicklung,
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
  lk_idbiotuebereinst_werte.text as letzte_kontrolle_idealbiotop_uebereinstimmung,
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
  letzte_kontr_anzahlen.anzahlen as letzte_kontrolle_zaehlung_anzahlen,
  letzte_kontr_anzahlen.einheiten as letzte_kontrolle_zaehlung_einheiten,
  letzte_kontr_anzahlen.methoden as letzte_kontrolle_zaehlung_methoden,
  ek.id as erste_kontrolle_id,
  ek.jahr as erste_kontrolle_jahr,
  ek.datum as erste_kontrolle_datum,
  ek.typ as erste_kontrolle_typ,
  ek_adresse.name as erste_kontrolle_bearbeiter,
  ek.ueberlebensrate as erste_kontrolle_ueberlebensrate,
  ek.vitalitaet as erste_kontrolle_vitalitaet,
  ek_entwicklung_werte.text as erste_kontrolle_entwicklung,
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
  ek_idbiotuebereinst_werte.text as erste_kontrolle_idealbiotop_uebereinstimmung,
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
  erste_kontr_anzahlen.anzahlen as erste_kontrolle_zaehlung_anzahlen,
  erste_kontr_anzahlen.einheiten as erste_kontrolle_zaehlung_einheiten,
  erste_kontr_anzahlen.methoden as erste_kontrolle_zaehlung_methoden,
	anz_tpopber.anzahl as tpopber_anz,
	letzte_tpopber.id as tpopber_id,
	letzte_tpopber.jahr as tpopber_jahr,
	letzte_tpopber.entwicklung as tpopber_entwicklung,
	letzte_tpopber.bemerkungen as tpopber_bemerkungen,
	letzte_tpopber.changed as tpopber_changed,
	letzte_tpopber.changed_by  as tpopber_changed_by
from
  apflora.ae_taxonomies
  inner join apflora.ap
    left join apflora.ap_bearbstand_werte
    on apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code
    left join apflora.ap_umsetzung_werte
    on apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code
    left join apflora.adresse
    on apflora.ap.bearbeiter = apflora.adresse.id
    inner join apflora.pop
      left join apflora.pop_status_werte
      on apflora.pop.status  = pop_status_werte.code
      inner join apflora.tpop
        left join apflora.ekfrequenz
        on apflora.ekfrequenz.id = apflora.tpop.ekfrequenz
        left join letzte_kontr_anzahlen
        on letzte_kontr_anzahlen.tpop_id = apflora.tpop.id
        left join erste_kontr_anzahlen
        on erste_kontr_anzahlen.tpop_id = apflora.tpop.id
        left join anz_tpopber
        on anz_tpopber.tpop_id = apflora.tpop.id
        left join anz_kontr
        on anz_kontr.tpop_id = apflora.tpop.id
        left join apflora.pop_status_werte as pop_status_werte_2
        on apflora.tpop.status = pop_status_werte_2.code
        left join letzte_tpopber
        on apflora.tpop.id = letzte_tpopber.tpop_id
        left join letzte_kontr
          inner join apflora.tpopkontr as lk
            left join apflora.adresse lk_adresse
            on lk.bearbeiter = lk_adresse.id
            left join apflora.tpop_entwicklung_werte lk_entwicklung_werte
            on lk.entwicklung = lk_entwicklung_werte.code
            left join apflora.tpopkontr_idbiotuebereinst_werte lk_idbiotuebereinst_werte
            on lk.idealbiotop_uebereinstimmung = lk_idbiotuebereinst_werte.code
          on letzte_kontr.tpopkontr_id = lk.id
        on letzte_kontr.id = apflora.tpop.id
        left join erste_kontr
          inner join apflora.tpopkontr as ek
            left join apflora.adresse ek_adresse
            on ek.bearbeiter = ek_adresse.id
            left join apflora.tpop_entwicklung_werte ek_entwicklung_werte
            on ek.entwicklung = ek_entwicklung_werte.code
            left join apflora.tpopkontr_idbiotuebereinst_werte ek_idbiotuebereinst_werte
            on ek.idealbiotop_uebereinstimmung = ek_idbiotuebereinst_werte.code
          on erste_kontr.tpopkontr_id = ek.id
        on erste_kontr.id = apflora.tpop.id
      on apflora.pop.id = apflora.tpop.pop_id
    on apflora.ap.id = apflora.pop.ap_id
  on apflora.ae_taxonomies.id = apflora.ap.art_id
where
  apflora.ae_taxonomies.taxid > 150
order by
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr;
comment on view apflora.v_tpop_erste_und_letzte_kontrolle_und_letzter_tpopber is '@foreignKey (id) references tpop (id)';

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

-- used for export
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
comment on view apflora.v_pop_vonapohnestatus is '@foreignKey (id) references pop (id)';

-- used for export
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

-- used for export
DROP VIEW IF EXISTS apflora.v_beob CASCADE;
CREATE OR REPLACE VIEW apflora.v_beob AS
SELECT
  apflora.beob.id,
  apflora.beob.quelle,
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
  ((apflora.beob
  INNER JOIN
    apflora.beob AS beob2
    ON beob2.id = beob.id)
  INNER JOIN
    apflora.ae_taxonomies
    INNER JOIN
      apflora.ap
      ON apflora.ap.art_id = apflora.ae_taxonomies.id
    ON apflora.beob.art_id = apflora.ae_taxonomies.id)
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

-- unsed in exports
DROP VIEW IF EXISTS apflora.v_beob_art_changed CASCADE;
CREATE OR REPLACE VIEW apflora.v_beob_art_changed AS
SELECT
  apflora.beob.id,
  apflora.beob.quelle,
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

-- used in exports
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
comment on view apflora.v_tpop_kml is '@foreignKey (id) references tpop (id)';

-- used in exports
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
comment on view apflora.v_tpop_kmlnamen is '@foreignKey (id) references tpop (id)';

-- used in exports
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
comment on view apflora.v_pop_kml is '@foreignKey (id) references pop (id)';

-- used in exports
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
comment on view apflora.v_pop_kmlnamen is '@foreignKey (id) references pop (id)';

-- used in exports
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

-- used in exports
-- TODO: make this query more efficient. Takes 48s to run
DROP VIEW IF EXISTS apflora.v_tpop_popberundmassnber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_popberundmassnber AS
with berjahre as (
  SELECT
    apflora.tpop.id,
    apflora.tpopber.jahr
  FROM
    apflora.tpop
    INNER JOIN apflora.tpopber 
    ON apflora.tpop.id = apflora.tpopber.tpop_id
  UNION SELECT
    apflora.tpop.id,
    apflora.tpopmassnber.jahr
  FROM
    apflora.tpop
    INNER JOIN apflora.tpopmassnber
    ON apflora.tpop.id = apflora.tpopmassnber.tpop_id
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
  apflora.tpopber.changed AS tpopber_changed,
  apflora.tpopber.changed_by AS tpopber_changed_by,
  apflora.tpopmassnber.id AS tpopmassnber_id,
  apflora.tpopmassnber.jahr AS tpopmassnber_jahr,
  tpopmassn_erfbeurt_werte.text AS tpopmassnber_entwicklung,
  apflora.tpopmassnber.bemerkungen AS tpopmassnber_bemerkungen,
  apflora.tpopmassnber.changed AS tpopmassnber_changed,
  apflora.tpopmassnber.changed_by AS tpopmassnber_changed_by
FROM
  apflora.ae_taxonomies
  RIGHT JOIN
    apflora.ap
      RIGHT JOIN apflora.pop
        RIGHT JOIN apflora.tpop
          LEFT JOIN apflora.pop_status_werte AS tpop_status_werte
          ON apflora.tpop.status = tpop_status_werte.code
          LEFT JOIN berjahre
            LEFT JOIN apflora.tpopmassnber
              LEFT JOIN apflora.tpopmassn_erfbeurt_werte
              ON apflora.tpopmassnber.beurteilung = tpopmassn_erfbeurt_werte.code
            ON
              (berjahre.id = apflora.tpopmassnber.tpop_id)
              AND (berjahre.jahr = apflora.tpopmassnber.jahr)
            LEFT JOIN apflora.tpopber
              LEFT JOIN apflora.tpop_entwicklung_werte
              ON apflora.tpopber.entwicklung = tpop_entwicklung_werte.code
            ON
              (berjahre.jahr = apflora.tpopber.jahr)
              AND (berjahre.id = apflora.tpopber.tpop_id)
          ON apflora.tpop.id = berjahre.id
        ON apflora.pop.id = apflora.tpop.pop_id
        LEFT JOIN apflora.pop_status_werte
        ON apflora.pop.status  = pop_status_werte.code
      ON apflora.ap.id = apflora.pop.ap_id
      LEFT JOIN apflora.ap_bearbstand_werte
      ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code
      LEFT JOIN apflora.ap_umsetzung_werte
      ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code
    ON apflora.ae_taxonomies.id = apflora.ap.art_id
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
  apflora.tpop.status = 201
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
  INNER JOIN apflora.pop
    INNER JOIN apflora.tpop
      INNER JOIN apflora.tpopber
        INNER JOIN tpop_letzterpopber
        ON
          (tpop_letzterpopber.tpopber_jahr = apflora.tpopber.jahr)
          AND (tpop_letzterpopber.tpop_id = apflora.tpopber.tpop_id)
      ON apflora.tpopber.tpop_id = apflora.tpop.id
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

DROP VIEW IF EXISTS apflora.v_q_pop_statuserloschenletzterpopberaktuell CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_statuserloschenletzterpopberaktuell AS
with letzter_popber as (
  SELECT distinct on (pop_id)
    pop_id,
    jahr
  FROM
    apflora.popber
  WHERE
    jahr IS NOT NULL
  order by
    pop_id,
    jahr desc
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
      INNER JOIN letzter_popber
      ON
        (letzter_popber.jahr = apflora.popber.jahr)
        AND (letzter_popber.pop_id = apflora.popber.pop_id)
    ON apflora.popber.pop_id = apflora.pop.id
    INNER JOIN apflora.tpop
    ON apflora.tpop.pop_id = apflora.pop.id
  ON apflora.pop.ap_id = apflora.ap.id
WHERE
  apflora.popber.entwicklung < 8
  AND apflora.pop.status  IN (101, 202)
  AND apflora.tpop.apber_relevant = true
ORDER BY
  apflora.pop.nr;

drop view if exists apflora.v_q_tpop_erloschenundrelevantaberletztebeobvor1950 cascade;
create or replace view apflora.v_q_tpop_erloschenundrelevantaberletztebeobvor1950 as
with tpop_max_beobjahr as (
  select
    tpop_id as id,
    max(date_part('year', datum)) as jahr
  from
    apflora.beob
  where
    datum is not null and
    tpop_id is not null
  group by
    tpop_id
)
select
  apflora.ap.proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
from
  apflora.ap
  inner join apflora.pop
    inner join apflora.tpop
    on apflora.pop.id = apflora.tpop.pop_id
  on apflora.ap.id = apflora.pop.ap_id
where
  apflora.tpop.status in (101, 202)
  and apflora.tpop.apber_relevant = true
  and apflora.tpop.id not in (
    select distinct
      apflora.tpopkontr.tpop_id
    from
      apflora.tpopkontr
      inner join apflora.tpopkontrzaehl
      on apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id
    where
      apflora.tpopkontr.typ not in ('zwischenziel', 'ziel')
      and apflora.tpopkontrzaehl.anzahl > 0
  )
  and apflora.tpop.id in (
    select
      apflora.beob.tpop_id
    from
      apflora.beob
      inner join tpop_max_beobjahr
      on apflora.beob.tpop_id = tpop_max_beobjahr.id
    where
      tpop_max_beobjahr.jahr < 1950
  )
order by
  apflora.pop.nr,
  apflora.tpop.nr;

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
  apflora.tpop.status IN (100, 200, 201, 300)
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

DROP VIEW IF EXISTS apflora.v_q_pop_urspruenglich_wiederauferstanden CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_urspruenglich_wiederauferstanden AS
with pop_id_ansiedlung_jahre as (
  select distinct
    tpop.pop_id as id,
    massn.jahr
  from
    apflora.tpop tpop
    inner join apflora.tpopmassn massn
      inner join apflora.tpopmassn_typ_werte massntyp
      on massn.typ = massntyp.code
    on tpop.id = massn.tpop_id
  where
    massntyp.ansiedlung = true
  order by
    tpop.pop_id,
    massn.jahr
)
select
  projekt.id as proj_id,
  tax.artname,
  ap.id as ap_id,
  pop.id,
  pop.nr,
  pop_id_ansiedlung_jahre.jahr
from
  apflora.pop pop
  inner join pop_id_ansiedlung_jahre
    inner join apflora.pop_history pop_history
    on pop_id_ansiedlung_jahre.id = pop_history.id and pop_history.year = pop_id_ansiedlung_jahre.jahr - 1
  on pop.id = pop_id_ansiedlung_jahre.id
  inner join apflora.ap ap
    inner join apflora.projekt projekt
    on projekt.id = ap.proj_id
    inner join apflora.ae_taxonomies tax
    on ap.art_id = tax.id
  on ap.id = pop.ap_id
where
  pop.status = 101
  and pop_history.status in (100, 200, 201);


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
  apflora.pop.status IN (100, 200, 201, 300)
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
CREATE OR REPLACE VIEW apflora.v_apbeob AS
select
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
  beob.changed,
  beob.changed_by,
  beob.wgs84_lat,
  beob.wgs84_long,
  apflora.apart.ap_id,
  concat(to_char(beob.datum, 'YYYY.MM.DD'), ': ', coalesce(beob.autor, '(kein Autor)'), ' (', beob.quelle, ')') as label
from
  apflora.beob beob
  inner join apflora.apart
  on apflora.apart.art_id = beob.art_id
order by
  beob.datum desc,
  beob.autor asc,
  beob.quelle asc;

-- used in exports
-- use https://github.com/hnsl/colpivot instead?
DROP VIEW IF EXISTS apflora.v_tpop_last_count CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_last_count AS
select 
  tax.artname,
  ap.id as ap_id,
  pop.id as pop_id,
  pop.nr as pop_nr,
  pop.name as pop_name,
  psw.text as pop_status,
  tpop.nr as tpop_nr,
  tpop.gemeinde as tpop_gemeinde,
  tpop.flurname as tpop_flurname,
  tpsw.text as tpop_status,
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
      tpop3.apber_relevant is true
      and kontr4.jahr is not null
      and zaehl3.anzahl is not null
      and kontr4.tpop_id = tpop.id
      and kontr4.apber_nicht_relevant is not true
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
      tpop2.apber_relevant is true
      -- nur Kontrollen mit Jahr berücksichtigen
      and kontr2.jahr is not null
      and kontr2.apber_nicht_relevant is not true
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
          tpop3.apber_relevant is true
          and kontr3.jahr is not null
          and zaehl3.anzahl is not null
          and kontr3.tpop_id = tpop2.id
          and kontr3.apber_nicht_relevant is not true
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
  $$SELECT unnest('{Pflanzen total, Pflanzen (ohne Jungpflanzen), Triebe total, Triebe Beweidung, Keimlinge, davon Rosetten, Jungpflanzen, Blätter, davon blühende Pflanzen, davon blühende Triebe, Blüten, Fertile Pflanzen, fruchtende Triebe, Blütenstände, Fruchtstände, Gruppen, Deckung (%), Pflanzen/5m2, Triebe in 30 m2, Triebe/50m2, Triebe Mähfläche, Fläche (m2), Pflanzstellen, Stellen, andere Zaehleinheit, Art ist vorhanden}'::text[])$$
) as anzahl ("tpop_id" uuid, "Pflanzen total" integer, "Pflanzen (ohne Jungpflanzen)" integer, "Triebe total" integer, "Triebe Beweidung" integer, "Keimlinge" integer, "davon Rosetten" integer, "Jungpflanzen" integer, "Blätter" integer, "davon blühende Pflanzen" integer, "davon blühende Triebe" integer, "Blüten" integer, "Fertile Pflanzen" integer, "fruchtende Triebe" integer, "Blütenstände" integer, "Fruchtstände" integer, "Gruppen" integer, "Deckung (%)" integer, "Pflanzen/5m2" integer, "Triebe in 30 m2" integer, "Triebe/50m2" integer, "Triebe Mähfläche" integer, "Fläche (m2)" integer, "Pflanzstellen" integer, "Stellen" integer, "andere Zaehleinheit" integer, "Art ist vorhanden" text)
inner join apflora.tpop tpop
  inner join apflora.pop_status_werte tpsw
  on tpsw.code = tpop.status
  inner join apflora.pop pop
    inner join apflora.pop_status_werte psw
    on psw.code = pop.status
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
comment on view apflora.v_tpop_last_count is '@foreignKey (tpop_id) references tpop (id)';

-- used by: v_pop_last_count_with_massn
-- also used in export
-- use https://github.com/hnsl/colpivot instead?
DROP VIEW IF EXISTS apflora.v_tpop_last_count_with_massn CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_last_count_with_massn AS
select 
  tax.artname,
  ap.id as ap_id,
  pop.nr as pop_nr,
  pop.name as pop_name,
  pop.id as pop_id,
  psw.text as pop_status,
  tpop.nr as tpop_nr,
  tpop.gemeinde as tpop_gemeinde,
  tpop.flurname as tpop_flurname,
  tpsw.text as tpop_status,
  anzahl.*
from crosstab($$
  select tpop_id, jahr, zaehleinheit, anzahl
  from 
    (
      with nr_of_kontr as (
        select apflora.tpop.id, count(apflora.tpopkontr.id) as anzahl
        from 
          apflora.tpop
          left join apflora.tpopkontr
          on apflora.tpopkontr.tpop_id = apflora.tpop.id
        where
          apflora.tpop.apber_relevant is true
          and apflora.tpopkontr.apber_nicht_relevant is not true
        group by apflora.tpop.id
      ), letzte_ansiedlungen as (
        select distinct on (tpop1.id)
          tpop1.id as tpop_id,
          massn1.id as massn_id
        from
          apflora.tpopmassn massn1
          inner join apflora.tpop tpop1
          on tpop1.id = massn1.tpop_id
          inner join apflora.tpopmassn_typ_werte
          on apflora.tpopmassn_typ_werte.code = massn1.typ
        where
          tpop1.apber_relevant is true
          and massn1.jahr is not null
          and tpopmassn_typ_werte.ansiedlung = true
          and (
            massn1.anz_triebe is not null
            or massn1.anz_pflanzen is not null
            or massn1.anz_pflanzstellen is not null
            or massn1.zieleinheit_anzahl is not null
          )
        order by
          tpop1.id,
          massn1.jahr desc,
          massn1.datum desc

      )
      -- 1. get zieleinheit from massnahmen counts
      select * from (
        select distinct on (tpop2.id)
          tpop2.id as tpop_id,
          massn0.jahr,
          massn0zieleinheitwerte.text as zaehleinheit,
          massn0.zieleinheit_anzahl as anzahl
        from
          apflora.tpopmassn massn0
          inner join apflora.tpopkontrzaehl_einheit_werte massn0zieleinheitwerte
          on massn0zieleinheitwerte.code = massn0.zieleinheit_einheit
          inner join letzte_ansiedlungen
          on letzte_ansiedlungen.massn_id = massn0.id and letzte_ansiedlungen.tpop_id = massn0.tpop_id
          inner join apflora.tpop tpop2
            inner join nr_of_kontr
            on nr_of_kontr.id = tpop2.id
          on tpop2.id = massn0.tpop_id
        where
          tpop2.apber_relevant is true
          and massn0.jahr is not null
          and tpop2.status in (200, 201)
          and nr_of_kontr.anzahl = 0
          and massn0.zieleinheit_anzahl is not null
        order by
          tpop2.id,
          massn0.jahr desc,
          massn0.datum desc
      ) as triebe
      -- 2. get anz_triebe from massnahmen counts
      union
      select * from (
        select distinct on (tpop2.id)
          tpop2.id as tpop_id,
          massn2.jahr,
          'Triebe total' as zaehleinheit,
          massn2.anz_triebe as anzahl
        from
          apflora.tpopmassn massn2
          inner join letzte_ansiedlungen
          on letzte_ansiedlungen.massn_id = massn2.id and letzte_ansiedlungen.tpop_id = massn2.tpop_id
          inner join apflora.tpop tpop2
            inner join nr_of_kontr
            on nr_of_kontr.id = tpop2.id
          on tpop2.id = massn2.tpop_id
        where
          tpop2.apber_relevant is true
          and massn2.jahr is not null
          and tpop2.status in (200, 201)
          and nr_of_kontr.anzahl = 0
          and massn2.anz_triebe is not null
        order by
          tpop2.id,
          massn2.jahr desc,
          massn2.datum desc
      ) as triebe
      union
      -- 3. get anz_pflanzen from massnahmen counts
      select * from (
        select distinct on (tpop3.id)
          tpop3.id as tpop_id,
          massn3.jahr,
          'Pflanzen total' as zaehleinheit,
          massn3.anz_pflanzen as anzahl
        from
          apflora.tpopmassn massn3
          inner join letzte_ansiedlungen
          on letzte_ansiedlungen.massn_id = massn3.id and letzte_ansiedlungen.tpop_id = massn3.tpop_id
          inner join apflora.tpop tpop3
            inner join nr_of_kontr
            on nr_of_kontr.id = tpop3.id
          on tpop3.id = massn3.tpop_id
        where
          tpop3.apber_relevant is true
          and massn3.jahr is not null
          and tpop3.status in (200, 201)
          and nr_of_kontr.anzahl = 0
          and massn3.anz_pflanzen is not null
        order by
          tpop3.id,
          massn3.jahr desc,
          massn3.datum desc
      ) as pflanzen
      union
      -- 3. get anz_pflanzstellen from massnahmen counts
      select * from (
        select distinct on (tpop4.id)
          tpop4.id as tpop_id,
          massn4.jahr,
          'Pflanzstellen' as zaehleinheit,
          massn4.anz_pflanzstellen as anzahl
        from
          apflora.tpopmassn massn4
          inner join letzte_ansiedlungen
          on letzte_ansiedlungen.massn_id = massn4.id and letzte_ansiedlungen.tpop_id = massn4.tpop_id
          inner join apflora.tpop tpop4
            inner join nr_of_kontr
            on nr_of_kontr.id = tpop4.id
          on tpop4.id = massn4.tpop_id
        where
          tpop4.apber_relevant is true
          and massn4.jahr is not null
          and tpop4.status in (200, 201)
          and nr_of_kontr.anzahl = 0
          and massn4.anz_pflanzstellen is not null
        order by
          tpop4.id,
          massn4.jahr desc,
          massn4.datum desc
      ) as pflanzstellen
      -- 3. get all einheits from tpopkontr counts
      union
      select * from (
        select distinct on (tpop5.id, apflora.tpopkontrzaehl_einheit_werte.text)
          tpop5.id as tpop_id,
          kontr5.jahr,
          apflora.tpopkontrzaehl_einheit_werte.text as zaehleinheit,
          zaehl5.anzahl
        from
          apflora.tpopkontrzaehl zaehl5
          inner join apflora.tpopkontrzaehl_einheit_werte
          on apflora.tpopkontrzaehl_einheit_werte.code = zaehl5.einheit
          inner join apflora.tpopkontr kontr5
            inner join apflora.tpop tpop5
            on tpop5.id = kontr5.tpop_id
          on zaehl5.tpopkontr_id = kontr5.id
        where
          tpop5.apber_relevant is true
          -- nur Kontrollen mit Jahr berücksichtigen
          and kontr5.jahr is not null
          and kontr5.apber_nicht_relevant is not true
          -- nur Zählungen mit Anzahl berücksichtigen
          and zaehl5.anzahl is not null
          and kontr5.id = (
            select
              kontr6.id
            from
              apflora.tpopkontrzaehl zaehl6
              inner join apflora.tpopkontr kontr6
                inner join apflora.tpop tpop6
                on tpop6.id = kontr6.tpop_id
              on zaehl6.tpopkontr_id = kontr6.id
            where
              tpop6.apber_relevant is true
              and kontr6.jahr is not null
              and kontr6.apber_nicht_relevant is not true
              and zaehl6.anzahl is not null
              and kontr6.tpop_id = tpop5.id
            order by
              kontr6.jahr desc,
              kontr6.datum desc
            limit 1
          )
        order by
          tpop5.id,
          apflora.tpopkontrzaehl_einheit_werte.text,
          kontr5.jahr desc,
          kontr5.datum desc
      ) as others
    ) as tbl
  order by 1,2,3
  $$,
  $$SELECT unnest('{Pflanzen total, Pflanzen (ohne Jungpflanzen), Triebe total, Triebe Beweidung, Keimlinge, davon Rosetten, Jungpflanzen, Blätter, davon blühende Pflanzen, davon blühende Triebe, Blüten, Fertile Pflanzen, fruchtende Triebe, Blütenstände, Fruchtstände, Gruppen, Deckung (%), Pflanzen/5m2, Triebe in 30 m2, Triebe/50m2, Triebe Mähfläche, Fläche (m2), Pflanzstellen, Stellen, andere Zaehleinheit, Art ist vorhanden}'::text[])$$
) as anzahl ("tpop_id" uuid, "jahr" integer, "Pflanzen total" integer, "Pflanzen (ohne Jungpflanzen)" integer, "Triebe total" integer, "Triebe Beweidung" integer, "Keimlinge" integer, "davon Rosetten" integer, "Jungpflanzen" integer, "Blätter" integer, "davon blühende Pflanzen" integer, "davon blühende Triebe" integer, "Blüten" integer, "Fertile Pflanzen" integer, "fruchtende Triebe" integer, "Blütenstände" integer, "Fruchtstände" integer, "Gruppen" integer, "Deckung (%)" integer, "Pflanzen/5m2" integer, "Triebe in 30 m2" integer, "Triebe/50m2" integer, "Triebe Mähfläche" integer, "Fläche (m2)" integer, "Pflanzstellen" integer, "Stellen" integer, "andere Zaehleinheit" integer, "Art ist vorhanden" text)
inner join apflora.tpop tpop
  inner join apflora.pop_status_werte tpsw
  on tpsw.code = tpop.status
  inner join apflora.pop pop
    inner join apflora.pop_status_werte psw
    on psw.code = pop.status
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
comment on view apflora.v_tpop_last_count_with_massn is '@foreignKey (tpop_id) references tpop (id)';

-- used in form ap
-- 2021.01.03: not in use any more
DROP VIEW IF EXISTS apflora.v_ap_ausw_pop_status CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_ausw_pop_status AS
with data as (
  select
    ap_id,
    year,
    status,
    count(*) as anzahl
    from
      apflora.pop_history pop
    where 
      status is not null
      and exists (
        select
          1 
        from 
          apflora.tpop_history tpop 
        where
          tpop.apber_relevant = true
          and tpop.pop_id = pop.id
          and tpop.year = pop.year
      )
    group by
      ap_id,
      year,
      status
    order by
      ap_id,
      year,
      status
)
select
  ap_id,
  year as jahr,
  json_object_agg(status, anzahl) as values
from data
group by ap_id, year
order by ap_id, year;

-- refresh materialized view apflora.v_ap_ausw_pop_menge;
-- ACHTUNG: Original dieses Views in 2020-03-26_zielrelev_einheit_pro_pop_und_jahr.sql > 2021-02-04_zielrelev_einheit_pro_pop_und_jahr
DROP materialized VIEW IF EXISTS apflora.v_ap_ausw_pop_menge CASCADE;
CREATE materialized VIEW apflora.v_ap_ausw_pop_menge AS
with
massnjahre as (
  select distinct on (tpop0.id, massn0.jahr)
    tpop0.id as tpop_id,
    massn0.jahr,
    massn0.zieleinheit_anzahl as anzahl
  from 
    apflora.tpopmassn massn0
      inner join apflora.tpopmassn_typ_werte tw
      on tw.code = massn0.typ and tw.anpflanzung = true
    inner join apflora.tpop_history tpop0
      inner join apflora.pop_history pop0
        inner join apflora.ap_history ap0
          inner join apflora.ekzaehleinheit ekze0
            inner join apflora.tpopkontrzaehl_einheit_werte ze0
            on ze0.id = ekze0.zaehleinheit_id
          on ekze0.ap_id = ap0.id and ekze0.zielrelevant = true
        on ap0.id = pop0.ap_id and ap0.year = pop0.year
      on pop0.id = tpop0.pop_id and pop0.year = tpop0.year
    on tpop0.id = massn0.tpop_id and tpop0.year = massn0.jahr
  where
    massn0.jahr is not null
    and tpop0.status in (200, 201)
    and tpop0.apber_relevant = true
    and massn0.zieleinheit_einheit = ze0.code
    and massn0.zieleinheit_anzahl is not null
  order by
    tpop0.id,
    massn0.jahr desc,
    massn0.datum desc
),
zaehljahre as (
  select distinct on (tpop2.id, kontr2.jahr)
    tpop2.id as tpop_id,
    kontr2.jahr,
    zaehl2.anzahl
  from
    apflora.tpopkontrzaehl zaehl2
    inner join apflora.tpopkontr kontr2
      inner join apflora.tpop_history tpop2
        inner join apflora.pop_history pop2
          inner join apflora.ap_history ap2
            inner join apflora.ekzaehleinheit ekze2
              inner join apflora.tpopkontrzaehl_einheit_werte ze2
              on ze2.id = ekze2.zaehleinheit_id
            on ekze2.ap_id = ap2.id and ekze2.zielrelevant = true
          on ap2.id = pop2.ap_id and ap2.year = pop2.year
        on pop2.id = tpop2.pop_id and pop2.year = tpop2.year
      on tpop2.id = kontr2.tpop_id and tpop2.year = kontr2.jahr
    on zaehl2.tpopkontr_id = kontr2.id and zaehl2.einheit = ze2.code
  where
    kontr2.jahr is not null
    and tpop2.status in (100, 200, 201)
    and tpop2.apber_relevant = true
    and zaehl2.anzahl is not null
    -- nur Zählungen mit der Ziel-Einheit
    and ze2.code = zaehl2.einheit
  order by
    tpop2.id,
    kontr2.jahr desc,
    kontr2.datum desc
),
tpop_letzte_menge as (
  select
    tpop3.id as tpop_id,
    tpop3.year as jahr,
    case
      when zj.jahr is not null and mj.jahr is not null and zj.jahr >= mj.jahr then zj.anzahl
      when zj.jahr is not null and mj.jahr is not null and zj.jahr < mj.jahr then mj.anzahl
      when zj.jahr is not null then zj.anzahl
      when mj.jahr is not null then mj.anzahl
      else null
    end as anzahl
    from
      apflora.tpop_history as tpop3
      left join massnjahre as mj
      on mj.tpop_id = tpop3.id and mj.jahr = (select max(jahr) from massnjahre where massnjahre.jahr <= tpop3.year and massnjahre.tpop_id = tpop3.id)
      left join zaehljahre as zj
      on zj.tpop_id = tpop3.id and zj.jahr = (select max(jahr) from zaehljahre where zaehljahre.jahr <= tpop3.year and zaehljahre.tpop_id = tpop3.id)
    order by
      tpop3.id,
      tpop3.year
),
pop_data as (
  select
    ap4.id as ap_id,
    pop4.year as jahr,
    pop4.id as pop_id,
    sum(anzahl) as anzahl
  from 
    tpop_letzte_menge tplm
    inner join apflora.tpop_history tpop4
      inner join apflora.pop_history pop4
        inner join apflora.ap_history ap4
        on ap4.id = pop4.ap_id and ap4.year = pop4.year
      on pop4.id = tpop4.pop_id and pop4.year = tpop4.year
    on tpop4.id = tplm.tpop_id and tpop4.year = tplm.jahr
  where
    pop4.status in (100, 200, 201)
	  and tplm.anzahl is not null
    and pop4.bekannt_seit <= pop4.year
    and tpop4.bekannt_seit <= tpop4.year
    and tpop4.apber_relevant = true
  group by
    ap4.id,
    pop4.year,
    pop4.id
  order by
    ap4.id,
    pop4.year
)
select
  ap_id,
  jahr,
  json_object_agg(pop_id, anzahl) as values
from pop_data
group by ap_id, jahr
order by ap_id, jahr;

-- Achtung: Das Original dieses Views is hier: 2020-03-27_tpop_kontrolliert_pro_jahr.sql
-- used in form ap
DROP VIEW IF EXISTS apflora.v_ap_ausw_tpop_kontrolliert CASCADE;
CREATE VIEW apflora.v_ap_ausw_tpop_kontrolliert AS
with
anpflanz as (
  select distinct on (tpop0.id, massn0.jahr)
    tpop0.id as tpop_id,
    massn0.jahr
  from 
    apflora.tpopmassn massn0
      inner join apflora.tpopmassn_typ_werte tw
      on tw.code = massn0.typ and tw.anpflanzung = true
    inner join apflora.tpop_history tpop0
      inner join apflora.pop_history pop0
        inner join apflora.ap_history ap0
          inner join apflora.ekzaehleinheit ekze0
            inner join apflora.tpopkontrzaehl_einheit_werte ze0
            on ze0.id = ekze0.zaehleinheit_id
          on ekze0.ap_id = ap0.id and ekze0.zielrelevant = true
        on ap0.id = pop0.ap_id and ap0.year = pop0.year
      on pop0.id = tpop0.pop_id and pop0.year = tpop0.year
    on tpop0.id = massn0.tpop_id and tpop0.year = massn0.jahr
  where
    massn0.jahr is not null
    and tpop0.status in (200, 201)
    and tpop0.apber_relevant = true
    and massn0.zieleinheit_einheit = ze0.code
    and massn0.zieleinheit_anzahl is not null
  order by
    tpop0.id,
    massn0.jahr desc
),
kontr as (
  select distinct on (tpop2.id, kontr2.jahr)
    tpop2.id as tpop_id,
    kontr2.jahr
  from
    apflora.tpopkontrzaehl zaehl2
    inner join apflora.tpopkontr kontr2
      inner join apflora.tpop_history tpop2
        inner join apflora.pop_history pop2
          inner join apflora.ap_history ap2
            inner join apflora.ekzaehleinheit ekze2
              inner join apflora.tpopkontrzaehl_einheit_werte ze2
              on ze2.id = ekze2.zaehleinheit_id
            on ekze2.ap_id = ap2.id and ekze2.zielrelevant = true
          on ap2.id = pop2.ap_id and ap2.year = pop2.year
        on pop2.id = tpop2.pop_id and pop2.year = tpop2.year
      on tpop2.id = kontr2.tpop_id and tpop2.year = kontr2.jahr
    on zaehl2.tpopkontr_id = kontr2.id and zaehl2.einheit = ze2.code
  where
    -- Jahr muss existieren
    kontr2.jahr is not null
    -- nur aktuelle Stati
    and tpop2.status in (100, 200, 201)
    -- nur von berichts-relevanten tpop
    and tpop2.apber_relevant = true
    -- nur wenn eine Anzahl erfasst wurde
    and zaehl2.anzahl is not null
    -- nur wenn die Ziel-Einheit erfasst wurde
    and ze2.code = zaehl2.einheit
  order by
    tpop2.id,
    kontr2.jahr desc
),
kontr_oder_anpflanz as (
  select * from kontr
  union select * from anpflanz
),
tpop_data as (
  select
    ap4.id as ap_id,
    pop4.year as jahr,
    tpop4.id as tpop_id,
    case
      when koa.tpop_id is not null then 1
      else 0
    end as kontrolliert
  from 
    kontr_oder_anpflanz koa
    right join apflora.tpop_history tpop4
      inner join apflora.pop_history pop4
        inner join apflora.ap_history ap4
        on ap4.id = pop4.ap_id and ap4.year = pop4.year
      on pop4.id = tpop4.pop_id and pop4.year = tpop4.year
    on tpop4.id = koa.tpop_id and tpop4.year = koa.jahr
  where
    pop4.status in (100, 200, 201)
    and tpop4.status in (100, 200, 201)
    and tpop4.apber_relevant = true
  order by
    ap4.id,
    pop4.year
)
select
  ap_id,
  jahr,
  count(tpop_id)::int as anzahl_tpop,
  sum(kontrolliert)::int as anzahl_kontrolliert
from tpop_data
group by
  ap_id,
  jahr
order by
  ap_id,
  jahr;

-- original was created here: 2020-04-09_qk_tpop_mit_kontr_keine_zielrelev_einheit.sql
DROP VIEW IF EXISTS apflora.v_q_ap_mit_aktuellen_kontrollen_ohne_zielrelevante_einheit CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_ap_mit_aktuellen_kontrollen_ohne_zielrelevante_einheit AS
with ap_mit_zielrelevanter_zaehleinheit as (
  select distinct apflora.ap.id
  from
    apflora.ap
    inner join apflora.ekzaehleinheit
    on apflora.ekzaehleinheit.ap_id = apflora.ap.id
  where
    apflora.ekzaehleinheit.zielrelevant = true
),
ap_ohne_zielrelevante_zaehleinheit as (
  select distinct apflora.ap.id
  from
    apflora.ap
    left join ap_mit_zielrelevanter_zaehleinheit
    on ap_mit_zielrelevanter_zaehleinheit.id = apflora.ap.id
  where ap_mit_zielrelevanter_zaehleinheit.id is null
),
tpop_mit_aktuellen_kontrollen_ohne_zielrelevante_zaehleinheit as (
  select distinct
    apflora.tpop.id
  from
    apflora.tpop
    inner join apflora.tpopkontr
    on apflora.tpop.id = apflora.tpopkontr.tpop_id
    inner join apflora.pop
      inner join ap_ohne_zielrelevante_zaehleinheit
      on ap_ohne_zielrelevante_zaehleinheit.id = apflora.pop.ap_id
    on apflora.pop.id = apflora.tpop.pop_id
  where
    apflora.tpopkontr.jahr = date_part('year', CURRENT_DATE)
)
SELECT distinct
  apflora.projekt.id as proj_id,
  apflora.ap.id as ap_id
FROM
  apflora.projekt
  INNER JOIN apflora.ap
    INNER JOIN apflora.pop
      INNER JOIN apflora.tpop
        inner join tpop_mit_aktuellen_kontrollen_ohne_zielrelevante_zaehleinheit
        on tpop_mit_aktuellen_kontrollen_ohne_zielrelevante_zaehleinheit.id = apflora.tpop.id
      ON apflora.tpop.pop_id = apflora.pop.id
    ON apflora.pop.ap_id = apflora.ap.id
  ON apflora.projekt.id = apflora.ap.proj_id
ORDER BY
  apflora.projekt.id,
  apflora.ap.id;

-- original was created here: 2020-04-09_qk_tpop_mit_kontr_keine_zielrelev_einheit.sql
DROP VIEW IF EXISTS apflora.v_q_tpop_mit_aktuellen_kontrollen_ohne_zielrelevante_einheit CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_tpop_mit_aktuellen_kontrollen_ohne_zielrelevante_einheit AS
with zielrelevante_zaehleinheit_pro_ap as (
  select
    apflora.ap.id,
    apflora.tpopkontrzaehl_einheit_werte.code as zaehleinheit_code
  from
    apflora.ap
    left join apflora.ekzaehleinheit
      inner join apflora.tpopkontrzaehl_einheit_werte
      on apflora.tpopkontrzaehl_einheit_werte.id = apflora.ekzaehleinheit.zaehleinheit_id
    on apflora.ekzaehleinheit.ap_id = apflora.ap.id and apflora.ekzaehleinheit.zielrelevant = true
),
tpop_mit_aktuellen_kontrollen as (
  select distinct
    apflora.tpop.id
  from
    apflora.tpop
    inner join apflora.tpopkontr
    on apflora.tpop.id = apflora.tpopkontr.tpop_id
  where
    apflora.tpopkontr.jahr = date_part('year', CURRENT_DATE)
),
tpop_mit_aktuellen_kontrollen_zielrelevanter_einheit as (
  select distinct
    apflora.tpop.id
  from
    apflora.tpop
    inner join apflora.tpopkontr
      inner join apflora.tpopkontrzaehl
      on apflora.tpopkontrzaehl.tpopkontr_id = apflora.tpopkontr.id
    on apflora.tpop.id = apflora.tpopkontr.tpop_id
    inner join apflora.pop
      inner join zielrelevante_zaehleinheit_pro_ap
      on zielrelevante_zaehleinheit_pro_ap.id = apflora.pop.ap_id
    on apflora.pop.id = apflora.tpop.pop_id
  where
    apflora.tpopkontr.jahr = date_part('year', CURRENT_DATE)
    and apflora.tpopkontrzaehl.einheit = zielrelevante_zaehleinheit_pro_ap.zaehleinheit_code
),
tpop_ohne_aktuelle_kontrollen_zielrelevanter_einheit as (
  select
    tpop_mit_aktuellen_kontrollen.id 
  from 
    tpop_mit_aktuellen_kontrollen
    left join tpop_mit_aktuellen_kontrollen_zielrelevanter_einheit
    on tpop_mit_aktuellen_kontrollen_zielrelevanter_einheit.id = tpop_mit_aktuellen_kontrollen.id
  where
    tpop_mit_aktuellen_kontrollen_zielrelevanter_einheit is null
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
  INNER JOIN apflora.ap
    INNER JOIN apflora.pop
      INNER JOIN apflora.tpop
        inner join tpop_ohne_aktuelle_kontrollen_zielrelevanter_einheit
        on tpop_ohne_aktuelle_kontrollen_zielrelevanter_einheit.id = apflora.tpop.id
      ON apflora.pop.id = apflora.tpop.pop_id
    ON apflora.ap.id = apflora.pop.ap_id
  ON apflora.projekt.id = apflora.ap.proj_id
ORDER BY
  apflora.pop.nr,
  apflora.tpop.nr;

-- the original is here: 2021-01-08_tpop_mit_aktuellen_anpflanzungen_ohne_zielrelevante_einheit.sql
DROP VIEW IF EXISTS apflora.v_q_tpop_mit_aktuellen_anpflanzungen_ohne_zielrelevante_einheit CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_tpop_mit_aktuellen_anpflanzungen_ohne_zielrelevante_einheit AS
with tpop_mit_aktuellen_anpflanzungen as (
  select distinct
    apflora.tpop.id
  from
    apflora.tpop
    inner join apflora.tpopmassn
      inner join apflora.tpopmassn_typ_werte
      on apflora.tpopmassn_typ_werte.code = apflora.tpopmassn.typ
    on apflora.tpop.id = apflora.tpopmassn.tpop_id
  where
    apflora.tpopmassn.jahr = date_part('year', CURRENT_DATE)
    and apflora.tpopmassn_typ_werte.anpflanzung = true
    and (
      apflora.tpopmassn.zieleinheit_einheit is null
      or apflora.tpopmassn.zieleinheit_anzahl is null
    )
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
  INNER JOIN apflora.ap
    INNER JOIN apflora.pop
      INNER JOIN apflora.tpop
        inner join tpop_mit_aktuellen_anpflanzungen
        on tpop_mit_aktuellen_anpflanzungen.id = apflora.tpop.id
      ON apflora.pop.id = apflora.tpop.pop_id
    ON apflora.ap.id = apflora.pop.ap_id
  ON apflora.projekt.id = apflora.ap.proj_id
ORDER BY
  apflora.pop.nr,
  apflora.tpop.nr;

-- the original of this view is here:
-- 2020-04-12_ap_pop_ek_prio.sql
DROP VIEW IF EXISTS apflora.v_ap_pop_ek_prio CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_pop_ek_prio AS
with last_year as (
  select distinct year
  from apflora.ap_history
  order by year desc
  limit 1
), previous_year as (
  select distinct year
  from apflora.ap_history
  order by year desc
  limit 1
  offset 1
),
count_urspr_last as (
  select
    apflora.pop_history.ap_id,
    count(apflora.pop_history.id) as anzahl
  from
    last_year, 
    apflora.pop_history
  where
    apflora.pop_history.year = last_year.year
    and apflora.pop_history.status = 100
    and exists (
      select * from apflora.tpop_history
      where
        apflora.tpop_history.pop_id = apflora.pop_history.id
        and apflora.tpop_history.year = last_year.year
        and apflora.tpop_history.apber_relevant = true
    )
  group by
    apflora.pop_history.ap_id
),
count_anges_last as (
  select
    apflora.pop_history.ap_id,
    count(apflora.pop_history.id) as anzahl
  from
    last_year, 
    apflora.pop_history
  where
    apflora.pop_history.year = last_year.year
    and apflora.pop_history.status = 200
    and exists (
      select * from apflora.tpop_history
      where
        apflora.tpop_history.pop_id = apflora.pop_history.id
        and apflora.tpop_history.year = last_year.year
        and apflora.tpop_history.apber_relevant = true
    )
  group by
    apflora.pop_history.ap_id
),
count_urspr_prev as (
  select
    apflora.pop_history.ap_id,
    count(apflora.pop_history.id) as anzahl
  from
    last_year, 
    apflora.pop_history
  where
    apflora.pop_history.year = last_year.year
    and apflora.pop_history.status = 100
    and exists (
      select * from apflora.tpop_history
      where
        apflora.tpop_history.pop_id = apflora.pop_history.id
        and apflora.tpop_history.year = last_year.year
        and apflora.tpop_history.apber_relevant = true
    )
  group by
    apflora.pop_history.ap_id
),
count_anges_prev as (
  select
    apflora.pop_history.ap_id,
    count(apflora.pop_history.id) as anzahl
  from
    last_year, 
    apflora.pop_history
  where
    apflora.pop_history.year = last_year.year
    and apflora.pop_history.status = 200
    and exists (
      select * from apflora.tpop_history
      where
        apflora.tpop_history.pop_id = apflora.pop_history.id
        and apflora.tpop_history.year = last_year.year
        and apflora.tpop_history.apber_relevant = true
    )
  group by
    apflora.pop_history.ap_id
),
count_total_prev as (
  select
    apflora.pop_history.ap_id,
    count(apflora.pop_history.id) as anzahl
  from
    last_year, 
    apflora.pop_history
  where
    apflora.pop_history.year = last_year.year
    and apflora.pop_history.status in (100, 200)
    and exists (
      select * from apflora.tpop_history
      where
        apflora.tpop_history.pop_id = apflora.pop_history.id
        and apflora.tpop_history.year = last_year.year
        and apflora.tpop_history.apber_relevant = true
    )
  group by
    apflora.pop_history.ap_id
)
select
  apflora.ap_history.id as ap_id,
  apflora.ae_taxonomies.artname,
  previous_year.year as jahr_zuvor,
  last_year.year as jahr_zuletzt,
  coalesce(count_urspr_prev.anzahl, 0) as anz_pop_urspr_zuvor,
  coalesce(count_anges_prev.anzahl, 0) as anz_pop_anges_zuvor,
  coalesce(count_urspr_prev.anzahl, 0) + coalesce(count_anges_prev.anzahl, 0) as anz_pop_aktuell_zuvor,
  coalesce(count_urspr_last.anzahl, 0) as anz_pop_urspr_zuletzt,
  coalesce(count_anges_last.anzahl, 0) as anz_pop_anges_zuletzt,
  coalesce(count_urspr_last.anzahl, 0) + coalesce(count_anges_last.anzahl, 0) as anz_pop_aktuell_zuletzt,
  coalesce(count_urspr_last.anzahl, 0) - coalesce(count_urspr_prev.anzahl, 0) as diff_pop_urspr,
  coalesce(count_anges_last.anzahl, 0) - coalesce(count_anges_prev.anzahl, 0) as diff_pop_anges,
  (coalesce(count_urspr_last.anzahl, 0) + coalesce(count_anges_last.anzahl, 0)) - (coalesce(count_urspr_prev.anzahl, 0) + coalesce(count_anges_prev.anzahl, 0)) as diff_pop_aktuell,
  apflora.ap_erfkrit_werte.text as beurteilung_zuletzt
from
  last_year, 
  previous_year,
  apflora.ap_history
  inner join apflora.ae_taxonomies
  on apflora.ae_taxonomies.id = apflora.ap_history.art_id
  left join apflora.apber
    left join apflora.ap_erfkrit_werte
    on apflora.ap_erfkrit_werte.code = apflora.apber.beurteilung
  on apflora.apber.ap_id = apflora.ap_history.id
  left join count_urspr_last
  on count_urspr_last.ap_id = apflora.ap_history.id
  left join count_anges_last
  on count_anges_last.ap_id = apflora.ap_history.id
  left join count_urspr_prev
  on count_urspr_prev.ap_id = apflora.ap_history.id
  left join count_anges_prev
  on count_anges_prev.ap_id = apflora.ap_history.id
where
  apflora.ap_history.bearbeitung < 4
  and apflora.ap_history.year = last_year.year
  and (apflora.apber.jahr = last_year.year or apflora.apber.jahr is null)
order by
  apflora.ae_taxonomies.artname;
comment on view apflora.v_ap_pop_ek_prio is '@foreignKey (ap_id) references ap (id)';


-- original of this view is here: 2021-01-25_ek-planung_nach_abrechnungstyp_3.sql
DROP VIEW IF EXISTS apflora.v_ek_planung_nach_abrechnungstyp CASCADE;
CREATE OR REPLACE VIEW apflora.v_ek_planung_nach_abrechnungstyp AS
with data as (
  select
    ap.id,
    ekplan.jahr,
    ek_abrechnungstyp_werte.code as ek_abrechnungstyp,
    count(ekplan.id)::int as anzahl
  from
    apflora.ekplan ekplan
    inner join apflora.tpop tpop
      inner join apflora.pop pop
        inner join apflora.ap ap
          inner join apflora.ae_taxonomies tax
          on tax.id = ap.art_id
        on ap.id = pop.ap_id
      on pop.id = tpop.pop_id
    on tpop.id = ekplan.tpop_id
    inner join apflora.ekfrequenz ekfrequenz
      inner join apflora.ek_abrechnungstyp_werte ek_abrechnungstyp_werte
      on ek_abrechnungstyp_werte.code = ekfrequenz.ek_abrechnungstyp
    on tpop.ekfrequenz = ekfrequenz.id
  where
    tax.taxid > 150
  group by
    ap.id,
    ekplan.jahr,
    ek_abrechnungstyp_werte.code
)
select
  tax.artname,
  ap.id as ap_id,
  adresse.name as artverantwortlich,
  ekplan.jahr,
  (select anzahl from data where id = ap.id and jahr = ekplan.jahr and ek_abrechnungstyp = 'A') as A,
  (select anzahl from data where id = ap.id and jahr = ekplan.jahr and ek_abrechnungstyp = 'B') as B,
  (select anzahl from data where id = ap.id and jahr = ekplan.jahr and ek_abrechnungstyp = 'D') as D,
  (select anzahl from data where id = ap.id  and jahr = ekplan.jahr and ek_abrechnungstyp = 'EKF') as EKF
from
  apflora.ekplan ekplan
  inner join apflora.tpop tpop
    inner join apflora.pop pop
      inner join apflora.ap ap
        inner join apflora.ae_taxonomies tax
        on tax.id = ap.art_id
        left join apflora.adresse adresse
        on adresse.id = ap.bearbeiter
      on ap.id = pop.ap_id
    on pop.id = tpop.pop_id
  on tpop.id = ekplan.tpop_id
  inner join apflora.ekfrequenz ekfrequenz
    inner join apflora.ek_abrechnungstyp_werte ek_abrechnungstyp_werte
    on ek_abrechnungstyp_werte.code = ekfrequenz.ek_abrechnungstyp
  on tpop.ekfrequenz = ekfrequenz.id
where
  tax.taxid > 150
group by
  tax.artname,
  ap.id,
  adresse.name,
  ekplan.jahr
order by
  tax.artname,
  ekplan.jahr;

-- the original query is here: 2021-01-31_v_q_ekzieleinheit_ohne_massn_zaehleinheit.sql
DROP VIEW IF EXISTS apflora.v_q_anpflanzung_ohne_zielrelevante_einheit CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_anpflanzung_ohne_zielrelevante_einheit AS
select
  ap.proj_id,
  ap.id as ap_id,
  pop.id as pop_id,
  pop.nr as pop_nr,
  tpop.id as tpop_id,
  tpop.nr as tpop_nr,
  massn.id,
  massn.jahr
from apflora.tpopmassn massn
  inner join apflora.tpopmassn_typ_werte massn_typ
  on massn_typ.code = massn.typ
  inner join apflora.tpop tpop
    inner join apflora.pop pop
      inner join apflora.ap ap
        inner join apflora.ae_taxonomies tax
        on tax.id = ap.art_id
      on ap.id = pop.ap_id
    on pop.id = tpop.pop_id
  on massn.tpop_id = tpop.id
where
  massn.typ = 2
  and massn.zieleinheit_einheit is null
order by
  pop.nr,
  tpop.nr,
  massn.jahr;

-- the original view is here: 2021-02-01_qk_anpflanzung_zielrelevante_einheit_falsch.sql
DROP VIEW IF EXISTS apflora.v_q_anpflanzung_zielrelevante_einheit_falsch CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_anpflanzung_zielrelevante_einheit_falsch AS
select
  ap.proj_id,
  ap.id as ap_id,
  pop.id as pop_id,
  pop.nr as pop_nr,
  tpop.id as tpop_id,
  tpop.nr as tpop_nr,
  massn.id,
  massn.jahr,
  zaehl_einheit_werte.text as ek_zieleinheit,
  massn_einheit_werte.text as massn_zieleinheit
from apflora.tpopmassn massn
  inner join apflora.tpopmassn_typ_werte massn_typ
  on massn_typ.code = massn.typ
  inner join apflora.tpopkontrzaehl_einheit_werte massn_einheit_werte
  on massn_einheit_werte.code = massn.zieleinheit_einheit
  inner join apflora.tpop tpop
    inner join apflora.pop pop
      inner join apflora.ap ap
        inner join apflora.ae_taxonomies tax
        on tax.id = ap.art_id
        inner join apflora.ekzaehleinheit as ekzaehleinheit
          inner join apflora.tpopkontrzaehl_einheit_werte as zaehl_einheit_werte
          on zaehl_einheit_werte.id = ekzaehleinheit.zaehleinheit_id
        on ekzaehleinheit.ap_id = ap.id and ekzaehleinheit.zielrelevant = true
      on ap.id = pop.ap_id
    on pop.id = tpop.pop_id
  on massn.tpop_id = tpop.id
where
  massn.typ = 2
  and massn.zieleinheit_einheit <> zaehl_einheit_werte.code
  and ekzaehleinheit.not_massn_count_unit is false
order by
  tax.artname,
  pop.nr,
  tpop.nr,
  massn.jahr;


-- the original is here: 2021-02-01_anpflanzung_zielrelevante_anzahl_falsch.sql
DROP VIEW IF EXISTS apflora.v_q_anpflanzung_zielrelevante_anzahl_falsch CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_anpflanzung_zielrelevante_anzahl_falsch AS
with data as (
  select
    ap.proj_id,
    ap.id as ap_id,
    pop.id as pop_id,
    pop.nr as pop_nr,
    tpop.id as tpop_id,
    tpop.nr as tpop_nr,
    massn.id,
    massn.jahr,
    zaehl_einheit_werte.text as ek_zieleinheit,
    massn.zieleinheit_anzahl as zieleinheit_anzahl,
    case
      when zaehl_einheit_werte.corresponds_to_massn_anz_triebe = true then massn.anz_triebe
      when zaehl_einheit_werte.corresponds_to_massn_anz_pflanzen = true then massn.anz_pflanzen
    end as anzahl
  from apflora.tpopmassn massn
    inner join apflora.tpopmassn_typ_werte massn_typ
    on massn_typ.code = massn.typ
    inner join apflora.tpopkontrzaehl_einheit_werte massn_einheit_werte
    on massn_einheit_werte.code = massn.zieleinheit_einheit
    inner join apflora.tpop tpop
      inner join apflora.pop pop
        inner join apflora.ap ap
          inner join apflora.ae_taxonomies tax
          on tax.id = ap.art_id
          inner join apflora.ekzaehleinheit as ekzaehleinheit
            inner join apflora.tpopkontrzaehl_einheit_werte as zaehl_einheit_werte
            on zaehl_einheit_werte.id = ekzaehleinheit.zaehleinheit_id
          on ekzaehleinheit.ap_id = ap.id and ekzaehleinheit.zielrelevant = true
        on ap.id = pop.ap_id
      on pop.id = tpop.pop_id
    on massn.tpop_id = tpop.id
  where
    massn.typ = 2
    and massn.zieleinheit_einheit is not null
    and ekzaehleinheit.not_massn_count_unit is false
    and zaehl_einheit_werte.text = massn_einheit_werte.text
    and (
      (zaehl_einheit_werte.corresponds_to_massn_anz_triebe = true and massn.anz_triebe is not null)
      or (zaehl_einheit_werte.corresponds_to_massn_anz_pflanzen = true and massn.anz_pflanzen is not null)
    )
)
select
  *
from data
where
  zieleinheit_anzahl <> anzahl
  or (zieleinheit_anzahl is null and anzahl is not null)
  or (zieleinheit_anzahl is not null and anzahl is null)
order by
  pop_nr,
  tpop_nr,
  jahr;