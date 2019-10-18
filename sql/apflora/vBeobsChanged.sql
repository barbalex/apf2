

DROP VIEW IF EXISTS apflora.v_beob_art_changed CASCADE;
CREATE OR REPLACE VIEW apflora.v_beob_art_changed AS
SELECT
  apflora.beob.id,
  apflora.beob_quelle_werte.name AS quelle,
  beob.id_field,
  beob.data->>(SELECT id_field FROM apflora.beob WHERE id = beob2.id) AS "original_id",
  apflora.beob.art_id_original,
  ae_artidoriginal.artname AS "artname_original",
  ae_artidoriginal.taxid AS "taxonomie_id_original",
  apflora.beob.art_id,
  ae_artid.artname AS "artname",
  ae_artid.taxid AS "taxonomie_id",
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.tpop.id AS tpop_id,
  apflora.tpop.nr AS tpop_nr,
  apflora.beob.x,
  apflora.beob.y,
  CASE
    WHEN
      apflora.beob.x > 0
      AND apflora.tpop.x > 0
      AND apflora.beob.y > 0
      AND apflora.tpop.y > 0
    THEN
      round(
        sqrt(
          power((apflora.beob.x - apflora.tpop.x), 2) +
          power((apflora.beob.y - apflora.tpop.y), 2)
        )
      )
    ELSE
      NULL
  END AS distanz_zur_teilpopulation,
  apflora.beob.datum,
  apflora.beob.autor,
  apflora.beob.nicht_zuordnen,
  apflora.beob.bemerkungen,
  apflora.beob.changed,
  apflora.beob.changed_by
FROM
  apflora.beob
  INNER JOIN
    apflora.beob AS beob2
    ON beob2.id = beob.id
  INNER JOIN
    apflora.ae_taxonomies AS ae_artid
    INNER JOIN
      apflora.ap as artidsap
      ON artidsap.art_id = ae_artid.id
    ON apflora.beob.art_id = ae_artid.id
  INNER JOIN
    apflora.ae_taxonomies AS ae_artidoriginal
    INNER JOIN
      apflora.ap as artidoriginalsap
      ON artidoriginalsap.art_id = ae_artidoriginal.id
    ON apflora.beob.art_id_original = ae_artidoriginal.id
  INNER JOIN
    apflora.beob_quelle_werte
    ON beob.quelle_id = beob_quelle_werte.id
  LEFT JOIN
    apflora.tpop
    ON apflora.tpop.id = apflora.beob.tpop_id
    LEFT JOIN
      apflora.pop
      ON apflora.pop.id = apflora.tpop.pop_id
WHERE
  ae_artid.taxid > 150
  and apflora.beob.art_id <> apflora.beob.art_id_original
ORDER BY
  ae_artid.artname ASC,
  apflora.pop.nr ASC,
  apflora.tpop.nr ASC,
  apflora.beob.datum DESC;