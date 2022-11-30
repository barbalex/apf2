INSERT INTO apflora.ae_taxonomies (id, taxonomie_id, taxonomie_name, taxid, familie, artname, tax_art_name)
SELECT
  id,
  taxonomie_id,
  taxonomie_name,
  taxid,
  familie,
  artname,
  'Info Flora 2005: ' || artname
FROM
  apflora.ae_taxonomies_download
WHERE
  id = 'b659268a-70da-11ed-939e-c7c20ef69cb8';

