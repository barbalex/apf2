DROP FUNCTION IF EXISTS apflora.q_pop_ohne_popber(projid uuid, apid uuid, berichtjahr integer);

CREATE OR REPLACE FUNCTION apflora.q_pop_ohne_popber(projid uuid, apid uuid, berichtjahr integer)
  RETURNS SETOF apflora.q_pop_ohne_popber
  AS $$
  SELECT DISTINCT
    apflora.ap.proj_id,
    apflora.pop.ap_id,
    apflora.pop.id,
    apflora.pop.nr
  FROM
    apflora.ap
    INNER JOIN apflora.pop ON apflora.pop.ap_id = apflora.ap.id
  WHERE
    apflora.pop.id IN( SELECT DISTINCT
        apflora.tpop.pop_id
      FROM
        apflora.tpop
        INNER JOIN apflora.pop
        INNER JOIN apflora.ap ON apflora.ap.id = apflora.pop.ap_id ON apflora.pop.id = apflora.tpop.pop_id
      WHERE
        apflora.tpop.apber_relevant = TRUE
        AND apflora.ap.id = $2
        AND apflora.ap.proj_id = $1
        AND apflora.tpop.id IN(
          -- mit Kontrolle im Berichtjahr
          SELECT DISTINCT
            apflora.tpopkontr.tpop_id
          FROM apflora.tpopkontr
          WHERE
            apflora.tpopkontr.typ IN('Freiwilligen-Erfolgskontrolle', 'Zwischenbeurteilung')
            AND apflora.tpopkontr.jahr = $3))
    AND apflora.pop.id NOT IN(
      -- mit PopBer im Berichtjahr
      SELECT DISTINCT
        apflora.popber.pop_id FROM apflora.popber
        INNER JOIN apflora.pop
        INNER JOIN apflora.ap ON apflora.ap.id = apflora.pop.ap_id ON apflora.pop.id = apflora.popber.pop_id
        WHERE
          apflora.popber.jahr = $3
          AND apflora.ap.id = $2
          AND apflora.ap.proj_id = $1)
    AND apflora.pop.ap_id = $2
    AND apflora.ap.proj_id = $1
  ORDER BY
    apflora.pop.nr
$$
LANGUAGE sql
STABLE;

ALTER FUNCTION apflora.q_pop_ohne_popber(projid uuid, apid uuid, berichtjahr integer) OWNER TO postgres;

