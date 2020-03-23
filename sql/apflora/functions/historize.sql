CREATE OR REPLACE FUNCTION apflora.historize()
  RETURNS boolean AS $$
  BEGIN

  insert into apflora.ap_history
  select
    date_part('year', CURRENT_DATE) - 1 as year,
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
    date_part('year', CURRENT_DATE) - 1 as year,
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
    date_part('year', CURRENT_DATE) - 1 as year,
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
 $$ LANGUAGE plpgsql;

ALTER FUNCTION apflora.historize()
  OWNER TO postgres;
