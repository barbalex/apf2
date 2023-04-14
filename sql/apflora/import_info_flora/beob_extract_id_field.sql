CREATE OR REPLACE FUNCTION beob_extract_id_field(_beob apflora.beob)
  RETURNS text
  AS $$
DECLARE
  result text;
BEGIN
  CASE _beob.quelle
  WHEN 'EvAB 2016' THEN
    result = _beob.data ->> 'NO_NOTE_PROJET';
  WHEN 'Info Flora 2017' THEN
    result = _beob.data ->> 'NO_NOTE';
  WHEN 'FloZ 2017' THEN
    result = _beob.data ->> 'BARCODE';
  WHEN _beob.quelle IN ('Info Flora 2021.05', 'Info Flora 2022.03', 'Info Flora 2022.12 gesamt', 'Info Flora 2022.01', 'Info Flora 2023.02 Utricularia', 'Info Flora 2022.08', 'Info Flora 2022.04', 'Info Flora 2022.12 Auszug') THEN
    result = _beob.data ->> 'obs_id';
  ELSE
    result = _beob.id_field;
  END CASE;
  RETURN result;
  END;
$$
LANGUAGE plpgsql;

