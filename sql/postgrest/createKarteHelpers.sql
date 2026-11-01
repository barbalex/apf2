-- click-helper RPCs for the Karte ClickListener: PostGIS point/polygon
-- queries that PostgREST URL params cannot express. Each takes the clicked
-- wgs84 point (or a polygon GeoJSON for Markierungen) and returns jsonb.
BEGIN;

-- the gemeinde containing the point (reuse of get_gemeinde, shape-compatible)
create or replace function apflora.get_gemeinde_at_point(p_lng double precision, p_lat double precision)
returns jsonb
language sql
stable
security invoker
as $fn$
  select jsonb_build_object('id', t.id, 'text', t.text)
  from apflora.ch_administrative_unit t
  where t.localisedcharacterstring = 'Gemeinde'
    and public.st_contains(
      t.geom,
      public.st_setsrid(public.st_makepoint(p_lng, p_lat), 4326)
    )
  order by t.id
  limit 1
$fn$;

-- the betreuungsgebiet containing the point
create or replace function apflora.get_betreuungsgebiet_at_point(p_lng double precision, p_lat double precision)
returns jsonb
language sql
stable
security invoker
as $fn$
  select jsonb_build_object(
    'gebiet_nr', t.gebiet_nr, 'gebiet_name', t.gebiet_name,
    'firma', t.firma, 'projektleiter', t.projektleiter, 'telefon', t.telefon)
  from apflora.ns_betreuung t
  where public.st_contains(
    t.geom,
    public.st_setsrid(public.st_makepoint(p_lng, p_lat), 4326)
  )
  limit 1
$fn$;

-- the detailplan intersecting the point
create or replace function apflora.get_detailplan_at_point(p_lng double precision, p_lat double precision)
returns jsonb
language sql
stable
security invoker
as $fn$
  select jsonb_build_object('id', t.id, 'data', t.data)
  from apflora.detailplaene t
  where public.st_intersects(
    t.geom,
    public.st_setsrid(public.st_makepoint(p_lng, p_lat), 4326)
  )
  limit 1
$fn$;

-- the markierungen covered by the given polygon GeoJSON (click circle)
create or replace function apflora.get_markierungen_in_polygon(p_polygon jsonb)
returns jsonb
language sql
stable
security invoker
as $fn$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.ogc_fid, 'gebiet', t.gebiet,
    'pfostennum', t.pfostennum, 'markierung', t.markierung)), '[]'::jsonb)
  from apflora.markierungen t
  where public.st_coveredby(
    t.wkb_geometry,
    public.st_setsrid(public.st_geomfromgeojson(p_polygon::text), 4326)
  )
$fn$;

revoke execute on function apflora.get_gemeinde_at_point(double precision, double precision) from public;
revoke execute on function apflora.get_betreuungsgebiet_at_point(double precision, double precision) from public;
revoke execute on function apflora.get_detailplan_at_point(double precision, double precision) from public;
revoke execute on function apflora.get_markierungen_in_polygon(jsonb) from public;
grant execute on function apflora.get_gemeinde_at_point(double precision, double precision) to
  apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;
grant execute on function apflora.get_betreuungsgebiet_at_point(double precision, double precision) to
  apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;
grant execute on function apflora.get_detailplan_at_point(double precision, double precision) to
  apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;
grant execute on function apflora.get_markierungen_in_polygon(jsonb) to
  apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

COMMIT;
