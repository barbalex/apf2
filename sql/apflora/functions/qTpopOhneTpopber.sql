DROP FUNCTION IF EXISTS apflora.q_tpop_ohne_tpopber(projid uuid, apid uuid, berichtjahr integer);
CREATE OR REPLACE FUNCTION apflora.q_tpop_ohne_tpopber(projid uuid, apid uuid, berichtjahr integer)
  RETURNS setof apflora.q_tpop_ohne_tpopber AS
  $$
  -- 3. "TPop ohne verlangten TPop-Bericht im Berichtjahr" ermitteln und in Qualitätskontrollen auflisten:
  SELECT DISTINCT
    apflora.ap.proj_id,
    apflora.pop.ap_id,
    apflora.pop.id as pop_id,
    apflora.pop.nr as pop_nr,
    apflora.tpop.id,
    apflora.tpop.nr
  FROM
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.pop.id = apflora.tpop.pop_id
    ON apflora.pop.ap_id = apflora.ap.id
  WHERE
    apflora.ap.proj_id = $1
    and apflora.pop.ap_id = $2
    and apflora.tpop.apber_relevant = true
    and apflora.tpop.id IN (
      -- 1. "TPop mit Kontrolle im Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.tpopkontr.tpop_id
      FROM
        apflora.tpopkontr
        inner join apflora.tpop
          inner join apflora.pop
            inner join apflora.ap
            on apflora.ap.id = apflora.pop.ap_id
          on apflora.pop.id = apflora.tpop.pop_id
        on apflora.tpop.id = apflora.tpopkontr.tpop_id
      WHERE
        apflora.tpopkontr.typ NOT IN ('Zwischenziel', 'Ziel')
        and apflora.tpopkontr.jahr = $3
        and apflora.ap.id = $2
        and apflora.ap.proj_id = $1
    )
    and apflora.tpop.id NOT IN (
      -- 2. "TPop mit TPopBer im Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.tpopber.tpop_id
      FROM
        apflora.tpopber
        inner join apflora.tpop
          inner join apflora.pop
            inner join apflora.ap
            on apflora.ap.id = apflora.pop.ap_id
          on apflora.pop.id = apflora.tpop.pop_id
        on apflora.tpop.id = apflora.tpopber.tpop_id
      WHERE
        apflora.tpopber.jahr = $3
        and apflora.ap.id = $2
        and apflora.ap.proj_id = $1
    )
    ORDER BY apflora.tpop.nr, apflora.tpop.nr
  $$
  LANGUAGE sql STABLE;
ALTER FUNCTION apflora.q_tpop_ohne_tpopber(projid uuid, apid uuid, berichtjahr integer)
  OWNER TO postgres;
