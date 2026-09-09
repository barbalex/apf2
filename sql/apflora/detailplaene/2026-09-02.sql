-- 1. open shp in qgis
-- 2. export as sql dump (new.sql)
-- 3. edit dump to create deateilplaene_in in apflora
-- 5. insert. 23 inserted
INSERT INTO apflora.detailplaene(data, geom, changed_by)
SELECT
  jsonb_build_object('ogc_fid', dp.ogc_fid, 'typ', dp.typ_, 'bemerkung', dp.bemerkung) AS data,
  wkb_geometry AS geom,
  'ag' AS changed_by
FROM
  apflora.detailplaene_in dp;

