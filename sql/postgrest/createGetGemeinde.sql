-- get_gemeinde(p_geom): the municipality containing the given GeoJSON point.
-- Replaces the old PostGraphile connection-filter-postgis query of the
-- Gemeinde-locate button (Tpop form); PostgREST URL params cannot express
-- PostGIS operators.
BEGIN;

create or replace function apflora.get_gemeinde(p_geom jsonb)
returns text
language sql
stable
security invoker
as $fn$
  select t.text
  from apflora.ch_administrative_unit t
  where t.localisedcharacterstring = 'Gemeinde'
    and public.st_containsproperly(
      t.geom,
      public.st_setsrid(public.st_geomfromgeojson(p_geom::text), 4326)
    )
  order by t.id
  limit 1
$fn$;

revoke execute on function apflora.get_gemeinde(jsonb) from public;
grant execute on function apflora.get_gemeinde(jsonb) to
  apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

COMMIT;
