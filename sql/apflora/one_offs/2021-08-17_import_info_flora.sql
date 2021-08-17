-- 1. import data into temporary table
-- 2. ignore apflora kontrollen: guid in (select id from apflora.tpopkontr)
-- 3. Floz: copyright = "© Flora des Kantons Zürich": only update data
-- 4. extract info flora beob already imported: obs_id = original_id: only update data
-- 5. import rest
-- 00 test sisf2 vs no_isfs of infoflora20210817
select distinct info.no_isfs,
  tax.taxid
from apflora.infoflora20210817 info
  left join apflora.ae_taxonomies tax on tax.taxid = info.no_isfs
order by tax.taxid;
-- 0 create barcode_obs_id compare table
create table apflora.floz2017_id_barcode (id int, barcode text);
create index on apflora.floz2017_id_barcode using btree (id);
create index on apflora.floz2017_id_barcode using btree (barcode);
-- 1. import data into temporary table
create table apflora.infoflora20210817 (
  evab_id uuid,
  interpretation_note text,
  no_isfs integer,
  taxon text,
  validation_status integer,
  determinavit_cf text,
  presence text,
  introduction text,
  obs_day integer,
  obs_month integer,
  obs_year integer,
  date_expert text,
  observers text,
  country text,
  canton text,
  municipality text,
  region_biogeo text,
  spatial_resolution text,
  x_swiss integer,
  y_swiss integer,
  xy_type text,
  xy_radius integer,
  geo_expert text,
  locality_descript text,
  altitude_min integer,
  altitude_max integer,
  altitude_expert text,
  abundance_cat text,
  count_unit text,
  abundance text,
  remarks text,
  typo_ch integer,
  phenology_code integer,
  copyright text,
  obs_id integer primary key,
  obs_type text,
  specimen_type text,
  herbarium_localization text,
  herbarium_collection text,
  reference text,
  native_status text,
  redlist text,
  regional_redlist text,
  priority text,
  measures integer,
  monitoring integer,
  ch_protection integer,
  cantonal_protection integer,
  uzl text,
  wzl text,
  black_list text,
  family text,
  name_de text,
  name_fr text,
  name_it text,
  original_taxon text,
  taxon_expert text,
  determinavit text,
  locality_id integer,
  releve_type text,
  releve_stratum text,
  cover_code text,
  cover_abs real,
  cover_rem text,
  control_type text,
  eradication text
);
create index on apflora.infoflora20210817 using btree (evab_id);
create index on apflora.infoflora20210817 using btree (no_isfs);
create index on apflora.infoflora20210817 using btree (copyright);
create index on apflora.infoflora20210817 using btree (obs_id);
-- 29145 rows
-- 2. ignore apflora kontrollen
select info.obs_id
from apflora.infoflora20210817 info
  inner join apflora.tpopkontr kontr on kontr.id = info.evab_id;
-- 3992 rows
-- 3. Floz: only update data
select *
from apflora.infoflora20210817
where copyright like '© Flora des Kantons Zürich';
-- 265 rows
-- compare with number from floz for these species:
select tax.artname,
  beob.id,
  beob.*
from apflora.beob beob
  inner join apflora.ae_taxonomies tax on tax.id = beob.art_id
where tax.taxid in (
    select distinct no_isfs
    from apflora.infoflora20210817
  )
  and beob.quelle like 'FloZ 2017'
order by tax.artname,
  beob.datum;
-- 2258 rows! WHAT?
-- TODO: update data?
-- test if id from floz2017 equals obs_id from infoflora20210817:
select *
from apflora.infoflora20210817 info
  inner join apflora.floz2017_id_barcode id_barcode on id_barcode.id = info.obs_id;
-- 14 rows - none of them from floz!!!
-- 4. extract info flora beob already imported: obs_id = original_id: only update data
select beob.data->>(beob.id_field) AS "original_id",
  info.*
