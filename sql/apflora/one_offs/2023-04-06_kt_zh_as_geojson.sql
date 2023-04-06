-- prepared but not in use in app
SELECT
  geom
FROM
  apflora.ch_administrative_unit
WHERE
  id = 315;

SELECT
  json_build_object('type', 'FeatureCollection', 'features', json_agg(ST_AsGeoJSON(t.*)::json))
FROM (
  SELECT
    geom
  FROM
    apflora.ch_administrative_unit
  WHERE
    id = 315) AS t;

SELECT
  json_build_object('type', 'FeatureCollection', 'features', json_agg(ST_AsGeoJSON(t.*)::json)) AS json
FROM (
  SELECT
    geom
  FROM
    apflora.ch_administrative_unit
  WHERE
    id = 315) AS t;

-- then extract: json.features[0].geometry
DROP VIEW IF EXISTS apflora.v_kt_zh_geo CASCADE;

CREATE OR REPLACE VIEW apflora.v_kt_zh_geo AS
SELECT
  json_build_object('type', 'FeatureCollection', 'features', json_agg(ST_AsGeoJSON(t.*)::json)) AS json
FROM (
  SELECT
    geom
  FROM
    apflora.ch_administrative_unit
  WHERE
    id = 315) AS t;

-- query, then extract:
-- 1. const geojson = JSON.parse(result.data.allVKtZhGeos.nodes[0].json)
-- 2. const ktzhGeojson = geojson.features[0].geometry
