CREATE OR REPLACE FUNCTION apflora.historize (year integer)
  RETURNS boolean
  AS $$
BEGIN
  -- empty history tables (rows of passed year)
  DELETE FROM apflora.tpop_history
  WHERE apflora.tpop_history.year = $1;
  DELETE FROM apflora.pop_history
  WHERE apflora.pop_history.year = $1;
  DELETE FROM apflora.ap_history
  WHERE apflora.ap_history.year = $1;
  --
  -- insert ap_history
  INSERT INTO apflora.ap_history
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
    apflora.ap;
  --
  -- insert pop_history
  INSERT INTO apflora.pop_history
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
    apflora.pop;
  --
  -- insert tpop_history
  INSERT INTO apflora.tpop_history (year, id, pop_id, nr, gemeinde, flurname, geom_point, radius, hoehe, exposition, klima, neigung, boden_typ, boden_kalkgehalt, boden_durchlaessigkeit, boden_humus, boden_naehrstoffgehalt, boden_abtrag, wasserhaushalt, beschreibung, kataster_nr, status, status_unklar, status_unklar_grund, apber_relevant, apber_relevant_grund, bekannt_seit, eigentuemer, kontakt, nutzungszone, bewirtschafter, bewirtschaftung, ekfrequenz, ekfrequenz_startjahr, ekfrequenz_abweichend, ekf_kontrolleur, bemerkungen, created_at, updated_at, changed_by)
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
    apflora.tpop;
  RETURN FOUND;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

ALTER FUNCTION apflora.historize (year integer) OWNER TO postgres;

