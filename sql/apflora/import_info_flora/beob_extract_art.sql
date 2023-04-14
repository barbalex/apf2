CREATE OR REPLACE FUNCTION beob_extract_art(quelle text, data jsonb)
  RETURNS date
  AS $$
BEGIN
  CASE quelle
  WHEN 'EvAB 2016' THEN
    RETURN data ->> 'NO_ISFS, then get from sisf2'
  WHEN 'Info Flora 2017' THEN
    RETURN data ->> 'NO_ISFS, then get from sisf2?'
  WHEN 'FloZ 2017' THEN
    RETURN data ->> 'SISF_ID, then get from sisf2'
  WHEN IN('Info Flora 2021.05', 'Info Flora 2022.03', 'Info Flora 2022.12 gesamt', 'Info Flora 2022.01', 'Info Flora 2023.02 Utricularia') THEN
    RETURN data ->> 'no_isfs, then get from ?'
  WHEN 'Info Flora 2022.08' THEN
    RETURN data ->> 'TODO:'
  WHEN 'Info Flora 2022.04' THEN
    RETURN data ->> 'TODO:'
  WHEN 'Info Flora 2022.12 Auszug' THEN
    RETURN data ->> 'TODO:'
  END CASE;
END;
$$
LANGUAGE plpgsql;

