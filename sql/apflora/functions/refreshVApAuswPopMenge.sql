CREATE OR REPLACE FUNCTION apflora.v_ap_ausw_pop_menge_refresh()
  RETURNS boolean AS $$
  BEGIN

  refresh materialized view apflora.v_ap_ausw_pop_menge;

  RETURN FOUND;

 END;
 $$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER FUNCTION apflora.v_ap_ausw_pop_menge_refresh()
  OWNER TO postgres;