from apflora.infoflora20210817 info
  inner join apflora.beob beob on (beob.data->>beob.id_field)::text = info.obs_id::text;
-- 3734 rows
-- excluding kontr and floz had no influence
-- TODO: update data?
-- 5. filter
create table apflora.infoflora20210817filtered (
  evab_id uuid,
  interpretation_note text,
  no_isfs integer,
  taxon text,
  validation_status integer,
  determinavit_cf text,
  presence text,
  introduction text,
  obs_day integer,
  obs_month integer,
  obs_year integer,
  date_expert text,
  observers text,
  country text,
  canton text,
  municipality text,
  region_biogeo text,
  spatial_resolution text,
  x_swiss integer,
  y_swiss integer,
  xy_type text,
  xy_radius integer,
  geo_expert text,
  locality_descript text,
  altitude_min integer,
  altitude_max integer,
  altitude_expert text,
  abundance_cat text,
  count_unit text,
  abundance text,
  remarks text,
  typo_ch integer,
  phenology_code integer,
  copyright text,
  obs_id integer primary key,
  obs_type text,
  specimen_type text,
  herbarium_localization text,
  herbarium_collection text,
  reference text,
  native_status text,
  redlist text,
  regional_redlist text,
  priority text,
  measures integer,
  monitoring integer,
  ch_protection integer,
  cantonal_protection integer,
  uzl text,
  wzl text,
  black_list text,
  family text,
  name_de text,
  name_fr text,
  name_it text,
  original_taxon text,
  taxon_expert text,
  determinavit text,
  locality_id integer,
  releve_type text,
  releve_stratum text,
  cover_code text,
  cover_abs real,
  cover_rem text,
  control_type text,
  eradication text
);
create index on apflora.infoflora20210817filtered using btree (evab_id);
create index on apflora.infoflora20210817filtered using btree (no_isfs);
create index on apflora.infoflora20210817filtered using btree (copyright);
create index on apflora.infoflora20210817filtered using btree (obs_id);
-- 5. insert rest into temp table
with kontrollen as (
  select info.obs_id
  from apflora.infoflora20210817 info
    inner join apflora.tpopkontr kontr on kontr.id = info.evab_id
),
floz as (
  select obs_id
  from apflora.infoflora20210817
  where copyright like '© Flora des Kantons Zürich'
),
imported as (
  select info.obs_id
  from apflora.infoflora20210817 info
    inner join apflora.beob beob on (beob.data->>beob.id_field)::text = info.obs_id::text
)
insert into apflora.infoflora20210817filtered (
    evab_id,
    interpretation_note,
    no_isfs,
    taxon,
    validation_status,
    determinavit_cf,
    presence,
    introduction,
    obs_day,
    obs_month,
    obs_year,
    date_expert,
    observers,
    country,
    canton,
    municipality,
    region_biogeo,
    spatial_resolution,
    x_swiss,
    y_swiss,
    xy_type,
    xy_radius,
    geo_expert,
    locality_descript,
    altitude_min,
    altitude_max,
    altitude_expert,
    abundance_cat,
    count_unit,
    abundance,
    remarks,
    typo_ch,
    phenology_code,
    copyright,
    obs_id,
    obs_type,
    specimen_type,
    herbarium_localization,
    herbarium_collection,
    reference,
    native_status,
    redlist,
    regional_redlist,
    priority,
    measures,
    monitoring,
    ch_protection,
    cantonal_protection,
    uzl,
    wzl,
    black_list,
    family,
    name_de,
    name_fr,
    name_it,
    original_taxon,
    taxon_expert,
    determinavit,
    locality_id,
    releve_type,
    releve_stratum,
    cover_code,
    cover_abs,
    cover_rem,
    control_type,
    eradication
  )
