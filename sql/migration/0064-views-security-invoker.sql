-- Legacy views: set security_invoker = true (RLS of the base tables
-- then applies when reading through the view, instead of the view
-- running as its owner postgres, who bypasses RLS).
-- Found with pgrls (VIEW001) and demonstrated live: as
-- apflora_ap_reader, SELECT count(*) FROM apflora.v_ap_anzkontr
-- returned all 600 rows while the base table correctly returned 0.
-- The PostgREST-era views already do this; this migration extends
-- it to the legacy views restored from apflora.backup.
-- Note: restricted roles now see only their rows through these
-- views (per the RLS design) where they previously saw everything.

BEGIN;
ALTER VIEW apflora.v_ae_tax_list SET (security_invoker = true);
ALTER VIEW apflora.v_ap_anzkontr SET (security_invoker = true);
ALTER VIEW apflora.v_ap_anzmassn SET (security_invoker = true);
ALTER VIEW apflora.v_ap_apberundmassn SET (security_invoker = true);
ALTER VIEW apflora.v_ap_ausw_pop_status SET (security_invoker = true);
ALTER VIEW apflora.v_ap_pop_ek_prio SET (security_invoker = true);
ALTER VIEW apflora.v_apbeob SET (security_invoker = true);
ALTER VIEW apflora.v_beob_art_changed SET (security_invoker = true);
ALTER VIEW apflora.v_beob_nicht_zuzuordnen SET (security_invoker = true);
ALTER VIEW apflora.v_beob_zugeordnet SET (security_invoker = true);
ALTER VIEW apflora.v_ek_planung_nach_abrechnungstyp SET (security_invoker = true);
ALTER VIEW apflora.v_export_info_flora_beob SET (security_invoker = true);
ALTER VIEW apflora.v_kontrzaehl_anzproeinheit SET (security_invoker = true);
ALTER VIEW apflora.v_kt_zh_geo SET (security_invoker = true);
ALTER VIEW apflora.v_massn_fuergis_read SET (security_invoker = true);
ALTER VIEW apflora.v_massn_fuergis_write SET (security_invoker = true);
ALTER VIEW apflora.v_massn_webgisbun SET (security_invoker = true);
ALTER VIEW apflora.v_pop_anzkontr SET (security_invoker = true);
ALTER VIEW apflora.v_pop_anzmassn SET (security_invoker = true);
ALTER VIEW apflora.v_pop_fuergis_read SET (security_invoker = true);
ALTER VIEW apflora.v_pop_fuergis_write SET (security_invoker = true);
ALTER VIEW apflora.v_pop_kml SET (security_invoker = true);
ALTER VIEW apflora.v_pop_kmlnamen SET (security_invoker = true);
ALTER VIEW apflora.v_pop_last_count SET (security_invoker = true);
ALTER VIEW apflora.v_pop_last_count_with_massn SET (security_invoker = true);
ALTER VIEW apflora.v_pop_mit_letzter_popber SET (security_invoker = true);
ALTER VIEW apflora.v_pop_mit_letzter_popmassnber SET (security_invoker = true);
ALTER VIEW apflora.v_pop_ohnekoord SET (security_invoker = true);
ALTER VIEW apflora.v_pop_popberundmassnber SET (security_invoker = true);
ALTER VIEW apflora.v_pop_vonapohnestatus SET (security_invoker = true);
ALTER VIEW apflora.v_popmassnber_anzmassn SET (security_invoker = true);
ALTER VIEW apflora.v_q_anpflanzung_ohne_zielrelevante_einheit SET (security_invoker = true);
ALTER VIEW apflora.v_q_anpflanzung_zielrelevante_anzahl_falsch SET (security_invoker = true);
ALTER VIEW apflora.v_q_anpflanzung_zielrelevante_einheit_falsch SET (security_invoker = true);
ALTER VIEW apflora.v_q_ekzieleinheit_ohne_massn_zaehleinheit SET (security_invoker = true);
ALTER VIEW apflora.v_q_pop_bekanntseit_nicht_aeltestetpop SET (security_invoker = true);
ALTER VIEW apflora.v_q_pop_koordentsprechenkeinertpop SET (security_invoker = true);
ALTER VIEW apflora.v_q_pop_mit_ber_abnehmend_ohne_tpopber_abnehmend SET (security_invoker = true);
ALTER VIEW apflora.v_q_pop_mit_ber_erloschen_ohne_tpopber_erloschen SET (security_invoker = true);
ALTER VIEW apflora.v_q_pop_mit_ber_erloschen_und_tpopber_nicht_erloschen SET (security_invoker = true);
ALTER VIEW apflora.v_q_pop_mit_ber_zunehmend_ohne_tpopber_zunehmend SET (security_invoker = true);
ALTER VIEW apflora.v_q_pop_ohnetpopmitgleichemstatus SET (security_invoker = true);
ALTER VIEW apflora.v_q_pop_popnrmehrdeutig SET (security_invoker = true);
ALTER VIEW apflora.v_q_pop_status101tpopstatusanders SET (security_invoker = true);
ALTER VIEW apflora.v_q_pop_status200tpopstatusunzulaessig SET (security_invoker = true);
ALTER VIEW apflora.v_q_pop_status201tpopstatusunzulaessig SET (security_invoker = true);
ALTER VIEW apflora.v_q_pop_status202tpopstatusanders SET (security_invoker = true);
ALTER VIEW apflora.v_q_pop_status300tpopstatusanders SET (security_invoker = true);
ALTER VIEW apflora.v_q_pop_statusaktuellletzterpopbererloschen SET (security_invoker = true);
ALTER VIEW apflora.v_q_pop_statusangesiedeltmittpopurspruenglich SET (security_invoker = true);
ALTER VIEW apflora.v_q_pop_statusansaatversuchalletpoperloschen SET (security_invoker = true);
ALTER VIEW apflora.v_q_pop_statusansaatversuchmitaktuellentpop SET (security_invoker = true);
ALTER VIEW apflora.v_q_pop_statusansaatversuchmittpopursprerloschen SET (security_invoker = true);
ALTER VIEW apflora.v_q_pop_statuserloschenletzterpopberabnehmend SET (security_invoker = true);
ALTER VIEW apflora.v_q_pop_statuserloschenletzterpopberaktuell SET (security_invoker = true);
ALTER VIEW apflora.v_q_pop_statuserloschenletzterpopbererloschenmitansiedlung SET (security_invoker = true);
ALTER VIEW apflora.v_q_pop_statuserloschenletzterpopberstabil SET (security_invoker = true);
ALTER VIEW apflora.v_q_pop_statuserloschenletzterpopberunsicher SET (security_invoker = true);
ALTER VIEW apflora.v_q_pop_statuserloschenletzterpopberzunehmend SET (security_invoker = true);
ALTER VIEW apflora.v_q_pop_statuserloschenmittpopaktuell SET (security_invoker = true);
ALTER VIEW apflora.v_q_pop_statuserloschenmittpopansaatversuch SET (security_invoker = true);
ALTER VIEW apflora.v_q_pop_urspruenglich_wiederauferstanden SET (security_invoker = true);
ALTER VIEW apflora.v_q_tpop_bekanntseit_juenger_als_aelteste_beob SET (security_invoker = true);
ALTER VIEW apflora.v_q_tpop_erloschen_mit_ekplan_nach_letztem_tpopber SET (security_invoker = true);
ALTER VIEW apflora.v_q_tpop_erloschenundrelevantaberletztebeobvor1950 SET (security_invoker = true);
ALTER VIEW apflora.v_q_tpop_erste_massn_vor_bekannt_seit SET (security_invoker = true);
ALTER VIEW apflora.v_q_tpop_mitstatusansaatversuchundzaehlungmitanzahl SET (security_invoker = true);
ALTER VIEW apflora.v_q_tpop_mitstatuspotentiellundmassnansiedlung SET (security_invoker = true);
ALTER VIEW apflora.v_q_tpop_mitstatuspotentiellundzaehlungmitanzahl SET (security_invoker = true);
ALTER VIEW apflora.v_q_tpop_popnrtpopnrmehrdeutig SET (security_invoker = true);
ALTER VIEW apflora.v_q_tpop_statusaktuellletztertpopbererloschen SET (security_invoker = true);
ALTER VIEW apflora.v_q_tpop_statuserloschenletzterpopberaktuell SET (security_invoker = true);
ALTER VIEW apflora.v_q_tpop_statuserloschenletztertpopberabnehmend SET (security_invoker = true);
ALTER VIEW apflora.v_q_tpop_statuserloschenletztertpopbererloschenmitansiedlung SET (security_invoker = true);
ALTER VIEW apflora.v_q_tpop_statuserloschenletztertpopberstabil SET (security_invoker = true);
ALTER VIEW apflora.v_q_tpop_statuserloschenletztertpopberunsicher SET (security_invoker = true);
ALTER VIEW apflora.v_q_tpop_statuserloschenletztertpopberzunehmend SET (security_invoker = true);
ALTER VIEW apflora.v_tpop_anzmassn SET (security_invoker = true);
ALTER VIEW apflora.v_tpop_ekfrequenz_to_set SET (security_invoker = true);
ALTER VIEW apflora.v_tpop_ekfrequenz_to_set_nie SET (security_invoker = true);
ALTER VIEW apflora.v_tpop_erste_und_letzte_kontrolle_und_letzter_tpopber SET (security_invoker = true);
ALTER VIEW apflora.v_tpop_fuergis_read SET (security_invoker = true);
ALTER VIEW apflora.v_tpop_fuergis_write SET (security_invoker = true);
ALTER VIEW apflora.v_tpop_kml SET (security_invoker = true);
ALTER VIEW apflora.v_tpop_kmlnamen SET (security_invoker = true);
ALTER VIEW apflora.v_tpop_last_count SET (security_invoker = true);
ALTER VIEW apflora.v_tpop_last_count_with_massn SET (security_invoker = true);
ALTER VIEW apflora.v_tpop_ohneapberichtrelevant SET (security_invoker = true);
ALTER VIEW apflora.v_tpop_ohnebekanntseit SET (security_invoker = true);
ALTER VIEW apflora.v_tpop_popberundmassnber SET (security_invoker = true);
ALTER VIEW apflora.v_tpop_statuswidersprichtbericht SET (security_invoker = true);
ALTER VIEW apflora.v_tpop_webgisbun SET (security_invoker = true);
ALTER VIEW apflora.v_tpopkontr_fuergis_read SET (security_invoker = true);
ALTER VIEW apflora.v_tpopkontr_fuergis_write SET (security_invoker = true);
ALTER VIEW apflora.v_tpopkontr_webgisbun SET (security_invoker = true);
COMMIT;
