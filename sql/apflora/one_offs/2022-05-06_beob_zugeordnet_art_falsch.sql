-- CREATE OR REPLACE VIEW apflora.v_beob_zugeordnet_art_falsch AS
SELECT
  beob.id AS beob_id,
  beob.art_id AS beob_art_id,
  tax.tax_art_name AS beob_artname,
  ap.art_id AS ap_art_id,
  ap_tax.tax_art_name AS ap_art_artname,
  pop.id AS pop_id,
  pop.nr AS pop_nr,
  tpop.id AS tpop_id,
  tpop.nr AS tpop_nr,
  beob.quelle AS beob_quelle,
  beob.created_at AS beob_created_at,
  beob.updated_at AS beob_updated_at
FROM
  apflora.beob beob
  INNER JOIN apflora.ae_taxonomies tax ON beob.art_id = tax.id
  INNER JOIN apflora.tpop tpop ON tpop.id = beob.tpop_id
  INNER JOIN apflora.pop ON pop.id = tpop.pop_id
  INNER JOIN apflora.ap ap ON ap.id = pop.ap_id
  INNER JOIN apflora.ae_taxonomies ap_tax ON ap_tax.id = ap.art_id
WHERE
  tax.taxid > 150
  AND beob.art_id NOT IN (
    SELECT
      art_id
    FROM
      apflora.apart
    WHERE
      ap_id = ap.id)
ORDER BY
  tax.artname ASC,
  pop.nr ASC,
  tpop.nr ASC;

