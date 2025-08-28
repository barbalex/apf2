DROP FUNCTION IF EXISTS apflora.q_tpop_mit_aktuellen_anpflanzungen_ohne_zielrelevante_einheit(berichtjahr integer, proj_id uuid, ap_id uuid);

CREATE OR REPLACE FUNCTION apflora.q_tpop_mit_aktuellen_anpflanzungen_ohne_zielrelevante_einheit(berichtjahr integer, proj_id uuid, ap_id uuid)
  RETURNS SETOF apflora.q_tpop_mit_aktuellen_anpflanzungen_ohne_zielrelevante_einheit
  AS $$
    with tpop_mit_aktuellen_anpflanzungen AS (
      SELECT DISTINCT
        apflora.tpop.id
      FROM
        apflora.tpop
        INNER JOIN apflora.tpopmassn
        INNER JOIN apflora.tpopmassn_typ_werte ON apflora.tpopmassn_typ_werte.code = apflora.tpopmassn.typ ON apflora.tpop.id = apflora.tpopmassn.tpop_id
      WHERE
        apflora.tpopmassn.jahr = $1
        AND apflora.tpopmassn_typ_werte.anpflanzung = TRUE
        AND (apflora.tpopmassn.zieleinheit_einheit IS NULL
          OR apflora.tpopmassn.zieleinheit_anzahl IS NULL))
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
      INNER JOIN tpop_mit_aktuellen_anpflanzungen ON tpop_mit_aktuellen_anpflanzungen.id = apflora.tpop.id ON apflora.pop.id = apflora.tpop.pop_id ON apflora.ap.id = apflora.pop.ap_id ON apflora.projekt.id = apflora.ap.proj_id
    WHERE
      apflora.projekt.id = $2
      AND apflora.ap.id = $3
    ORDER BY
      apflora.pop.nr,
      apflora.tpop.nr
$$
LANGUAGE sql
STABLE;

ALTER FUNCTION apflora.q_tpop_mit_aktuellen_anpflanzungen_ohne_zielrelevante_einheit(berichtjahr integer, proj_id uuid, ap_id uuid) OWNER TO postgres;

