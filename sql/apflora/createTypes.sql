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
  anzahl bigint
);

create type apflora.tpop_kontrolliert_for_jber as (
  year integer,
  anz_tpop bigint,
  anz_tpopber bigint
);

create type apflora.pop_nach_status_for_jber as (
  year integer,
  a3lpop bigint,
  a4lpop bigint,
  a5lpop bigint,
  a7lpop bigint,
  a8lpop bigint,
  a9lpop bigint,
  a10lpop bigint
);