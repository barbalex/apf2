DROP FUNCTION IF EXISTS apflora.q_tpop_mit_aktuellen_kontrollen_ohne_zielrelevante_einheit(berichtjahr integer, proj_id uuid, ap_id uuid);

CREATE OR REPLACE FUNCTION apflora.q_tpop_mit_aktuellen_kontrollen_ohne_zielrelevante_einheit(berichtjahr integer, proj_id uuid, ap_id uuid)
  RETURNS SETOF apflora.q_tpop_mit_aktuellen_kontrollen_ohne_zielrelevante_einheit
  AS $$
  with zielrelevante_zaehleinheit_pro_ap AS (
    SELECT
      apflora.ap.id,
      apflora.tpopkontrzaehl_einheit_werte.code AS zaehleinheit_code
    FROM
      apflora.ap
      LEFT JOIN apflora.ekzaehleinheit
      INNER JOIN apflora.tpopkontrzaehl_einheit_werte ON apflora.tpopkontrzaehl_einheit_werte.id = apflora.ekzaehleinheit.zaehleinheit_id ON apflora.ekzaehleinheit.ap_id = apflora.ap.id
        AND apflora.ekzaehleinheit.zielrelevant = TRUE
  ),
  tpop_mit_aktuellen_kontrollen AS (
    SELECT DISTINCT
      apflora.tpop.id
    FROM
      apflora.tpop
    INNER JOIN apflora.tpopkontr ON apflora.tpop.id = apflora.tpopkontr.tpop_id
    WHERE
      apflora.tpopkontr.jahr = $1
  ),
  tpop_mit_aktuellen_kontrollen_zielrelevanter_einheit AS (
    SELECT DISTINCT
      apflora.tpop.id
    FROM
      apflora.tpop
      INNER JOIN apflora.tpopkontr
      INNER JOIN apflora.tpopkontrzaehl ON apflora.tpopkontrzaehl.tpopkontr_id = apflora.tpopkontr.id ON apflora.tpop.id = apflora.tpopkontr.tpop_id
      INNER JOIN apflora.pop
      INNER JOIN zielrelevante_zaehleinheit_pro_ap ON zielrelevante_zaehleinheit_pro_ap.id = apflora.pop.ap_id ON apflora.pop.id = apflora.tpop.pop_id
    WHERE
      apflora.tpopkontr.jahr = $1
      AND apflora.tpopkontrzaehl.einheit = zielrelevante_zaehleinheit_pro_ap.zaehleinheit_code
  ),
  tpop_ohne_aktuelle_kontrollen_zielrelevanter_einheit AS (
    SELECT
      tpop_mit_aktuellen_kontrollen.id
    FROM
      tpop_mit_aktuellen_kontrollen
      LEFT JOIN tpop_mit_aktuellen_kontrollen_zielrelevanter_einheit ON tpop_mit_aktuellen_kontrollen_zielrelevanter_einheit.id = tpop_mit_aktuellen_kontrollen.id
    WHERE
      tpop_mit_aktuellen_kontrollen_zielrelevanter_einheit IS NULL
  )
  SELECT
    apflora.projekt.id AS proj_id,
    apflora.ap.id AS ap_id,
    apflora.pop.id AS pop_id,
    apflora.pop.nr AS pop_nr,
    apflora.tpop.id,
    apflora.tpop.nr
  FROM
    apflora.projekt
    INNER JOIN apflora.ap
    INNER JOIN apflora.pop
    INNER JOIN apflora.tpop
    INNER JOIN tpop_ohne_aktuelle_kontrollen_zielrelevanter_einheit ON tpop_ohne_aktuelle_kontrollen_zielrelevanter_einheit.id = apflora.tpop.id ON apflora.pop.id = apflora.tpop.pop_id ON apflora.ap.id = apflora.pop.ap_id ON apflora.projekt.id = apflora.ap.proj_id
  WHERE
    apflora.projekt.id = $2
    AND apflora.ap.id = $3
  ORDER BY
    apflora.pop.nr,
    apflora.tpop.nr
$$
LANGUAGE sql
STABLE;

ALTER FUNCTION apflora.q_tpop_mit_aktuellen_kontrollen_ohne_zielrelevante_einheit(berichtjahr integer, proj_id uuid, ap_id uuid) OWNER TO postgres;

