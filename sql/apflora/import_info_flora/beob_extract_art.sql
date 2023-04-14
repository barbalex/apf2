CREATE OR REPLACE FUNCTION beob_extract_art(_beob apflora.beob)
  RETURNS integer
  AS $$
BEGIN
  CASE _beob.quelle
  WHEN 'EvAB 2016' THEN
    RETURN(
      SELECT
        id
      FROM
        apflora.ae_taxonomies tax
      WHERE
        tax.taxid = _beob.data ->> 'NO_ISFS'::bigint
        AND tax.taxonomie_name = 'SISF (2005)')::int;
  WHEN 'Info Flora 2017' THEN
    RETURN COALESCE((
      SELECT
        id
      FROM apflora.ae_taxonomies tax
      WHERE
        tax.taxid_intern = _beob.data ->> 'tax_id_intern'::int
        AND tax.taxonomie_name = 'DB-TAXREF (2017)'),(
      SELECT
        id
      FROM apflora.ae_taxonomies tax
    WHERE
      tax.taxid = _beob.data ->> 'NO_ISFS'::bigint
      AND tax.taxonomie_name = 'SISF (2005)'))::int;
  WHEN 'FloZ 2017' THEN
    RETURN(
      SELECT
        id
      FROM
        apflora.ae_taxonomies tax
      WHERE
        tax.taxid = _beob.data ->> 'SISF_ID'::bigint
        AND tax.taxonomie_name = 'SISF (2005)')::int;
  WHEN _beob.quelle IN('Info Flora 2022.12 gesamt', 'Info Flora 2022.12 Auszug', 'Info Flora 2022.04', 'Info Flora 2022.08', 'Info Flora 2023.02 Utricularia', 'Info Flora 2022.01', 'Info Flora 2022.03''Info Flora 2021.05') THEN
    RETURN COALESCE((
      SELECT
        id
      FROM apflora.ae_taxonomies tax
    WHERE
      tax.taxid_intern = _beob.data ->> 'tax_id_intern'::int
      AND tax.taxonomie_name = 'DB-TAXREF (2017)'),(
    SELECT
      id
    FROM apflora.ae_taxonomies tax
  WHERE
    tax.taxid = _beob.data ->> 'no_isfs'::bigint
    AND tax.taxonomie_name = 'SISF (2005)'))::int;
  ELSE
    RETURN _beob.art_id;
  END CASE;
END;
$$
LANGUAGE plpgsql;

