CREATE OR REPLACE FUNCTION apflora.historize(year integer)
  RETURNS boolean
  AS $$
BEGIN
  -- 1. delete only rows of this year that do not exist in source
  -- 1.1 tpop_history
  DELETE FROM apflora.tpop_history
  WHERE apflora.tpop_history.year = $1
    AND NOT EXISTS(
      SELECT
        1
      FROM
        apflora.tpop
      WHERE
        apflora.tpop.id = apflora.tpop_history.id);
  -- 1.2 pop_history
  DELETE FROM apflora.pop_history h
  LEFT JOIN apflora.pop p ON p.id = h.id
    AND h.year = $1
  WHERE p.id IS NULL;
  -- 1.3 ap_history
  DELETE FROM apflora.ap_history h
  LEFT JOIN apflora.ap ap ON ap.id = h.id
    AND h.year = $1
  WHERE ap.id IS NULL;
  --
  -- 2. insert, on conflict update
  -- 2.1 ap_history
  INSERT INTO apflora.ap_history(year, id, art_id, proj_id, bearbeitung, start_jahr, umsetzung, bearbeiter, ekf_beobachtungszeitpunkt, created_at, updated_at, changed_by)
  SELECT
    $1 AS year,
    id,
    art_id,
    proj_id,
    bearbeitung,
    start_jahr,
    umsetzung,
    bearbeiter,
    ekf_beobachtungszeitpunkt,
    created_at,
    updated_at,
    changed_by
  FROM
    apflora.ap con CONFLICT(id,
      year)
      DO UPDATE SET
        art_id = excluded.art_id,
        proj_id = excluded.proj_id,
        bearbeitung = excluded.bearbeitung,
        start_jahr = excluded.start_jahr,
        umsetzung = excluded.umsetzung,
        bearbeiter = excluded.bearbeiter,
        ekf_beobachtungszeitpunkt = excluded.ekf_beobachtungszeitpunkt,
        created_at = excluded.created_at,
        updated_at = excluded.updated_at,
        changed_by = excluded.changed_by;
  --
  -- 2.2 pop_history
  INSERT INTO apflora.pop_history(year, id, ap_id, nr, name, status, status_unklar, status_unklar_begruendung, bekannt_seit, geom_point, created_at, updated_at, changed_by)
  SELECT
    $1 AS year,
    id,
    ap_id,
    nr,
    name,
    status,
    status_unklar,
    status_unklar_begruendung,
    bekannt_seit,
    geom_point,
    created_at,
    updated_at,
    changed_by
  FROM
    apflora.pop
  ON CONFLICT(id,
    year)
    DO UPDATE SET
      ap_id = excluded.ap_id,
      nr = excluded.nr,
      name = excluded.name,
      status = excluded.status,
      status_unklar = excluded.status_unklar,
      status_unklar_begruendung = excluded.status_unklar_begruendung,
      bekannt_seit = excluded.bekannt_seit,
      geom_point = excluded.geom_point,
      created_at = excluded.created_at,
      updated_at = excluded.updated_at,
      changed_by = excluded.changed_by;
  --
  -- 2.3 tpop_history
  INSERT INTO apflora.tpop_history(year, id, pop_id, nr, gemeinde, flurname, geom_point, radius, hoehe, exposition, klima, neigung, boden_typ, boden_kalkgehalt, boden_durchlaessigkeit, boden_humus, boden_naehrstoffgehalt, boden_abtrag, wasserhaushalt, beschreibung, kataster_nr, status, status_unklar, status_unklar_grund, apber_relevant, apber_relevant_grund, bekannt_seit, eigentuemer, kontakt, nutzungszone, bewirtschafter, bewirtschaftung, ekfrequenz, ekfrequenz_startjahr, ekfrequenz_abweichend, ekf_kontrolleur, bemerkungen, created_at, updated_at, changed_by)
  SELECT
    $1 AS year,
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
    boden_typ,
    boden_kalkgehalt,
    boden_durchlaessigkeit,
    boden_humus,
    boden_naehrstoffgehalt,
    boden_abtrag,
    wasserhaushalt,
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
    created_at,
    updated_at,
    changed_by
  FROM
    apflora.tpop
  ON CONFLICT(id,
    year)
    DO UPDATE SET
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
      boden_typ = excluded.boden_typ,
      boden_kalkgehalt = excluded.boden_kalkgehalt,
      boden_durchlaessigkeit = excluded.boden_durchlaessigkeit,
      boden_humus = excluded.boden_humus,
      boden_naehrstoffgehalt = excluded.boden_naehrstoffgehalt,
      boden_abtrag = excluded.boden_abtrag,
      wasserhaushalt = excluded.wasserhaushalt,
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
      created_at = excluded.created_at,
      updated_at = excluded.updated_at,
      changed_by = excluded.changed_by;
  -- TODO: vacuum?
  -- TODO: reindex?
  -- REINDEX TABLE apflora.ap_history;
  -- REINDEX TABLE apflora.pop_history;
  -- REINDEX TABLE apflora.tpop_history;
  RETURN FOUND;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

ALTER FUNCTION apflora.historize(year integer) OWNER TO postgres;

