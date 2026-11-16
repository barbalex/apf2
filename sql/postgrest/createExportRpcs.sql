-- export_* RPC family: server-side data assembly for the five multi-request
-- Exporte (Arten, Populationen, Teilpopulationen, Massnahmen, Kontrollen).
-- The v_export_* views join the hierarchy, decode the *_werte code tables,
-- resolve bearbeiter/ekf_kontrolleur names and AV emails and build the
-- "zaehlungen" string — everything the export components used to do in JS
-- over 2-14 requests. Column names are the quoted camelCase keys the JS row
-- objects had: they ARE the csv/xlsx headers, and the column ORDER is the
-- header order (getDataArrayFromExportObjects takes keys of the first row).
-- File serialization (xlsx/csv/kml) stays client-side (exportModule).
--
-- The RPCs mirror query_<table>: SECURITY INVOKER + security_invoker views,
-- so RLS scopes every role exactly as before; the filter jsonb compiles via
-- apflora.compile_filter against the base table alias tb.

-- functions first: they depend on the views, so they must drop first
DROP FUNCTION IF EXISTS apflora.export_ap(jsonb);
DROP FUNCTION IF EXISTS apflora.export_pop(jsonb);
DROP FUNCTION IF EXISTS apflora.export_tpop(jsonb);
DROP FUNCTION IF EXISTS apflora.export_tpopmassn(jsonb);
DROP FUNCTION IF EXISTS apflora.export_tpopkontr(jsonb);

DROP VIEW IF EXISTS apflora.v_export_ap;
DROP VIEW IF EXISTS apflora.v_export_pop;
DROP VIEW IF EXISTS apflora.v_export_tpop;
DROP VIEW IF EXISTS apflora.v_export_tpopmassn;
DROP VIEW IF EXISTS apflora.v_export_tpopkontr;

-- === ap / Arten =============================================================

CREATE OR REPLACE VIEW apflora.v_export_ap WITH (security_invoker = true) AS
SELECT
  a.id AS "id",
  tax.artname AS "artname",
  bw.text AS "bearbeitung",
  a.start_jahr AS "startJahr",
  uw.text AS "umsetzung",
  adr.name AS "avName",
  e.email AS "avEmail",
  a.created_at AS "createdAt",
  a.updated_at AS "updatedAt",
  a.changed_by AS "changedBy"
FROM apflora.ap a
LEFT JOIN apflora.ae_taxonomies tax ON tax.id = a.art_id
LEFT JOIN apflora.ap_bearbstand_werte bw ON bw.code = a.bearbeitung
LEFT JOIN apflora.ap_umsetzung_werte uw ON uw.code = a.umsetzung
LEFT JOIN apflora.adresse adr ON adr.id = a.bearbeiter
LEFT JOIN LATERAL (
  -- coalesce like the former JS (u.email ?? ''): an existing user with no
  -- email exports as '' — only a missing user row exports as null
  SELECT COALESCE(u.email, '') AS email
  FROM apflora."user" u
  WHERE u.adresse_id = a.bearbeiter
  LIMIT 1
) e ON true;
GRANT SELECT ON apflora.v_export_ap TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE FUNCTION apflora.export_ap(p_filter jsonb DEFAULT null)
RETURNS SETOF apflora.v_export_ap
LANGUAGE plpgsql
STABLE
AS $fn$
DECLARE
  v_where text;
BEGIN
  v_where := apflora.compile_filter('apflora.ap', 'tb', p_filter);
  RETURN QUERY EXECUTE format(
    'SELECT t.* FROM apflora.v_export_ap t JOIN apflora.ap tb ON tb.id = t.id WHERE (%s) ORDER BY t."artname" ASC NULLS FIRST',
    v_where
  );
END
$fn$;
REVOKE EXECUTE ON FUNCTION apflora.export_ap(jsonb) FROM public;
GRANT EXECUTE ON FUNCTION apflora.export_ap(jsonb) TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

-- === pop / Populationen =====================================================

