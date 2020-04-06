-- create list like this:
SELECT 'DROP VIEW if exists apflora.' || table_name || ' cascade;'
  FROM information_schema.views
 WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
   AND table_name !~ '^pg_';

-- then run it:

-- TODO: on checking if still needed from here
DROP VIEW if exists  apflora.v_tpop_last_count cascade;
DROP VIEW if exists  apflora.v_pop_last_count cascade;
DROP VIEW if exists  apflora.v_tpop_last_count_with_massn cascade;
DROP VIEW if exists  apflora.v_ap_ausw_pop_status cascade;
DROP VIEW if exists  apflora.v_ap_ausw_tpop_kontrolliert cascade;
DROP VIEW if exists  apflora.v_tpop_ekfrequenz_to_set cascade;
DROP VIEW if exists  apflora.v_tpopkontr_maxanzahl cascade;
DROP VIEW if exists  apflora.v_tpopber_mitletzterid cascade;