CREATE OR REPLACE FUNCTION beob_extract_geompoint(_beob apflora.beob)
  RETURNS geometry
  AS $$
DECLARE
  result text;
BEGIN
  IF _beob.quelle = 'EvAB 2016' THEN
    result = ST_Transform(ST_SetSRID(ST_MakePoint((_beob.data ->> 'COORDONNEE_FED_E')::numeric,(_beob.data ->> 'COORDONNEE_FED_N')::numeric), 21781), 4326);
    elseif _beob.quelle = 'Info Flora 2017' THEN
    -- some use x_swiss, some FNS_XGIS!!! Some even have null values...
    -- WORSE: those with x_swiss have srid 2056, those with FNS_XGIS have srid 21781!!!
    IF _beob.data ->> 'FNS_XGIS' IS NOT NULL THEN
      result = ST_Transform(ST_SetSRID(ST_MakePoint((_beob.data ->> 'FNS_XGIS')::numeric,(_beob.data ->> 'FNS_YGIS')::numeric), 21781), 4326);
    ELSE
      result = ST_Transform(ST_SetSRID(ST_MakePoint((_beob.data ->> 'x_swiss')::numeric,(_beob.data ->> 'y_swiss')::numeric), 2056), 4326);
    END IF;
    elseif _beob.quelle IN ('Info Flora 2021.05', 'Info Flora 2022.03', 'Info Flora 2022.12 gesamt', 'Info Flora 2022.01', 'Info Flora 2023.02 Utricularia', 'Info Flora 2022.08', 'Info Flora 2022.04', 'Info Flora 2022.12 Auszug') THEN
    result = ST_Transform(ST_SetSRID(ST_MakePoint((_beob.data ->> 'x_swiss')::numeric,(_beob.data ->> 'y_swiss')::numeric), 2056), 4326);
  ELSE
    -- floz has no coordinates in data, so return existing geometry - if any
    result = _beob.geom_point;
  END IF;
  RETURN result;
END;
$$
LANGUAGE plpgsql;

-- test:
SELECT
  quelle,
  ST_X(ST_Transform(beob_extract_geompoint(beob), 2056)) AS extracted_x,
  ST_Y(ST_Transform(beob_extract_geompoint(beob), 2056)) AS extracted_y,
  ST_X(ST_Transform(geom_point, 2056)) AS x,
  ST_Y(ST_Transform(geom_point, 2056)) AS y,
  ST_Distance(beob_extract_geompoint(beob), geom_point) AS distance,
  data
FROM
  apflora.beob beob
WHERE
  geom_point IS NOT NULL
  AND beob_extract_geompoint(beob) IS NOT NULL
  AND NOT ST_Equals(beob_extract_geompoint(beob), geom_point)
ORDER BY
  distance DESC;

-- 443'184 rows, 2 distance 25, rest below 0.6
--
-- TODO: correct:
UPDATE
  apflora.beob beob1
SET
  geom_point =(
    SELECT
      beob_extract_geompoint(beob2)
    FROM
      apflora.beob beob2
    WHERE
      beob1.id = beob2.id)
WHERE
  beob1.id IN (
    SELECT
      id
    FROM
      apflora.beob beob3
    WHERE
      NOT ST_Equals(beob3.geom_point, beob_extract_geompoint(beob3)));

-- 443'184 rows affected
--
-- conrol: repeat above query and get 0 rows