CREATE OR REPLACE VIEW apflora.v_export_pop WITH (security_invoker = true) AS
SELECT
  a.id AS "apId",
  tax.artname AS "apArtname",
  bw.text AS "apBearbeitung",
  a.start_jahr AS "apStartJahr",
  uw.text AS "apUmsetzung",
  adr.name AS "avName",
  e.email AS "avEmail",
  p.id AS "id",
  p.nr AS "nr",
  p.name AS "name",
  sw.text AS "status",
  p.bekannt_seit AS "bekanntSeit",
  p.status_unklar AS "statusUnklar",
  p.status_unklar_begruendung AS "statusUnklarBegruendung",
  p.lv95_x AS "x",
  p.lv95_y AS "y",
  p.created_at AS "createdAt",
  p.updated_at AS "updatedAt",
  p.changed_by AS "changedBy"
FROM apflora.pop p
LEFT JOIN apflora.ap a ON a.id = p.ap_id
LEFT JOIN apflora.ae_taxonomies tax ON tax.id = a.art_id
LEFT JOIN apflora.ap_bearbstand_werte bw ON bw.code = a.bearbeitung
LEFT JOIN apflora.ap_umsetzung_werte uw ON uw.code = a.umsetzung
LEFT JOIN apflora.adresse adr ON adr.id = a.bearbeiter
LEFT JOIN LATERAL (
  -- coalesce like the former JS (u.email ?? ''): an existing user with no
  -- email exports as '' — only a missing user row exports as null
  SELECT COALESCE(u.email, '') AS email
  FROM apflora."user" u
  WHERE u.adresse_id = a.bearbeiter
  LIMIT 1
) e ON true
LEFT JOIN apflora.pop_status_werte sw ON sw.code = p.status;
GRANT SELECT ON apflora.v_export_pop TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE FUNCTION apflora.export_pop(p_filter jsonb DEFAULT null)
RETURNS SETOF apflora.v_export_pop
LANGUAGE plpgsql
STABLE
AS $fn$
DECLARE
  v_where text;
BEGIN
  v_where := apflora.compile_filter('apflora.pop', 'tb', p_filter);
  RETURN QUERY EXECUTE format(
    'SELECT t.* FROM apflora.v_export_pop t JOIN apflora.pop tb ON tb.id = t.id WHERE (%s) ORDER BY (SELECT apflora.ap_label(a) FROM apflora.ap a WHERE a.id = t."apId") ASC NULLS FIRST, t."nr" ASC NULLS FIRST',
    v_where
  );
END
$fn$;
REVOKE EXECUTE ON FUNCTION apflora.export_pop(jsonb) FROM public;
GRANT EXECUTE ON FUNCTION apflora.export_pop(jsonb) TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

-- === tpop / Teilpopulationen ================================================

CREATE OR REPLACE VIEW apflora.v_export_tpop WITH (security_invoker = true) AS
SELECT
  a.id AS "apId",
  tax.familie AS "apFamilie",
  tax.artname AS "apArtname",
  bw.text AS "apBearbeitung",
  a.start_jahr AS "apStartJahr",
  uw.text AS "apUmsetzung",
  adr.name AS "avName",
  e.email AS "avEmail",
  p.id AS "popId",
  p.nr AS "popNr",
  p.name AS "popName",
  psw.text AS "popStatus",
  p.bekannt_seit AS "popBekanntSeit",
  p.status_unklar AS "popStatusUnklar",
  p.status_unklar_begruendung AS "popStatusUnklarBegruendung",
  p.lv95_x AS "popX",
  p.lv95_y AS "popY",
  t.id AS "id",
  t.nr AS "nr",
  t.gemeinde AS "gemeinde",
  t.flurname AS "flurname",
  t.status AS "status",
  tsw.text AS "statusDecodiert",
  t.bekannt_seit AS "bekanntSeit",
  t.status_unklar AS "statusUnklar",
  t.status_unklar_grund AS "statusUnklarGrund",
  t.lv95_x AS "x",
  t.lv95_y AS "y",
  t.radius AS "radius",
  t.hoehe AS "hoehe",
  t.exposition AS "exposition",
  t.klima AS "klima",
  t.neigung AS "neigung",
  t.beschreibung AS "beschreibung",
  t.kataster_nr AS "katasterNr",
  t.apber_relevant AS "apberRelevant",
  t.apber_relevant_grund AS "apberRelevantGrund",
  t.eigentuemer AS "eigentuemer",
  t.kontakt AS "kontakt",
  t.nutzungszone AS "nutzungszone",
  t.bewirtschafter AS "bewirtschafter",
  t.bewirtschaftung AS "bewirtschaftung",
  t.ekfrequenz AS "ekfrequenz",
  t.ekfrequenz_abweichend AS "ekfrequenzAbweichend",
  kadr.name AS "ekfKontrolleur",
  t.created_at AS "createdAt",
  t.updated_at AS "updatedAt",
  t.changed_by AS "changedBy",
  CASE
    WHEN a.start_jahr IS NOT NULL AND a.start_jahr <> 0
      AND t.bekannt_seit IS NOT NULL AND t.bekannt_seit <> 0
      AND t.status IN (200, 201, 202)
    THEN a.start_jahr <= t.bekannt_seit
    ELSE NULL
  END AS "angesiedeltNachBeginnAp"
