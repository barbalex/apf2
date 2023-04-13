-- TODO: on live server after pushing 443
DROP FUNCTION apflora.v_ap_ausw_pop_menge_refresh;

CREATE OR REPLACE FUNCTION apflora.v_pop_ausw_tpop_menge_refresh()
  RETURNS boolean
  AS $$
BEGIN
  REFRESH MATERIALIZED VIEW apflora.v_pop_ausw_tpop_menge;
  RETURN FOUND;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

ALTER FUNCTION apflora.v_pop_ausw_tpop_menge_refresh() OWNER TO postgres;

