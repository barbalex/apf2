DROP FUNCTION IF EXISTS apflora.q_ap_mit_aktuellen_kontrollen_ohne_zielrelevante_einheit(berichtjahr integer);

CREATE OR REPLACE FUNCTION apflora.q_ap_mit_aktuellen_kontrollen_ohne_zielrelevante_einheit(berichtjahr integer)
  RETURNS SETOF apflora.q_ap_mit_aktuellen_kontrollen_ohne_zielrelevante_einheit
  AS $$
  with ap_mit_zielrelevanter_zaehleinheit AS (
    SELECT DISTINCT
      apflora.ap.id
    FROM
      apflora.ap
      INNER JOIN apflora.ekzaehleinheit ON apflora.ekzaehleinheit.ap_id = apflora.ap.id
    WHERE
      apflora.ekzaehleinheit.zielrelevant = TRUE
  ),
  ap_ohne_zielrelevante_zaehleinheit AS (
    SELECT DISTINCT
      apflora.ap.id
    FROM
      apflora.ap
      LEFT JOIN ap_mit_zielrelevanter_zaehleinheit ON ap_mit_zielrelevanter_zaehleinheit.id = apflora.ap.id
    WHERE
      ap_mit_zielrelevanter_zaehleinheit.id IS NULL
  ),
  tpop_mit_aktuellen_kontrollen_ohne_zielrelevante_zaehleinheit AS (
    SELECT DISTINCT
      apflora.tpop.id
    FROM
      apflora.tpop
      INNER JOIN apflora.tpopkontr ON apflora.tpop.id = apflora.tpopkontr.tpop_id
      INNER JOIN apflora.pop
      INNER JOIN ap_ohne_zielrelevante_zaehleinheit ON ap_ohne_zielrelevante_zaehleinheit.id = apflora.pop.ap_id ON apflora.pop.id = apflora.tpop.pop_id
    WHERE
      apflora.tpopkontr.jahr = $1)
  SELECT DISTINCT
    apflora.projekt.id AS proj_id,
    apflora.ap.id AS ap_id
  FROM
    apflora.projekt
    INNER JOIN apflora.ap
    INNER JOIN apflora.pop
    INNER JOIN apflora.tpop
    INNER JOIN tpop_mit_aktuellen_kontrollen_ohne_zielrelevante_zaehleinheit ON tpop_mit_aktuellen_kontrollen_ohne_zielrelevante_zaehleinheit.id = apflora.tpop.id ON apflora.tpop.pop_id = apflora.pop.id ON apflora.pop.ap_id = apflora.ap.id ON apflora.projekt.id = apflora.ap.proj_id
  ORDER BY
    apflora.projekt.id,
    apflora.ap.id
$$
LANGUAGE sql
STABLE;

ALTER FUNCTION apflora.q_ap_mit_aktuellen_kontrollen_ohne_zielrelevante_einheit(berichtjahr integer) OWNER TO postgres;