FROM apflora.tpop t
LEFT JOIN apflora.pop p ON p.id = t.pop_id
LEFT JOIN apflora.ap a ON a.id = p.ap_id
LEFT JOIN apflora.ae_taxonomies tax ON tax.id = a.art_id
LEFT JOIN apflora.ap_bearbstand_werte bw ON bw.code = a.bearbeitung
LEFT JOIN apflora.ap_umsetzung_werte uw ON uw.code = a.umsetzung
LEFT JOIN apflora.adresse adr ON adr.id = a.bearbeiter
LEFT JOIN LATERAL (
  -- coalesce like the former JS (u.email ?? ''): an existing user with no
  -- email exports as '' — only a missing user row exports as null
  SELECT COALESCE(u.email, '') AS email
  FROM apflora."user" u
  WHERE u.adresse_id = a.bearbeiter
  LIMIT 1
) e ON true
LEFT JOIN apflora.pop_status_werte psw ON psw.code = p.status
LEFT JOIN apflora.pop_status_werte tsw ON tsw.code = t.status
LEFT JOIN apflora.adresse kadr ON kadr.id = t.ekf_kontrolleur;
GRANT SELECT ON apflora.v_export_tpop TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE FUNCTION apflora.export_tpop(p_filter jsonb DEFAULT null)
RETURNS SETOF apflora.v_export_tpop
LANGUAGE plpgsql
STABLE
AS $fn$
DECLARE
  v_where text;
BEGIN
  v_where := apflora.compile_filter('apflora.tpop', 'tb', p_filter);
  RETURN QUERY EXECUTE format(
    'SELECT t.* FROM apflora.v_export_tpop t JOIN apflora.tpop tb ON tb.id = t.id WHERE (%s) ORDER BY t."apArtname" ASC NULLS FIRST, t."popNr" ASC NULLS FIRST, t."nr" ASC NULLS FIRST',
    v_where
  );
END
$fn$;
REVOKE EXECUTE ON FUNCTION apflora.export_tpop(jsonb) FROM public;
GRANT EXECUTE ON FUNCTION apflora.export_tpop(jsonb) TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

-- === tpopmassn / Massnahmen =================================================
-- shared parent block for the tpop-rooted exports: the hierarchy join with
-- decoded parents (pop status, ap werte, AV name/email)

