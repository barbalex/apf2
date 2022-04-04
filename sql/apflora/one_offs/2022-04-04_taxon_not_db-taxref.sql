SELECT
  tax.artname,
  ap_bearbstand_werte.text
FROM
  apflora.ae_taxonomies tax
  INNER JOIN apflora.ap ap ON ap.art_id = tax.id
  LEFT JOIN apflora.ap_bearbstand_werte ON ap.bearbeitung = apflora.ap_bearbstand_werte.code
WHERE
  tax.taxonomie_name = 'SISF (2005)'
ORDER BY
  tax.artname;