select evab_id,
  interpretation_note,
  no_isfs,
  taxon,
  validation_status,
  determinavit_cf,
  presence,
  introduction,
  obs_day,
  obs_month,
  obs_year,
  date_expert,
  observers,
  country,
  canton,
  municipality,
  region_biogeo,
  spatial_resolution,
  x_swiss,
  y_swiss,
  xy_type,
  xy_radius,
  geo_expert,
  locality_descript,
  altitude_min,
  altitude_max,
  altitude_expert,
  abundance_cat,
  count_unit,
  abundance,
  remarks,
  typo_ch,
  phenology_code,
  copyright,
  obs_id,
  obs_type,
  specimen_type,
  herbarium_localization,
  herbarium_collection,
  reference,
  native_status,
  redlist,
  regional_redlist,
  priority,
  measures,
  monitoring,
  ch_protection,
  cantonal_protection,
  uzl,
  wzl,
  black_list,
  family,
  name_de,
  name_fr,
  name_it,
  original_taxon,
  taxon_expert,
  determinavit,
  locality_id,
  releve_type,
  releve_stratum,
  cover_code,
  cover_abs,
  cover_rem,
  control_type,
  eradication
from apflora.infoflora20210817 info
where info.obs_id not in (
    select obs_id
    from kontrollen
  )
  and info.obs_id not in (
    select obs_id
    from floz
  )
  and info.obs_id not in (
    select obs_id
    from imported
  );
-- 21154 rows
-- Example select into jsonb:
-- SELECT id, json_build_object('name', name, 'addr', addr) AS data
-- FROM   myt;
-- 6. build temp beob table
CREATE TABLE apflora.beob20210817 (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  quelle text default null,
  -- this field in data contains this datasets id
  id_field varchar(38) DEFAULT NULL,
  art_id UUID DEFAULT NULL REFERENCES apflora.ae_taxonomies(id) on delete no action on update cascade,
  -- art_id can be changed. art_id_original documents this change
  art_id_original UUID DEFAULT NULL REFERENCES apflora.ae_taxonomies(id) on delete no action on update cascade,
  -- data without year is not imported
  -- when no month exists: month = 01
  -- when no day exists: day = 01
  datum date DEFAULT NULL,
  -- Nachname Vorname
  autor varchar(100) DEFAULT NULL,
  -- data without coordinates is not imported
  geom_point geometry(Point, 4326) default null,
  -- maybe later add a geojson field for polygons?
  data jsonb,
  tpop_id uuid DEFAULT NULL REFERENCES apflora.tpop (id) ON DELETE
  SET NULL ON UPDATE CASCADE,
    nicht_zuordnen boolean default false,
    infoflora_informiert_datum date default null,
    bemerkungen text,
    changed date DEFAULT NOW(),
    changed_by varchar(20) DEFAULT null
);
-- 7. insert importdata into temp beob table
insert into apflora.beob20210817 (
    id_field,
    datum,
    autor,
    data,
    art_id,
    art_id_original,
    changed_by,
    geom_point,
    quelle
  )
select 'obs_id',
  format(
    '%s-%s-%s',
    obs_year,
    coalesce(obs_month, '01'),
    coalesce(obs_day, '01')
  )::date,
  observers,
  row_to_json(row),
  (
    select id
    from apflora.ae_taxonomies
    where taxid = no_isfs
  ),
  (
    select id
    from apflora.ae_taxonomies
    where taxid = no_isfs
  ),
  'ag (import)',
  ST_Transform(
    ST_SetSRID(ST_MakePoint(x_swiss, y_swiss), 2056),
    4326
  ),
  'Info Flora 2021.05'
from apflora.infoflora20210817filtered row;
-- 8. check this table
-- 9. insert temp beob into beob
insert into apflora.beob (
    id_field,
    datum,
    autor,
    data,
    art_id,
    changed_by,
    geom_point,
    quelle
  )
select id_field,
  datum,
  autor,
  data,
  art_id,
  changed_by,
  geom_point,
  quelle
from apflora.beob20210817;