CREATE OR REPLACE VIEW apflora.v_export_tpopmassn WITH (security_invoker = true) AS
SELECT
  a.id AS "apId",
  tax.familie AS "apFamilie",
  tax.artname AS "apArtname",
  bw.text AS "apBearbeitung",
  a.start_jahr AS "apStartJahr",
  uw.text AS "apUmsetzung",
  adr.name AS "avName",
  e.email AS "avEmail",
  p.id AS "popId",
  p.nr AS "popNr",
  p.name AS "popName",
  psw.text AS "popStatus",
  p.bekannt_seit AS "popBekanntSeit",
  p.status_unklar AS "popStatusUnklar",
  p.status_unklar_begruendung AS "popStatusUnklarBegruendung",
  p.lv95_x AS "popX",
  p.lv95_y AS "popY",
  t.id AS "tpopId",
  t.nr AS "tpopNr",
  t.gemeinde AS "tpopGemeinde",
  t.flurname AS "tpopFlurname",
  tsw.text AS "tpopStatus",
  t.bekannt_seit AS "tpopBekanntSeit",
  t.status_unklar AS "tpopStatusUnklar",
  t.status_unklar_grund AS "tpopStatusUnklarGrund",
  t.lv95_x AS "tpopX",
  t.lv95_y AS "tpopY",
  t.radius AS "tpopRadius",
  t.hoehe AS "tpopHoehe",
  t.exposition AS "tpopExposition",
  t.klima AS "tpopKlima",
  t.neigung AS "tpopNeigung",
  t.beschreibung AS "tpopBeschreibung",
  t.kataster_nr AS "tpopKatasterNr",
  t.apber_relevant AS "tpopApberRelevant",
  t.apber_relevant_grund AS "tpopApberRelevantGrund",
  t.eigentuemer AS "tpopEigentuemer",
  t.kontakt AS "tpopKontakt",
  t.nutzungszone AS "tpopNutzungszone",
  t.bewirtschafter AS "tpopBewirtschafter",
  t.bewirtschaftung AS "tpopBewirtschaftung",
  t.ekfrequenz AS "tpopEkfrequenz",
  t.ekfrequenz_abweichend AS "tpopEkfrequenzAbweichend",
  kadr.name AS "tpopEkfKontrolleur",
  m.id AS "id",
  m.jahr AS "jahr",
  m.datum AS "datum",
  mtw.text AS "typ",
  m.beschreibung AS "beschreibung",
  badr.name AS "bearbeiter",
  m.bemerkungen AS "bemerkungen",
  m.plan_vorhanden AS "planVorhanden",
  m.plan_bezeichnung AS "planBezeichnung",
  m.flaeche AS "flaeche",
  m.form AS "form",
  m.pflanzanordnung AS "pflanzanordnung",
  m.markierung AS "markierung",
  m.anz_triebe AS "anzTriebe",
  m.anz_pflanzen AS "anzPflanzen",
  m.anz_pflanzstellen AS "anzPflanzstellen",
  ew.text AS "zieleinheitEinheit",
  m.zieleinheit_anzahl AS "zieleinheitAnzahl",
  m.wirtspflanze AS "wirtspflanze",
  m.herkunft_pop AS "herkunftPop",
  m.sammeldatum AS "sammeldatum",
  m.von_anzahl_individuen AS "vonAnzahlIndividuen",
  m.created_at AS "createdAt",
  m.updated_at AS "updatedAt",
  m.changed_by AS "changedBy"
FROM apflora.tpopmassn m
LEFT JOIN apflora.tpop t ON t.id = m.tpop_id
LEFT JOIN apflora.pop p ON p.id = t.pop_id
LEFT JOIN apflora.ap a ON a.id = p.ap_id
LEFT JOIN apflora.ae_taxonomies tax ON tax.id = a.art_id
LEFT JOIN apflora.ap_bearbstand_werte bw ON bw.code = a.bearbeitung
LEFT JOIN apflora.ap_umsetzung_werte uw ON uw.code = a.umsetzung
LEFT JOIN apflora.adresse adr ON adr.id = a.bearbeiter
LEFT JOIN LATERAL (
  -- coalesce like the former JS (u.email ?? ''): an existing user with no
  -- email exports as '' — only a missing user row exports as null
  SELECT COALESCE(u.email, '') AS email
  FROM apflora."user" u
  WHERE u.adresse_id = a.bearbeiter
  LIMIT 1
) e ON true
LEFT JOIN apflora.pop_status_werte psw ON psw.code = p.status
LEFT JOIN apflora.pop_status_werte tsw ON tsw.code = t.status
LEFT JOIN apflora.adresse kadr ON kadr.id = t.ekf_kontrolleur
LEFT JOIN apflora.tpopmassn_typ_werte mtw ON mtw.code = m.typ
LEFT JOIN apflora.adresse badr ON badr.id = m.bearbeiter
LEFT JOIN apflora.tpopkontrzaehl_einheit_werte ew ON ew.code = m.zieleinheit_einheit;
GRANT SELECT ON apflora.v_export_tpopmassn TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE FUNCTION apflora.export_tpopmassn(p_filter jsonb DEFAULT null)
RETURNS SETOF apflora.v_export_tpopmassn
LANGUAGE plpgsql
STABLE
AS $fn$
DECLARE
  v_where text;
