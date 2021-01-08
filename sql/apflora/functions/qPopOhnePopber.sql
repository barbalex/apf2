DROP FUNCTION IF EXISTS apflora.q_pop_ohne_popber(projid uuid, apid uuid, berichtjahr integer);
CREATE OR REPLACE FUNCTION apflora.q_pop_ohne_popber(projid uuid, apid uuid, berichtjahr integer)
  RETURNS setof apflora.q_pop_ohne_popber AS
  $$
  SELECT DISTINCT
    apflora.ap.proj_id,
    apflora.pop.ap_id,
    apflora.pop.id,
    apflora.pop.nr
  FROM
    apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.pop.ap_id = apflora.ap.id
  WHERE
    apflora.pop.id IN (
      SELECT distinct
        apflora.tpop.pop_id
      FROM
        apflora.tpop
        inner join apflora.pop
          inner join apflora.ap
          on apflora.ap.id = apflora.pop.ap_id
        on apflora.pop.id = apflora.tpop.pop_id
      WHERE
        apflora.tpop.apber_relevant = true
        and apflora.ap.id = $2
        and apflora.ap.proj_id = $1
        and apflora.tpop.id IN (
          -- mit Kontrolle im Berichtjahr
          SELECT DISTINCT
            apflora.tpopkontr.tpop_id
          FROM
            apflora.tpopkontr
          WHERE
            apflora.tpopkontr.typ NOT IN ('Zwischenziel', 'Ziel')
            and apflora.tpopkontr.jahr = $3
        )
    )
    and apflora.pop.id NOT IN (
      -- mit PopBer im Berichtjahr
      SELECT DISTINCT
        apflora.popber.pop_id
      FROM
        apflora.popber
          inner join apflora.pop
            inner join apflora.ap
            on apflora.ap.id = apflora.pop.ap_id
          on apflora.pop.id = apflora.popber.pop_id
      WHERE
        apflora.popber.jahr = $3
        and apflora.ap.id = $2
        and apflora.ap.proj_id = $1
    )
    and apflora.pop.ap_id = $2
    and apflora.ap.proj_id = $1
    ORDER BY apflora.pop.nr
  $$
  LANGUAGE sql STABLE;
ALTER FUNCTION apflora.q_pop_ohne_popber(projid uuid, apid uuid, berichtjahr integer)
  OWNER TO postgres;
