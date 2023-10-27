-- 1. open shp in qgis
-- 2. export as sql dump
-- 3. edit dump to create deateilplaene_in in apflora
-- 4. remove data to be replaced: edit in qgis. 82 removed
-- 5. insert. 81 inserted
INSERT INTO apflora.detailplaene(data, geom, changed_by)
SELECT
  jsonb_build_object('ogc_fid', dp.ogc_fid, 'nr', dp.nr, 'typ', dp.typ) AS data,
  wkb_geometry AS geom,
  'ag' AS changed_by
FROM
  apflora.detailplaene_in dp;

