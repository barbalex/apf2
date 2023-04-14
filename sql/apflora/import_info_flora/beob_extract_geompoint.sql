CREATE OR REPLACE FUNCTION beob_extract_geompoint(quelle text, data jsonb)
  RETURNS date
  AS $$
BEGIN
  CASE quelle
  WHEN 'EvAB 2016' THEN
    RETURN data ->> 'COORDONNEE_FED_E (ex: 682425), COORDONNEE_FED_N (ex: 258060), TODO: parse'
  WHEN 'Info Flora 2017' THEN
    RETURN data ->> 'FNS_XGIS (ex: 682425), FNS_YGIS (ex: 258060), TODO: parse'
  WHEN 'FloZ 2017' THEN
    RETURN data ->> 'TODO:'
  WHEN IN('Info Flora 2021.05', 'Info Flora 2022.03', 'Info Flora 2022.12 gesamt', 'Info Flora 2022.01', 'Info Flora 2023.02 Utricularia', 'Info Flora 2022.08', 'Info Flora 2022.04', 'Info Flora 2022.12 Auszug') THEN
    RETURN data ->> 'x_swiss (ex: 2712551), y_swiss (ex: 1248936), TODO: parse'
  END CASE;
END;
$$
LANGUAGE plpgsql;

