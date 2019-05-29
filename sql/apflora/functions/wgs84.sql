-- long term solution (PG v12): computed columns, see https://stackoverflow.com/a/8250729/712005
-- meanwhile use separate solutions for inside postgres and postgraphile

-- this works for queries inside postgres
-- query like this: select tpop.wgs84_lat, x, tpop.wgs84_long, y from apflora.tpop;
-- 1. tpop
drop function if exists wgs84_lat(apflora.tpop);
CREATE OR REPLACE FUNCTION wgs84_lat(apflora.tpop)
  RETURNS float8 AS
$func$
    select ST_X(geom_point) from apflora.tpop where apflora.tpop.id = $1.id
$func$ LANGUAGE SQL STABLE;
drop function if exists wgs84_long(apflora.tpop);
CREATE OR REPLACE FUNCTION wgs84_long(apflora.tpop)
  RETURNS float8 AS
$func$
    select ST_Y(geom_point) from apflora.tpop where apflora.tpop.id = $1.id
$func$ LANGUAGE SQL STABLE;

-- this works for postgraphile
drop function if exists apflora.tpop_wgs84lat(tpop apflora.tpop);
CREATE OR REPLACE FUNCTION apflora.tpop_wgs84lat(tpop apflora.tpop) RETURNS float8 AS $$
  select ST_X(tpop.geom_point)
$$ LANGUAGE sql STABLE;
drop function if exists apflora.tpop_wgs84long(tpop apflora.tpop);
CREATE OR REPLACE FUNCTION apflora.tpop_wgs84long(tpop apflora.tpop) RETURNS float8 AS $$
  select ST_Y(tpop.geom_point)
$$ LANGUAGE sql STABLE;

-- 2. pop
drop function if exists wgs84_lat(apflora.pop);
CREATE OR REPLACE FUNCTION wgs84_lat(apflora.pop)
  RETURNS float8 AS
$func$
    select ST_X(geom_point) from apflora.pop where apflora.pop.id = $1.id
$func$ LANGUAGE SQL STABLE;
drop function if exists wgs84_long(apflora.pop);
CREATE OR REPLACE FUNCTION wgs84_long(apflora.pop)
  RETURNS float8 AS
$func$
    select ST_Y(geom_point) from apflora.pop where apflora.pop.id = $1.id
$func$ LANGUAGE SQL STABLE;

-- this works for postgraphile
drop function if exists apflora.pop_wgs84lat(pop apflora.pop);
CREATE OR REPLACE FUNCTION apflora.pop_wgs84lat(pop apflora.pop) RETURNS float8 AS $$
  select ST_X(pop.geom_point)
$$ LANGUAGE sql STABLE;
drop function if exists apflora.pop_wgs84long(pop apflora.pop);
CREATE OR REPLACE FUNCTION apflora.pop_wgs84long(pop apflora.pop) RETURNS float8 AS $$
  select ST_Y(pop.geom_point)
$$ LANGUAGE sql STABLE;

-- 3. beob
drop function if exists wgs84_lat(apflora.beob);
CREATE OR REPLACE FUNCTION wgs84_lat(apflora.beob)
  RETURNS float8 AS
$func$
    select ST_X(geom_point) from apflora.beob where apflora.beob.id = $1.id
$func$ LANGUAGE SQL STABLE;
drop function if exists wgs84_long(apflora.beob);
CREATE OR REPLACE FUNCTION wgs84_long(apflora.beob)
  RETURNS float8 AS
$func$
    select ST_Y(geom_point) from apflora.beob where apflora.beob.id = $1.id
$func$ LANGUAGE SQL STABLE;

-- this works for postgraphile
drop function if exists apflora.beob_wgs84lat(beob apflora.beob);
CREATE OR REPLACE FUNCTION apflora.beob_wgs84lat(beob apflora.beob) RETURNS float8 AS $$
  select ST_X(beob.geom_point)
$$ LANGUAGE sql STABLE;
drop function if exists apflora.beob_wgs84long(beob apflora.beob);
CREATE OR REPLACE FUNCTION apflora.beob_wgs84long(beob apflora.beob) RETURNS float8 AS $$
  select ST_Y(beob.geom_point)
$$ LANGUAGE sql STABLE;