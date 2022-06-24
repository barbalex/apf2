DROP VIEW IF EXISTS apflora.v_export_info_flora_beob CASCADE;

DROP VIEW IF EXISTS apflora.v_tpopkontr_webgisbun CASCADE;

DROP VIEW IF EXISTS apflora.v_tpop_erste_und_letzte_kontrolle_und_letzter_tpopber CASCADE;

DROP VIEW apflora.v_tpop_ekfrequenz_to_set;

DROP VIEW apflora.v_tpop_ekfrequenz_to_reset;

DROP VIEW IF EXISTS apflora.v_q_tpop_mitstatuspotentiellundzaehlungmitanzahl CASCADE;

DROP VIEW IF EXISTS apflora.v_q_tpop_mitstatusansaatversuchundzaehlungmitanzahl CASCADE;

DROP VIEW IF EXISTS apflora.v_q_tpop_erloschenundrelevantaberletztebeobvor1950 CASCADE;

DROP VIEW IF EXISTS apflora.v_pop_last_count CASCADE;

DROP VIEW IF EXISTS apflora.v_tpop_last_count CASCADE;

DROP VIEW IF EXISTS apflora.v_kontrzaehl_anzproeinheit CASCADE;

DROP VIEW IF EXISTS apflora.v_ap_ausw_tpop_kontrolliert CASCADE;

DROP MATERIALIZED VIEW IF EXISTS apflora.v_ap_ausw_pop_menge CASCADE;

ALTER TABLE apflora.tpopkontrzaehl
  ALTER COLUMN anzahl TYPE real;

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

CREATE OR REPLACE VIEW apflora.v_pop_last_count AS
SELECT
  artname,
  ap_id,
  pop_id,
  pop_nr,
  pop_name,
  pop_status,
  array_to_string(ARRAY (
      SELECT
        unnest(array_agg(jahr)) AS x GROUP BY x ORDER BY x), ', ') AS jahre,
  sum("Pflanzen total") AS "Pflanzen total",
  sum("Pflanzen (ohne Jungpflanzen)") AS "Pflanzen (ohne Jungpflanzen)",
  sum("Triebe total") AS "Triebe total",
  sum("Triebe Beweidung") AS "Triebe Beweidung",
  sum("Keimlinge") AS "Keimlinge",
  sum("davon Rosetten") AS "davon Rosetten",
  sum("Jungpflanzen") AS "Jungpflanzen",
  sum("Blätter") AS "Blätter",
  sum("davon blühende Pflanzen") AS "davon blühende Pflanzen",
  sum("davon blühende Triebe") AS "davon blühende Triebe",
  sum("Blüten") AS "Blüten",
  sum("Fertile Pflanzen") AS "Fertile Pflanzen",
  sum("fruchtende Triebe") AS "fruchtende Triebe",
  sum("Blütenstände") AS "Blütenstände",
  sum("Fruchtstände") AS "Fruchtstände",
  sum("Gruppen") AS "Gruppen",
  sum("Deckung (%)") AS "Deckung (%)",
  sum("Pflanzen/5m2") AS "Pflanzen/5m2",
  sum("Triebe in 30 m2") AS "Triebe in 30 m2",
  sum("Triebe/50m2") AS "Triebe/50m2",
  sum("Triebe Mähfläche") AS "Triebe Mähfläche",
  sum("Fläche (m2)") AS "Fläche (m2)",
  sum("Pflanzstellen") AS "Pflanzstellen",
  sum("Stellen") AS "Stellen",
  sum("andere Zaehleinheit") AS "andere Zaehleinheit",
  count("Art ist vorhanden") AS "Art ist vorhanden"
FROM
  apflora.v_tpop_last_count
GROUP BY
  artname,
  ap_id,
  pop_id,
  pop_nr,
  pop_name,
  pop_status
ORDER BY
  artname,
  pop_nr;

COMMENT ON VIEW apflora.v_pop_last_count IS '@foreignKey (pop_id) references pop (id)';

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

