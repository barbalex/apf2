WITH multiple_used_taxa AS (
  SELECT
    apart.art_id,
    count(apart.id)
  FROM
    apflora.apart apart
    INNER JOIN apflora.ae_taxonomies tax ON tax.id = apart.art_id
    INNER JOIN apflora.ap ap ON ap.id = apart.ap_id
  WHERE
    apart.art_id IS NOT NULL
  GROUP BY
    apart.art_id
  HAVING
    count(apart.id) > 1
)
SELECT
  multiple_used_taxa.art_id as apart_id,
  tax.tax_art_name AS apart_artname,
  multiple_used_taxa.count as apart_count,
  apart.ap_id
FROM
  apflora.apart apart
  INNER JOIN apflora.ae_taxonomies tax ON tax.id = apart.art_id
  INNER JOIN multiple_used_taxa ON multiple_used_taxa.art_id = apart.art_id;

