DROP FUNCTION apflora.historize();
CREATE OR REPLACE FUNCTION apflora.historize(year integer)
  RETURNS boolean AS $$
  BEGIN

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
  from apflora.ap
  on conflict on constraint ap_history_pkey do update set
    -- do not update prmary keys: year and id
    art_id = excluded.art_id,
    proj_id = excluded.proj_id,
    bearbeitung = excluded.bearbeitung,
    start_jahr = excluded.start_jahr,
    umsetzung = excluded.umsetzung,
    bearbeiter = excluded.bearbeiter,
    ekf_beobachtungszeitpunkt = excluded.ekf_beobachtungszeitpunkt,
    changed = excluded.changed,
    changed_by = excluded.changed_by;

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
  from apflora.pop
  on conflict on constraint pop_history_pkey do update set
    -- do not update prmary keys: year and id
    ap_id = excluded.ap_id,
    nr = excluded.nr,
    name = excluded.name,
    status = excluded.status,
    status_unklar = excluded.status_unklar,
    status_unklar_begruendung = excluded.status_unklar_begruendung,
    bekannt_seit = excluded.bekannt_seit,
    geom_point = excluded.geom_point,
    changed = excluded.changed,
    changed_by = excluded.changed_by;

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
  from apflora.tpop
  on conflict on constraint tpop_history_pkey do update set
    -- do not update prmary keys: year and id
    pop_id = excluded.pop_id,
    nr = excluded.nr,
    gemeinde = excluded.gemeinde,
    flurname = excluded.flurname,
    geom_point = excluded.geom_point,
    radius = excluded.radius,
    hoehe = excluded.hoehe,
    exposition = excluded.exposition,
    klima = excluded.klima,
    neigung = excluded.neigung,
    beschreibung = excluded.beschreibung,
    kataster_nr = excluded.kataster_nr,
    status = excluded.status,
    status_unklar = excluded.status_unklar,
    status_unklar_grund = excluded.status_unklar_grund,
    apber_relevant = excluded.apber_relevant,
    apber_relevant_grund = excluded.apber_relevant_grund,
    bekannt_seit = excluded.bekannt_seit,
    eigentuemer = excluded.eigentuemer,
    kontakt = excluded.kontakt,
    nutzungszone = excluded.nutzungszone,
    bewirtschafter = excluded.bewirtschafter,
    bewirtschaftung = excluded.bewirtschaftung,
    ekfrequenz = excluded.ekfrequenz,
    ekfrequenz_startjahr = excluded.ekfrequenz_startjahr,
    ekfrequenz_abweichend = excluded.ekfrequenz_abweichend,
    ekf_kontrolleur = excluded.ekf_kontrolleur,
    bemerkungen = excluded.bemerkungen,
    changed = excluded.changed,
    changed_by = excluded.changed_by;

  RETURN FOUND;

 END;
 $$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER FUNCTION apflora.historize(year integer)
  OWNER TO postgres;
