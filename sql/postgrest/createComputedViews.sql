-- v_<table> views: base table plus the computed columns the client
-- selects (label, coordinate transforms). PostgREST cannot call
-- functions per row, so reads go through these views.
-- security_invoker keeps the RLS policies of the base tables applied.
-- Regenerate after schema changes; apply like the other files in sql/.
-- camelCase keys are restored at the edge via select aliases
-- (see src/modules/selects.ts).
BEGIN;

CREATE OR REPLACE VIEW apflora.v_adresse WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.adresse_label(t) AS label
  FROM apflora.adresse t;
GRANT SELECT ON apflora.v_adresse TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;


CREATE OR REPLACE VIEW apflora.v_ap WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.ap_label(t) AS label
  FROM apflora.ap t;
GRANT SELECT ON apflora.v_ap TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_apart WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.apart_label(t) AS label
  FROM apflora.apart t;
GRANT SELECT ON apflora.v_apart TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_apber WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.apber_label(t) AS label
  FROM apflora.apber t;
GRANT SELECT ON apflora.v_apber TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_apberuebersicht WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.apberuebersicht_label(t) AS label
  FROM apflora.apberuebersicht t;
GRANT SELECT ON apflora.v_apberuebersicht TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_assozart WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.assozart_label(t) AS label
  FROM apflora.assozart t;
GRANT SELECT ON apflora.v_assozart TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_beob WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.beob_label(t) AS label,
    public.lv95_x(t) AS lv95_x,
    public.lv95_y(t) AS lv95_y,
    public.wgs84_lat(t) AS wgs84_lat,
    public.wgs84_long(t) AS wgs84_long
  FROM apflora.beob t;
GRANT SELECT ON apflora.v_beob TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_currentissue WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.currentissue_label(t) AS label
  FROM apflora.currentissue t;
GRANT SELECT ON apflora.v_currentissue TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_ek_abrechnungstyp_werte WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.ek_abrechnungstyp_werte_label(t) AS label
  FROM apflora.ek_abrechnungstyp_werte t;
GRANT SELECT ON apflora.v_ek_abrechnungstyp_werte TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_ekzaehleinheit WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.ekzaehleinheit_label(t) AS label
  FROM apflora.ekzaehleinheit t;
GRANT SELECT ON apflora.v_ekzaehleinheit TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_erfkrit WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.erfkrit_label(t) AS label
  FROM apflora.erfkrit t;
GRANT SELECT ON apflora.v_erfkrit TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_pop WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.pop_label(t) AS label,
    public.lv95_x(t) AS lv95_x,
    public.lv95_y(t) AS lv95_y,
    public.wgs84_lat(t) AS wgs84_lat,
    public.wgs84_long(t) AS wgs84_long
  FROM apflora.pop t;
GRANT SELECT ON apflora.v_pop TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_popber WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.popber_label(t) AS label
  FROM apflora.popber t;
GRANT SELECT ON apflora.v_popber TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_popmassnber WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.popmassnber_label(t) AS label
  FROM apflora.popmassnber t;
GRANT SELECT ON apflora.v_popmassnber TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_projekt WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.projekt_label(t) AS label
  FROM apflora.projekt t;
GRANT SELECT ON apflora.v_projekt TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_tpop WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.tpop_label(t) AS label,
    public.lv95_x(t) AS lv95_x,
    public.lv95_y(t) AS lv95_y,
    public.wgs84_lat(t) AS wgs84_lat,
    public.wgs84_long(t) AS wgs84_long
  FROM apflora.tpop t;
GRANT SELECT ON apflora.v_tpop TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_tpop_apberrelevant_grund_werte WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.tpop_apberrelevant_grund_werte_label(t) AS label
  FROM apflora.tpop_apberrelevant_grund_werte t;
GRANT SELECT ON apflora.v_tpop_apberrelevant_grund_werte TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_tpopber WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.tpopber_label(t) AS label
  FROM apflora.tpopber t;
GRANT SELECT ON apflora.v_tpopber TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_tpopkontrzaehl WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.tpopkontrzaehl_label(t) AS label
  FROM apflora.tpopkontrzaehl t;
GRANT SELECT ON apflora.v_tpopkontrzaehl TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_tpopkontrzaehl_einheit_werte WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.tpopkontrzaehl_einheit_werte_label(t) AS label
  FROM apflora.tpopkontrzaehl_einheit_werte t;
GRANT SELECT ON apflora.v_tpopkontrzaehl_einheit_werte TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_tpopmassn WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.tpopmassn_label(t) AS label
  FROM apflora.tpopmassn t;
GRANT SELECT ON apflora.v_tpopmassn TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_tpopmassnber WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.tpopmassnber_label(t) AS label
  FROM apflora.tpopmassnber t;
GRANT SELECT ON apflora.v_tpopmassnber TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_user WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.user_label(t) AS label
  FROM apflora.user t;
GRANT SELECT ON apflora.v_user TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_ziel WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.ziel_label(t) AS label
  FROM apflora.ziel t;
GRANT SELECT ON apflora.v_ziel TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_tpopkontr WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.tpopkontr_label_ek(t) AS label_ek,
    apflora.tpopkontr_label_ekf(t) AS label_ekf
  FROM apflora.tpopkontr t;
GRANT SELECT ON apflora.v_tpopkontr TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

COMMIT;
