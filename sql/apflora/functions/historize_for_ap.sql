CREATE OR REPLACE FUNCTION apflora.historize_for_ap(year integer, ap_id uuid)
  RETURNS boolean
  AS $$
BEGIN
  -- 1.  empty history tables (rows of passed year)
  -- 1.1 tpop_history
  DELETE FROM apflora.tpop_history h
  INNER JOIN apflora.pop_history hpop ON hpop.id = h.pop_id
    AND h.year = hpop.year
  LEFT JOIN apflora.tpop t ON t.id = h.id
  WHERE t.id IS NULL
    AND h.year = $1
    AND hpop.ap_id = $2;
  -- 1.2. pop_history
  DELETE FROM apflora.pop_history h
  LEFT JOIN apflora.pop p ON p.id = h.id
  WHERE p.id IS NULL
    AND h.year = $1
    AND h.ap_id = $2;
  -- 1.3. ap_history
  DELETE FROM apflora.ap_history h
  LEFT JOIN apflora.ap a ON a.id = h.id
  WHERE a.id IS NULL
    AND h.year = $1
    AND h.id = $2;
  --
  -- 2. insert, on conflict update
  -- 2.1 insert ap_history
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
    apflora.ap
  WHERE
    apflora.ap.id = $2
  ON CONFLICT(id,
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
  -- 2.2 insert pop_history
  INSERT INTO apflora.pop_history(year, id, ap_id, nr, name, status, status_unklar, status_unklar_begruendung, bekannt_seit, geom_point, created_at, updated_at, changed_by)
  SELECT
    $1 AS year,
    id,
    apflora.pop.ap_id,
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
  WHERE
    apflora.pop.ap_id = $2
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
  -- 2.3 insert tpop_history
  INSERT INTO apflora.tpop_history(year, id, pop_id, nr, gemeinde, flurname, geom_point, radius, hoehe, exposition, klima, neigung, boden_typ, boden_kalkgehalt, boden_durchlaessigkeit, boden_humus, boden_naehrstoffgehalt, boden_abtrag, wasserhaushalt, beschreibung, kataster_nr, status, status_unklar, status_unklar_grund, apber_relevant, apber_relevant_grund, bekannt_seit, eigentuemer, kontakt, nutzungszone, bewirtschafter, bewirtschaftung, ekfrequenz, ekfrequenz_startjahr, ekfrequenz_abweichend, ekf_kontrolleur, bemerkungen, created_at, updated_at, changed_by)
  SELECT
    $1 AS year,
    tpop.id,
    tpop.pop_id,
    tpop.nr,
    tpop.gemeinde,
    tpop.flurname,
    tpop.geom_point,
    tpop.radius,
    tpop.hoehe,
    tpop.exposition,
    tpop.klima,
    tpop.neigung,
    tpop.boden_typ,
    tpop.boden_kalkgehalt,
    tpop.boden_durchlaessigkeit,
    tpop.boden_humus,
    tpop.boden_naehrstoffgehalt,
    tpop.boden_abtrag,
    tpop.wasserhaushalt,
    tpop.beschreibung,
    tpop.kataster_nr,
    tpop.status,
    tpop.status_unklar,
    tpop.status_unklar_grund,
    tpop.apber_relevant,
    tpop.apber_relevant_grund,
    tpop.bekannt_seit,
    tpop.eigentuemer,
    tpop.kontakt,
    tpop.nutzungszone,
    tpop.bewirtschafter,
    tpop.bewirtschaftung,
    tpop.ekfrequenz,
    tpop.ekfrequenz_startjahr,
    tpop.ekfrequenz_abweichend,
    tpop.ekf_kontrolleur,
    tpop.bemerkungen,
    tpop.created_at,
    tpop.updated_at,
    tpop.changed_by
  FROM
    apflora.tpop tpop
    INNER JOIN apflora.pop pop ON pop.id = tpop.pop_id
    INNER JOIN apflora.ap ap ON ap.id = pop.ap_id
  WHERE
    ap.id = $2
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
  RETURN FOUND;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

ALTER FUNCTION apflora.historize_for_ap(year integer, ap_id uuid) OWNER TO postgres;

