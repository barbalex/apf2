CREATE OR REPLACE FUNCTION beob_extract_art(_beob apflora.beob)
  RETURNS uuid
  AS $$
DECLARE
  result text;
BEGIN
  IF _beob.quelle = 'EvAB 2016' THEN
    result =(
      SELECT
        id
      FROM
        apflora.ae_taxonomies tax
      WHERE
        tax.taxid =(_beob.data ->> 'NO_ISFS')::int
        AND tax.taxonomie_name = 'SISF (2005)');
    ELSEIF _beob.quelle = 'Info Flora 2017' THEN
    result = COALESCE((
      SELECT
        id
      FROM apflora.ae_taxonomies tax
      WHERE
        tax.taxid =(_beob.data ->> 'NO_ISFS')::int
      AND tax.taxonomie_name = 'DB-TAXREF (2017)'),(
      SELECT
        id
      FROM apflora.ae_taxonomies tax
      WHERE
        tax.taxid =(_beob.data ->> 'NO_ISFS')::int
      AND tax.taxonomie_name = 'SISF (2005)'));
    ELSEIF _beob.quelle = 'FloZ 2017' THEN
    result =(
      SELECT
        id
      FROM
        apflora.ae_taxonomies tax
      WHERE
        tax.taxid =(_beob.data ->> 'SISF_ID')::int
        AND tax.taxonomie_name = 'SISF (2005)');
    ELSEIF _beob.quelle IN ('Info Flora 2022.12 gesamt', 'Info Flora 2022.12 Auszug', 'Info Flora 2022.04', 'Info Flora 2022.08', 'Info Flora 2023.02 Utricularia', 'Info Flora 2022.01', 'Info Flora 2022.03', 'Info Flora 2021.05') THEN
    result = COALESCE((
      SELECT
        id
      FROM apflora.ae_taxonomies tax
      WHERE
        tax.taxid_intern =(_beob.data ->> 'tax_id_intern')::int
      AND tax.taxonomie_name = 'DB-TAXREF (2017)'),(
      SELECT
        id
      FROM apflora.ae_taxonomies tax
      WHERE
        tax.taxid =(_beob.data ->> 'no_isfs')::int
      AND tax.taxonomie_name = 'SISF (2005)'));
  ELSE
    result = _beob.art_id;
  END IF;
  RETURN result;
END;
$$
LANGUAGE plpgsql;

-- test:
SELECT
  quelle,
  beob.art_id AS art_id,
  beob_extract_art(beob) AS extracted_art_id,
  art_id_original,
  data
FROM
  apflora.beob beob
WHERE
  art_id <> beob_extract_art(beob)
  AND art_id = art_id_original;

-- TODO: correct:
UPDATE
  apflora.beob beob1
SET
  art_id =(
    SELECT
      beob_extract_art(beob2)
    FROM
      apflora.beob beob2
    WHERE
      beob1.id = beob2.id
      AND beob2.art_id <> beob_extract_art(beob2)
      AND beob2.art_id = beob2.art_id_original)
WHERE
  beob1.id IN (
    SELECT
      id
    FROM
      apflora.beob beob3
    WHERE
      art_id <> beob_extract_art(beob3)
      AND art_id = art_id_original);

-- 2023.04.15: 202'346 rows affected
