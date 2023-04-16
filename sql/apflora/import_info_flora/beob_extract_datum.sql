CREATE OR REPLACE FUNCTION beob_extract_datum(_beob apflora.beob)
  RETURNS date
  AS $$
DECLARE
  result text;
BEGIN
  IF _beob.quelle = 'FloZ 2017' THEN
    IF _beob.data ->> 'YEAR_COLLE' IS NULL OR _beob.data ->> 'YEAR_COLLE' = '0' THEN
      result = NULL;
    ELSE
      result = format('%s-%s-%s', _beob.data ->> 'YEAR_COLLE', coalesce(greatest((_beob.data ->> 'MONTH_COLL')::int, 1), '1'), coalesce(greatest((_beob.data ->> 'DAY_COLLEC')::int, 1), '1'))::date;
    END IF;
    elseif _beob.quelle IN ('EvAB 2016', 'Info Flora 2017', 'Info Flora 2021.05', 'Info Flora 2022.03', 'Info Flora 2022.12 gesamt', 'Info Flora 2022.01', 'Info Flora 2023.02 Utricularia', 'Info Flora 2022.08', 'Info Flora 2022.04', 'Info Flora 2022.12 Auszug') THEN
    IF _beob.data ->> 'obs_year' IS NULL OR _beob.data ->> 'obs_year' = '0' THEN
      result = NULL;
    ELSE
      result = format('%s-%s-%s', _beob.data ->> 'obs_year', coalesce(greatest((_beob.data ->> 'obs_month')::int, 1), '1'), coalesce(greatest((_beob.data ->> 'obs_day')::int, 1), '1'))::date;
    END IF;
  ELSE
    result = _beob.datum;
  END IF;
  RETURN result;
END;
$$
LANGUAGE plpgsql;

-- test:
SELECT
  tax.taxonomie_name,
  tax.artname,
  pop.nr AS pop_nr,
  tpop.nr AS tpop_nr,
  beob.quelle,
  beob_extract_datum(beob) AS datum_extracted,
  beob.datum,
  beob.data
FROM
  apflora.beob beob
  LEFT JOIN apflora.ae_taxonomies tax ON beob.art_id = tax.id
  LEFT JOIN apflora.tpop tpop ON beob.tpop_id = tpop.id
  LEFT JOIN apflora.pop pop ON tpop.pop_id = pop.id
WHERE
  beob.datum <> beob_extract_datum(beob)
ORDER BY
  tax.artname,
  pop.nr,
  tpop.nr;

-- 518 rows
