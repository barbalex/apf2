WITH multiple_used_taxa AS (
  SELECT
    apart.art_id AS apart_art_id,
    count(apart.id)
  FROM
    apflora.apart apart
  WHERE
    apart.art_id IS NOT NULL
  GROUP BY
    apart.art_id
  HAVING
    count(apart.id) > 1
)
SELECT
  apart.art_id AS apart_art_id,
  tax.tax_art_name AS apart_artname,
  --multiple_used_taxa.count AS apart_count,
  apart.ap_id AS apart_ap_id,
  ap_tax.tax_art_name AS ap_artname
FROM
  apflora.apart apart
  INNER JOIN apflora.ae_taxonomies tax ON tax.id = apart.art_id
  INNER JOIN multiple_used_taxa ON multiple_used_taxa.apart_art_id = apart.art_id
  INNER JOIN apflora.ap ap ON ap.id = apart.ap_id
  INNER JOIN apflora.ae_taxonomies ap_tax ON ap_tax.id = ap.art_id;

