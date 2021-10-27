-- enable ae as foreign tables
-- see: https://www.percona.com/blog/2018/08/21/foreign-data-wrappers-postgresql-postgres_fdw/
-- on arteigenschaften.ch:
-- postgresql insists on a password. but data is open,
-- so no problem not to use a secure one
create user fdw_user with encrypted password 'secret';
grant select on table ae.v_apflora_lr_delarze to fdw_user;
grant select on table ae.v_apflora_taxonomies to fdw_user;
-- on apflora
CREATE EXTENSION postgres_fdw;
CREATE SERVER ae_server FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host '167.172.187.231', port '5432', dbname 'ae');
-- need to use this view
-- because joining tables is way too slow
create foreign table apflora.ae_lr_delarze (
  id uuid,
  name text,
  label text,
  einheit text
) server ae_server options (
  schema_name 'ae',
  table_name 'v_apflora_lr_delarze'
);
-- this is to download the data
-- data needs to be local so relations can be built
drop foreign table if exists apflora.ae_taxonomies_download;
create foreign table apflora.ae_taxonomies_download (
  taxonomie_id UUID,
  taxonomie_name text,
  id UUID,
  taxid integer,
  familie text,
  artname text,
  artwert integer
) server ae_server options (
  schema_name 'ae',
  table_name 'v_apflora_taxonomies'
);
CREATE USER MAPPING FOR postgres SERVER ae_server OPTIONS (user 'fdw_user', password 'secret');
CREATE USER MAPPING FOR apflora_manager SERVER ae_server OPTIONS (user 'fdw_user', password 'secret');
CREATE USER MAPPING FOR apflora_ap_writer SERVER ae_server OPTIONS (user 'fdw_user', password 'secret');
CREATE USER MAPPING FOR apflora_ap_reader SERVER ae_server OPTIONS (user 'fdw_user', password 'secret');
CREATE USER MAPPING FOR apflora_reader SERVER ae_server OPTIONS (user 'fdw_user', password 'secret');
CREATE USER MAPPING FOR apflora_freiwillig SERVER ae_server OPTIONS (user 'fdw_user', password 'secret');
-- does not work
-- because of big installation dependencies...
-- https://github.com/pramsey/pgsql-ogr-fdw/issues/182
CREATE EXTENSION ogr_fdw;
CREATE SERVER ogdzhwfs_server FOREIGN DATA WRAPPER ogr_fdw OPTIONS (
  datasource 'WFS:https://maps.zh.ch/wfs/OGDZHWFS',
  format 'WFS'
);
CREATE FOREIGN TABLE betreuungsgebiete (
  bezeichnung text,
  nr integer,
  geodb_oid integer
) SERVER "ogdzhwfs_server" OPTIONS (layer 'ms:ogd-0428_aln_fns_betreuungsgebiete_f');