CREATE OR REPLACE FUNCTION beob_extract_id_field(_beob apflora.beob)
  RETURNS text
  AS $$
DECLARE
  result text;
BEGIN
  IF _beob.quelle = 'EvAB 2016' THEN
    result = _beob.data ->> 'NO_NOTE_PROJET';
    elseif 'Info Flora 2017' THEN
    result = _beob.data ->> 'NO_NOTE';
    elseif 'FloZ 2017' THEN
    result = _beob.data ->> 'BARCODE';
    elseif _beob.quelle IN ('Info Flora 2021.05', 'Info Flora 2022.03', 'Info Flora 2022.12 gesamt', 'Info Flora 2022.01', 'Info Flora 2023.02 Utricularia', 'Info Flora 2022.08', 'Info Flora 2022.04', 'Info Flora 2022.12 Auszug') THEN
    result = _beob.data ->> 'obs_id';
  ELSE
    result = _beob.id_field;
  END IF;
  RETURN result;
END;
$$
LANGUAGE plpgsql;

