-- add this to ensure only valid values are returned (no infinite)
CREATE OR REPLACE FUNCTION is_valid_coordinates(geometry) RETURNS boolean AS
  'SELECT ST_XMin($1) >= -180 AND ST_XMax($1) <= 180 AND
          ST_YMin($1) >= -90 AND ST_YMax($1) <= 90;'
  LANGUAGE sql IMMUTABLE STRICT;
  
  
  -- long term solution (PG v12): computed columns, see https://stackoverflow.com/a/8250729/712005
-- meanwhile use separate solutions for inside postgres and postgraphile

-- this works for queries inside postgres
-- query like this: select tpop.lv95_x, x, tpop.lv95_y, y from apflora.tpop;
-- 1. tpop
-- drop function if exists apflora.lv95_x(apflora.tpop);
-- drop function if exists lv95_x(apflora.tpop);
CREATE OR REPLACE FUNCTION lv95_x(apflora.tpop)
  RETURNS float8 AS
$func$
    select round(ST_X(ST_Transform(geom_point, 2056))) from apflora.tpop where apflora.tpop.id = $1.id and is_valid_coordinates(geom_point) = true
$func$ LANGUAGE SQL STABLE;
-- drop function if exists apflora.lv95_y(apflora.tpop);
-- drop function if exists lv95_y(apflora.tpop);
CREATE OR REPLACE FUNCTION lv95_y(apflora.tpop)
  RETURNS float8 AS
$func$
    select round(ST_Y(ST_Transform(geom_point, 2056))) from apflora.tpop where apflora.tpop.id = $1.id and is_valid_coordinates(geom_point) = true
$func$ LANGUAGE SQL STABLE;

-- this works for postgraphile
-- drop function if exists apflora.tpop_lv95x(tpop apflora.tpop);
CREATE OR REPLACE FUNCTION apflora.tpop_lv95x(tpop apflora.tpop) RETURNS float8 AS $$
  select round(ST_X(ST_Transform(tpop.geom_point, 2056))) where is_valid_coordinates(tpop.geom_point) = true
$$ LANGUAGE sql STABLE;
-- drop function if exists apflora.tpop_lv95y(tpop apflora.tpop);
CREATE OR REPLACE FUNCTION apflora.tpop_lv95y(tpop apflora.tpop) RETURNS float8 AS $$
  select round(ST_Y(ST_Transform(tpop.geom_point, 2056))) where is_valid_coordinates(tpop.geom_point) = true
$$ LANGUAGE sql STABLE;

-- 2. pop
-- drop function if exists apflora.lv95_x(apflora.pop);
-- drop function if exists lv95_x(apflora.pop);
CREATE OR REPLACE FUNCTION lv95_x(apflora.pop)
  RETURNS float8 AS
$func$
    select round(ST_X(ST_Transform(geom_point, 2056))) from apflora.pop where apflora.pop.id = $1.id and is_valid_coordinates(geom_point) = true
$func$ LANGUAGE SQL STABLE;
-- drop function if exists apflora.lv95_y(apflora.pop);
-- drop function if exists lv95_y(apflora.pop);
CREATE OR REPLACE FUNCTION lv95_y(apflora.pop)
  RETURNS float8 AS
$func$
    select round(ST_Y(ST_Transform(geom_point, 2056))) from apflora.pop where apflora.pop.id = $1.id and is_valid_coordinates(geom_point) = true
$func$ LANGUAGE SQL STABLE;

-- this works for postgraphile
-- drop function if exists apflora.pop_lv95x(pop apflora.pop);
CREATE OR REPLACE FUNCTION apflora.pop_lv95x(pop apflora.pop) RETURNS float8 AS $$
  select round(ST_X(ST_Transform(pop.geom_point, 2056))) where is_valid_coordinates(pop.geom_point) = true
$$ LANGUAGE sql STABLE;
-- drop function if exists apflora.pop_lv95y(pop apflora.pop);
CREATE OR REPLACE FUNCTION apflora.pop_lv95y(pop apflora.pop) RETURNS float8 AS $$
  select round(ST_Y(ST_Transform(pop.geom_point, 2056))) where is_valid_coordinates(pop.geom_point) = true
$$ LANGUAGE sql STABLE;

-- 3. beob
-- drop function if exists apflora.lv95_x(apflora.beob);
-- drop function if exists lv95_x(apflora.beob);
CREATE OR REPLACE FUNCTION lv95_x(apflora.beob)
  RETURNS float8 AS
$func$
    select round(ST_X(ST_Transform(geom_point, 2056))) from apflora.beob where apflora.beob.id = $1.id and is_valid_coordinates(geom_point) = true
$func$ LANGUAGE SQL STABLE;
-- drop function if exists apflora.lv95_y(apflora.beob);
-- drop function if exists lv95_y(apflora.beob);
CREATE OR REPLACE FUNCTION lv95_y(apflora.beob)
  RETURNS float8 AS
$func$
    select round(ST_Y(ST_Transform(geom_point, 2056))) from apflora.beob where apflora.beob.id = $1.id and is_valid_coordinates(geom_point) = true
$func$ LANGUAGE SQL STABLE;

-- this works for postgraphile
-- drop function if exists apflora.beob_lv95x(beob apflora.beob);
CREATE OR REPLACE FUNCTION apflora.beob_lv95x(beob apflora.beob) RETURNS float8 AS $$
  select round(ST_X(ST_Transform(beob.geom_point, 2056))) where is_valid_coordinates(beob.geom_point) = true
$$ LANGUAGE sql STABLE;
-- drop function if exists apflora.beob_lv95y(beob apflora.beob);
CREATE OR REPLACE FUNCTION apflora.beob_lv95y(beob apflora.beob) RETURNS float8 AS $$
  select round(ST_Y(ST_Transform(beob.geom_point, 2056))) where is_valid_coordinates(beob.geom_point) = true
$$ LANGUAGE sql STABLE;