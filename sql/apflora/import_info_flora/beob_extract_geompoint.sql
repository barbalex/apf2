CREATE OR REPLACE FUNCTION beob_extract_geompoint(_beob apflora.beob)
  RETURNS date
  AS $$
BEGIN
  CASE _beob.quelle
  WHEN 'EvAB 2016' THEN
    RETURN ST_Transform(ST_SetSRID(ST_MakePoint(_beob.data ->> 'COORDONNEE_FED_E'::int, _beob.data ->> 'COORDONNEE_FED_N'::int), 21781), 4326)
  WHEN 'Info Flora 2017' THEN
    RETURN ST_Transform(ST_SetSRID(ST_MakePoint(_beob.data ->> 'FNS_XGIS'::int, _beob.data ->> 'FNS_YGIS'::int), 21781), 4326)
  WHEN IN('Info Flora 2021.05', 'Info Flora 2022.03', 'Info Flora 2022.12 gesamt', 'Info Flora 2022.01', 'Info Flora 2023.02 Utricularia', 'Info Flora 2022.08', 'Info Flora 2022.04', 'Info Flora 2022.12 Auszug') THEN
    RETURN ST_Transform(ST_SetSRID(ST_MakePoint(_beob.data ->> 'x_swiss'::int, _beob.data ->> 'y_swiss'::int), 2056), 4326)
  ELSE
    -- floz has no coordinates in data, so return existing geometry - if any
    RETURN _beob.geom_point
  END CASE;
END;
$$
LANGUAGE plpgsql;

