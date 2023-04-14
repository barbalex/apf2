CREATE OR REPLACE FUNCTION beob_extract_datum(_beob apflora.beob)
  RETURNS date
  AS $$
BEGIN
  CASE _beob.quelle
  WHEN 'FloZ 2017' THEN
    RETURN format('%s-%s-%s', _beob.data ->> 'YEAR_COLLE', coalesce(greatest(_beob.data ->> 'MONTH_COLL', 1), '1'), coalesce(greatest(_beob.data ->> 'DAY_COLLEC', 1), '1'))::date;
  WHEN _beob.quelle IN('EvAB 2016', 'Info Flora 2017', 'Info Flora 2021.05', 'Info Flora 2022.03', 'Info Flora 2022.12 gesamt', 'Info Flora 2022.01', 'Info Flora 2023.02 Utricularia', 'Info Flora 2022.08', 'Info Flora 2022.04', 'Info Flora 2022.12 Auszug') THEN
    RETURN format('%s-%s-%s', _beob.data ->> 'obs_year', coalesce(greatest(_beob.data ->> 'obs_month', 1), '1'), coalesce(greatest(_beob.data ->> 'obs_day', 1), '1'))::date;
  ELSE
    RETURN _beob.datum;
  END CASE;
END;
$$
LANGUAGE plpgsql;

