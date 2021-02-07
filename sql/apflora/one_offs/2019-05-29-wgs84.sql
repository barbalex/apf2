-- 1. prepare new structure (done)
select AddGeometryColumn ('apflora', 'tpop', 'geom_point', 4326, 'POINT', 2);
select AddGeometryColumn ('apflora', 'pop', 'geom_point', 4326, 'POINT', 2);
select AddGeometryColumn ('apflora', 'beob', 'geom_point', 4326, 'POINT', 2);

-- query and visualize:
-- select ST_Transform(ST_SetSRID(ST_MakePoint(x, y), 2056), 4326) from apflora.tpop where x is not null and y is not null;

-- 2. update from existing data
-- need to flip weirdly as x and y are wrong way round
update apflora.tpop set geom_point = ST_Transform(ST_FlipCoordinates(ST_SetSRID(ST_MakePoint(y, x), 2056)), 4326) where x is not null and y is not null;
update apflora.pop set geom_point = ST_Transform(ST_FlipCoordinates(ST_SetSRID(ST_MakePoint(y, x), 2056)), 4326) where x is not null and y is not null;
update apflora.beob set geom_point = ST_Transform(ST_FlipCoordinates(ST_SetSRID(ST_MakePoint(y, x), 2056)), 4326) where x is not null and y is not null;

-- query to check
-- select geom_point, round(ST_X(ST_Transform(geom_point, 2056))), x, round(ST_Y(ST_Transform(geom_point, 2056))), y, ST_AsKML(geom_point) from apflora.tpop;

-- 3. run lv95.sql and wgs84.sql (done)

-- drop x and y fields
ALTER TABLE apflora.tpop DROP COLUMN x cascade;
ALTER TABLE apflora.tpop DROP COLUMN y cascade;
ALTER TABLE apflora.pop DROP COLUMN x cascade;
ALTER TABLE apflora.pop DROP COLUMN y cascade;
ALTER TABLE apflora.beob DROP COLUMN x cascade;
ALTER TABLE apflora.beob DROP COLUMN y cascade;
-- re-run all views