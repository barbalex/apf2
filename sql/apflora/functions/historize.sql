CREATE OR REPLACE FUNCTION apflora.historize(year integer)
  RETURNS boolean AS $$
  BEGIN

  delete from apflora.tpop_history where apflora.tpop_history.year = $1;
  delete from apflora.pop_history where apflora.pop_history.year = $1;
  delete from apflora.ap_history where apflora.ap_history.year = $1;

  insert into apflora.ap_history
  select
    $1 as year,
    id,
    art_id,
    proj_id,
    bearbeitung,
    start_jahr,
    umsetzung,
    bearbeiter,
    ekf_beobachtungszeitpunkt,
    changed,
    changed_by
  from apflora.ap;

  insert into apflora.pop_history
  select
    $1 as year,
    id,
    ap_id,
    nr,
    name,
    status,
    status_unklar,
    status_unklar_begruendung,
    bekannt_seit,
    geom_point,
    changed,
    changed_by
  from apflora.pop;

  insert into apflora.tpop_history
  select
    $1 as year,
    id,
    pop_id,
    nr,
    gemeinde,
    flurname,
    geom_point,
    radius,
    hoehe,
    exposition,
    klima,
    neigung,
    beschreibung,
    kataster_nr,
    status,
    status_unklar,
    status_unklar_grund,
    apber_relevant,
    apber_relevant_grund,
    bekannt_seit,
    eigentuemer,
    kontakt,
    nutzungszone,
    bewirtschafter,
    bewirtschaftung,
    ekfrequenz,
    ekfrequenz_startjahr,
    ekfrequenz_abweichend,
    ekf_kontrolleur,
    bemerkungen,
    changed,
    changed_by
  from apflora.tpop;

  RETURN FOUND;

 END;
 $$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER FUNCTION apflora.historize(year integer)
  OWNER TO postgres;
