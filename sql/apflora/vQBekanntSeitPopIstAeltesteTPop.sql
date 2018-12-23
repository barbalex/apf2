DROP VIEW IF EXISTS apflora.v_q_tpop_bekanntseit_juenger_als_aelteste_beob CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_tpop_bekanntseit_juenger_als_aelteste_beob AS
SELECT
  apflora.projekt.id as proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.tpop.pop_id = apflora.pop.id
      ON apflora.pop.ap_id = apflora.ap.id
    ON apflora.projekt.id = apflora.ap.proj_id
WHERE
  apflora.tpop.bekannt_seit > (
    SELECT min(
      date_part('year', apflora.beob.datum)
    ) AS "MinJahr"
    FROM apflora.beob
    WHERE tpop_id = apflora.tpop.id
    GROUP BY tpop_id
  )
ORDER BY
  apflora.projekt.id,
  apflora.ap.id,
  apflora.pop.nr,
  apflora.tpop.nr;