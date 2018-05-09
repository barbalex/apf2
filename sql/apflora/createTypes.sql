CREATE TYPE apflora.qk_pop_ohne_popmassnber AS (
  proj_id uuid,
  ap_id uuid,
  hw text,
  url text[],
  text text[]
);

CREATE TYPE apflora.qk_pop_ohne_popber AS (
  proj_id uuid,
  ap_id uuid,
  hw text,
  url text[],
  text text[]
);

CREATE TYPE apflora.qk_tpop_ohne_massnber AS (
  proj_id uuid,
  ap_id uuid,
  hw text,
  url text[],
  text text[]
);

CREATE TYPE apflora.qk_tpop_ohne_tpopber AS (
  proj_id uuid,
  ap_id uuid,
  hw text,
  url text[],
  text text[]
);