BEGIN
  v_where := apflora.compile_filter('apflora.tpopmassn', 'tb', p_filter);
  RETURN QUERY EXECUTE format(
    'SELECT t.* FROM apflora.v_export_tpopmassn t JOIN apflora.tpopmassn tb ON tb.id = t.id WHERE (%s) ORDER BY t."apArtname" ASC NULLS FIRST, t."popNr" ASC NULLS FIRST, t."tpopNr" ASC NULLS FIRST, t."datum" ASC NULLS FIRST',
    v_where
  );
END
$fn$;
REVOKE EXECUTE ON FUNCTION apflora.export_tpopmassn(jsonb) FROM public;
GRANT EXECUTE ON FUNCTION apflora.export_tpopmassn(jsonb) TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

-- === tpopkontr / Kontrollen =================================================

CREATE OR REPLACE VIEW apflora.v_export_tpopkontr WITH (security_invoker = true) AS
SELECT
  a.id AS "apId",
  tax.familie AS "apFamilie",
  tax.artname AS "apArtname",
  bw.text AS "apBearbeitung",
  a.start_jahr AS "apStartJahr",
  uw.text AS "apUmsetzung",
  adr.name AS "avName",
  e.email AS "avEmail",
  p.id AS "popId",
  p.nr AS "popNr",
  p.name AS "popName",
  psw.text AS "popStatus",
  p.bekannt_seit AS "popBekanntSeit",
  p.status_unklar AS "popStatusUnklar",
  p.status_unklar_begruendung AS "popStatusUnklarBegruendung",
  p.lv95_x AS "popX",
  p.lv95_y AS "popY",
  t.id AS "tpopId",
  t.nr AS "tpopNr",
  t.gemeinde AS "tpopGemeinde",
  t.flurname AS "tpopFlurname",
  tsw.text AS "tpopStatus",
  tsw.text AS "statusDecodiert",
  t.bekannt_seit AS "tpopBekanntSeit",
  t.status_unklar AS "tpopStatusUnklar",
  t.status_unklar_grund AS "tpopStatusUnklarGrund",
  t.lv95_x AS "tpopX",
  t.lv95_y AS "tpopY",
  t.radius AS "tpopRadius",
  t.hoehe AS "tpopHoehe",
  t.exposition AS "tpopExposition",
  t.klima AS "tpopKlima",
  t.neigung AS "tpopNeigung",
  t.beschreibung AS "tpopBeschreibung",
  t.kataster_nr AS "tpopKatasterNr",
  t.apber_relevant AS "tpopApberRelevant",
  t.apber_relevant_grund AS "tpopApberRelevantGrund",
  t.eigentuemer AS "tpopEigentuemer",
  t.kontakt AS "tpopKontakt",
  t.nutzungszone AS "tpopNutzungszone",
  t.bewirtschafter AS "tpopBewirtschafter",
  t.bewirtschaftung AS "tpopBewirtschaftung",
  t.ekfrequenz AS "tpopEkfrequenz",
  t.ekfrequenz_abweichend AS "tpopEkfrequenzAbweichend",
  kadr.name AS "tpopEkfKontrolleur",
  c.id AS "id",
  c.jahr AS "jahr",
  c.datum AS "datum",
  -- typ is a varchar referencing tpopkontr_typ_werte(text): it already holds
  -- the German text — the former JS code-map decode silently produced null
  c.typ AS "typ",
  badr.name AS "bearbeiter",
  c.ueberlebensrate AS "ueberlebensrate",
  c.vitalitaet AS "vitalitaet",
  etw.text AS "entwicklung",
  c.ursachen AS "ursachen",
  c.erfolgsbeurteilung AS "erfolgsbeurteilung",
  c.umsetzung_aendern AS "umsetzungAendern",
  c.kontrolle_aendern AS "kontrolleAendern",
  c.bemerkungen AS "bemerkungen",
  c.lr_delarze AS "lrDelarze",
  c.lr_umgebung_delarze AS "lrUmgebungDelarze",
  c.vegetationstyp AS "vegetationstyp",
  c.konkurrenz AS "konkurrenz",
  c.moosschicht AS "moosschicht",
  c.krautschicht AS "krautschicht",
  c.strauchschicht AS "strauchschicht",
  c.baumschicht AS "baumschicht",
  ibw.text AS "idealbiotopUebereinstimmung",
  c.handlungsbedarf AS "handlungsbedarf",
  c.flaeche_ueberprueft AS "flaecheUeberprueft",
  c.flaeche AS "flaeche",
  c.plan_vorhanden AS "planVorhanden",
  c.deckung_vegetation AS "deckungVegetation",
  c.deckung_nackter_boden AS "deckungNackterBoden",
  c.deckung_ap_art AS "deckungApArt",
  c.jungpflanzen_vorhanden AS "jungpflanzenVorhanden",
  c.vegetationshoehe_maximum AS "vegetationshoeheMaximum",
  c.vegetationshoehe_mittel AS "vegetationshoeheMittel",
  c.gefaehrdung AS "gefaehrdung",
  c.created_at AS "createdAt",
  c.updated_at AS "updatedAt",
  c.changed_by AS "changedBy",
  c.apber_nicht_relevant AS "apberNichtRelevant",
  c.apber_nicht_relevant_grund AS "apberNichtRelevantGrund",
  c.ekf_bemerkungen AS "ekfBemerkungen",
  COALESCE(zz.zaehlungen, '') AS "zaehlungen"
