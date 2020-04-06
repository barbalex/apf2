-- create list like this:
SELECT 'DROP VIEW if exists apflora.' || table_name || ' cascade;'
  FROM information_schema.views
 WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
   AND table_name !~ '^pg_';

-- then run it:

-- TODO: on checking if still needed from here
DROP VIEW if exists  apflora.v_q_pop_mit_ber_erloschen_und_tpopber_nicht_erloschen cascade;
DROP VIEW if exists  apflora.v_q_tpop_statusaktuellletztertpopbererloschen cascade;
DROP VIEW if exists  apflora.v_q_pop_statusaktuellletzterpopbererloschen cascade;
DROP VIEW if exists  apflora.v_q_tpop_statuserloschenletztertpopberzunehmend cascade;
DROP VIEW if exists  apflora.v_q_pop_statuserloschenletzterpopberzunehmend cascade;
DROP VIEW if exists  apflora.v_q_tpop_statuserloschenletztertpopberstabil cascade;
DROP VIEW if exists  apflora.v_q_pop_statuserloschenletzterpopberstabil cascade;
DROP VIEW if exists  apflora.v_q_tpop_statuserloschenletztertpopberabnehmend cascade;
DROP VIEW if exists  apflora.v_q_pop_statuserloschenletzterpopberabnehmend cascade;
DROP VIEW if exists  apflora.v_q_tpop_statuserloschenletztertpopberunsicher cascade;
DROP VIEW if exists  apflora.v_q_pop_statuserloschenletzterpopberunsicher cascade;
DROP VIEW if exists  apflora.v_q_pop_ohnetpopmitgleichemstatus cascade;
DROP VIEW if exists  apflora.v_q_pop_status300tpopstatusanders cascade;
DROP VIEW if exists  apflora.v_q_pop_status201tpopstatusunzulaessig cascade;
DROP VIEW if exists  apflora.v_q_pop_status202tpopstatusanders cascade;
DROP VIEW if exists  apflora.v_q_pop_status200tpopstatusunzulaessig cascade;
DROP VIEW if exists  apflora.v_q_pop_status101tpopstatusanders cascade;
DROP VIEW if exists  apflora.v_q_pop_statuserloschenletzterpopbererloschenmitansiedlung cascade;
DROP VIEW if exists  apflora.v_q_tpop_statuserloschenletztertpopbererloschenmitansiedlung cascade;
DROP VIEW if exists  apflora.v_tpop_last_count cascade;
DROP VIEW if exists  apflora.v_pop_last_count cascade;
DROP VIEW if exists  apflora.v_tpop_last_count_with_massn cascade;
DROP VIEW if exists  apflora.v_ap_ausw_pop_status cascade;
DROP VIEW if exists  apflora.v_ap_ausw_tpop_kontrolliert cascade;
DROP VIEW if exists  apflora.v_tpop_ekfrequenz_to_set cascade;
DROP VIEW if exists  apflora.v_tpopkontr_maxanzahl cascade;
DROP VIEW if exists  apflora.v_tpopber_mitletzterid cascade;