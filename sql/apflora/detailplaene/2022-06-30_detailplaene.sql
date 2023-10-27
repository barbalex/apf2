-- new table:
-- CREATE TABLE IF NOT EXISTS apflora.detailplaene (
--   id uuid PRIMARY KEY DEFAULT uuid_generate_v1mc (),
--   data jsonb DEFAULT NULL,
--   geom geometry(MultiPolygon, 4326) DEFAULT NULL,
--   created_at timestamptz NOT NULL DEFAULT now(),
--   updated_at timestamptz NOT NULL DEFAULT now(),
--   changed_by varchar(20) DEFAULT NULL
-- );
--
-- How to
-- 1. open file in qgis
-- 2. right click layer > export > objekte speichern als > postgresql dump AND KBS EPSG:4326
-- 3. open sql file, rename public to import
-- 4. run sql in pgAdmin to create tables in schema import
-- 5. in below code choose
--    what columns to import
--    how to name them
--    convert real to integer
-- 6. run below code
-- 7. remove tables in schema import
--
-- 1. torfstiche
INSERT INTO apflora.detailplaene (data, geom, changed_by)
SELECT
  jsonb_build_object('nr', dp.nr_def::integer, 'area', dp.shape_area::integer, 'ogc_fid', dp.ogc_fid, 'quelle', 'Charlotte Salzmann', 'import_datum', '2022.06.30') AS data,
  wkb_geometry AS geom,
  'ag' AS changed_by
FROM
  import.torfstiche dp;

-- 2. ambitzgi
INSERT INTO apflora.detailplaene (data, geom, changed_by)
SELECT
  jsonb_build_object('nr', dp.nr, 'area', dp.shape_area::integer, 'objectid', dp.objectid, 'quelle', 'Charlotte Salzmann', 'import_datum', '2022.06.30') AS data,
  wkb_geometry AS geom,
  'ag' AS changed_by
FROM
  import.ambitzgi dp;