FROM apflora.tpopkontr c
LEFT JOIN apflora.tpop t ON t.id = c.tpop_id
LEFT JOIN apflora.pop p ON p.id = t.pop_id
LEFT JOIN apflora.ap a ON a.id = p.ap_id
LEFT JOIN apflora.ae_taxonomies tax ON tax.id = a.art_id
LEFT JOIN apflora.ap_bearbstand_werte bw ON bw.code = a.bearbeitung
LEFT JOIN apflora.ap_umsetzung_werte uw ON uw.code = a.umsetzung
LEFT JOIN apflora.adresse adr ON adr.id = a.bearbeiter
LEFT JOIN LATERAL (
  -- coalesce like the former JS (u.email ?? ''): an existing user with no
  -- email exports as '' — only a missing user row exports as null
  SELECT COALESCE(u.email, '') AS email
  FROM apflora."user" u
  WHERE u.adresse_id = a.bearbeiter
  LIMIT 1
) e ON true
LEFT JOIN apflora.pop_status_werte psw ON psw.code = p.status
LEFT JOIN apflora.pop_status_werte tsw ON tsw.code = t.status
LEFT JOIN apflora.adresse kadr ON kadr.id = t.ekf_kontrolleur
LEFT JOIN apflora.adresse badr ON badr.id = c.bearbeiter
LEFT JOIN apflora.tpop_entwicklung_werte etw ON etw.code = c.entwicklung
LEFT JOIN apflora.tpopkontr_idbiotuebereinst_werte ibw ON ibw.code = c.idealbiotop_uebereinstimmung
LEFT JOIN LATERAL (
  SELECT string_agg(
    'Einheit: ' || COALESCE(ew.text, '(keine)') ||
    ', Methode: ' || COALESCE(mw.text, '(keine)') ||
    ', Anzahl: ' || COALESCE((z.anzahl::numeric)::text, '(keine)'),
    ' / '
  ) AS zaehlungen
  FROM apflora.tpopkontrzaehl z
  LEFT JOIN apflora.tpopkontrzaehl_einheit_werte ew ON ew.code = z.einheit
  LEFT JOIN apflora.tpopkontrzaehl_methode_werte mw ON mw.code = z.methode
  WHERE z.tpopkontr_id = c.id
) zz ON true;
GRANT SELECT ON apflora.v_export_tpopkontr TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE FUNCTION apflora.export_tpopkontr(p_filter jsonb DEFAULT null)
RETURNS SETOF apflora.v_export_tpopkontr
LANGUAGE plpgsql
STABLE
AS $fn$
DECLARE
  v_where text;
BEGIN
  v_where := apflora.compile_filter('apflora.tpopkontr', 'tb', p_filter);
  RETURN QUERY EXECUTE format(
    'SELECT t.* FROM apflora.v_export_tpopkontr t JOIN apflora.tpopkontr tb ON tb.id = t.id WHERE (%s) ORDER BY t."apArtname" ASC NULLS FIRST, t."popNr" ASC NULLS FIRST, t."tpopNr" ASC NULLS FIRST, t."datum" ASC NULLS FIRST',
    v_where
  );
END
$fn$;
REVOKE EXECUTE ON FUNCTION apflora.export_tpopkontr(jsonb) FROM public;
GRANT EXECUTE ON FUNCTION apflora.export_tpopkontr(jsonb) TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;
