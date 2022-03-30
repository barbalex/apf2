-- 1. import data into temporary table
-- 2. ignore apflora kontrollen: guid in (select id from apflora.tpopkontr)
-- 3. Floz: copyright = "© Flora des Kantons Zürich": only update data
-- 4. extract info flora beob already imported: obs_id = original_id: only update data
-- 5. import rest

-- 00 test sisf2 vs no_isfs of infoflora20210409
select distinct
  info.no_isfs,
  tax.taxid
from
  apflora.infoflora20210409 info
  left join apflora.ae_taxonomies tax
  on tax.taxid = info.no_isfs
order by tax.taxid;

-- 0 create barcode_obs_id compare table
create table apflora.floz2017_id_barcode (
  id int,
  barcode text
);
create index on apflora.floz2017_id_barcode using btree (id);
create index on apflora.floz2017_id_barcode using btree (barcode);

-- 1. import data into temporary table
create table infoflora20210409 (
  evab_id uuid,
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
create index on apflora.infoflora20210409 using btree (evab_id);
create index on apflora.infoflora20210409 using btree (no_isfs);
create index on apflora.infoflora20210409 using btree (copyright);
create index on apflora.infoflora20210409 using btree (obs_id);
-- 17322 rows

-- 2. ignore apflora kontrollen
select
  info.obs_id
from
  apflora.infoflora20210409 info
  inner join apflora.tpopkontr kontr
  on kontr.id = info.evab_id;
-- 3978 rows

 
-- 3. Floz: only update data
select
  *
from
  apflora.infoflora20210409
where 
  copyright like '© Flora des Kantons Zürich';
-- 261 rows
-- compare with number from floz for these species:
select 
  tax.artname,
  beob.data->>beob.obs_id as obs_id_floz,
  beob.*
from 
  apflora.beob beob
  inner join apflora.ae_taxonomies tax
  on tax.id = beob.art_id
where
  tax.taxid in (select distinct no_isfs from apflora.infoflora20210409)
  and beob.quelle like 'FloZ 2017'
order by
  tax.artname,
  beob.datum;
-- 2259 rows! WHAT?
-- TODO: update data?
-- test if id from floz2017 equals obs_id from infoflora20210409:
select
  *
from
  apflora.infoflora20210409 info
  inner join apflora.floz2017_id_barcode id_barcode
  on id_barcode.id = info.obs_id;
-- 14 rows - none of them from floz!!!


-- 4. extract info flora beob already imported: obs_id = original_id: only update data
select
  beob.data->>(beob.id_field) AS "original_id",
  info.*
from
  apflora.infoflora20210409 info
  inner join apflora.beob beob
  on (beob.data->>beob.id_field)::text = info.obs_id::text;
-- 3733 rows
-- excluding kontr and floz had no influence
-- TODO: update data?


-- 5. import rest
with kontrollen as (
  select info.obs_id
  from
    apflora.infoflora20210409 info
    inner join apflora.tpopkontr kontr
    on kontr.id = info.evab_id
), floz as (
  select
    obs_id
  from
    apflora.infoflora20210409
  where 
    copyright like '© Flora des Kantons Zürich'
), imported as (
  select
    info.obs_id
  from
    apflora.infoflora20210409 info
    inner join apflora.beob beob
    on (beob.data->>beob.id_field)::text = info.obs_id::text
)
select
  * 
from
  apflora.infoflora20210409 info
where
  info.obs_id not in (select obs_id from kontrollen)
  and info.obs_id not in (select obs_id from floz)
  and info.obs_id not in (select obs_id from imported);
-- 9350 rows