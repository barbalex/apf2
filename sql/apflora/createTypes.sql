-- DANGER:
-- 1. EVERY type needs an id (or apollo will not work correctly)
-- 2. When re-using existing id's
--    apollo will replace those models with these in cache
--    This will cause hard to solve issues
-- 3. So either use existing id's but tell apollo to
--    combine them with the __typename when caching (in client.js, dataIdFromObject)
-- 4. Or give them new uuid's
CREATE TYPE apflora.q_pop_ohne_popmassnber AS (
  proj_id uuid,
  ap_id uuid,
  id uuid,
  nr integer
);

CREATE TYPE apflora.q_pop_ohne_popber AS (
  proj_id uuid,
  ap_id uuid,
  id uuid,
  nr integer
);

CREATE TYPE apflora.q_tpop_ohne_massnber AS (
  proj_id uuid,
  ap_id uuid,
  pop_id uuid,
  pop_nr integer,
  id uuid,
  nr integer
);

CREATE TYPE apflora.q_tpop_ohne_tpopber AS (
  proj_id uuid,
  ap_id uuid,
  pop_id uuid,
  pop_nr integer,
  id uuid,
  nr integer
);

CREATE TYPE apflora.q_tpop_counted_einheit_multiple_times_in_year AS (
  proj_id uuid,
  ap_id uuid,
  pop_id uuid,
  pop_nr integer,
  id uuid,
  nr integer,
  einheit text,
  anzahl integer
);

CREATE TYPE apflora.tpop_kontrolliert_for_jber AS (
  year integer,
  anz_tpop integer,
  anz_tpopber integer
);

DROP TYPE apflora.pop_nach_status_for_jber CASCADE;

CREATE TYPE apflora.pop_nach_status_for_jber AS (
  year integer,
  a3lpop integer,
  a4lpop integer,
  a5lpop integer,
  a7lpop integer,
  a8lpop integer,
  a9lpop integer
);

DROP TYPE apflora.jber_abc CASCADE;

CREATE TYPE apflora.jber_abc AS (
  artname text,
  id uuid,
  start_jahr integer,
  bearbeiter text,
  bearbeitung integer,
  a_3_l_pop integer,
  a_3_l_tpop integer,
  a_4_l_pop integer,
  a_4_l_tpop integer,
  a_5_l_pop integer,
  a_5_l_tpop integer,
  a_7_l_pop integer,
  a_7_l_tpop integer,
  a_8_l_pop integer,
  a_8_l_tpop integer,
  a_9_l_pop integer,
  a_9_l_tpop integer,
  b_1_l_pop integer,
  b_1_l_tpop integer,
  b_1_first_year integer,
  b_1_r_pop integer,
  b_1_r_tpop integer,
  c_1_l_pop integer,
  c_1_l_tpop integer,
  c_1_r_pop integer,
  c_1_r_tpop integer,
  c_1_first_year integer,
  first_massn integer,
  c_2_r_pop integer,
  c_2_r_tpop integer,
  c_3_r_pop integer,
  c_3_r_tpop integer,
  c_4_r_pop integer,
  c_4_r_tpop integer,
  c_5_r_pop integer,
  c_5_r_tpop integer,
  c_6_r_pop integer,
  c_6_r_tpop integer,
  c_7_r_pop integer,
  c_7_r_tpop integer,
  erfolg integer,
  erfolg_vorjahr integer
);

DROP TYPE apflora.jber_akt_pop CASCADE;

CREATE TYPE apflora.jber_akt_pop AS (
  artname text,
  id uuid,
  pop_100 integer,
  pop_200 integer,
  pop_total integer,
  pop_100_diff integer,
  pop_200_diff integer,
  pop_total_diff integer
);

