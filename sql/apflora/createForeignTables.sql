-- enable ae as foreign tables
-- see: https://www.percona.com/blog/2018/08/21/foreign-data-wrappers-postgresql-postgres_fdw/
-- on arteigenschaften.ch:
-- postgresql insists on a password. but data is open,
-- so no problem not to use a secure one
CREATE USER fdw_user WITH encrypted PASSWORD 'secret';

GRANT SELECT ON TABLE ae.v_apflora_lr_delarze TO fdw_user;

GRANT SELECT ON TABLE ae.v_apflora_taxonomies TO fdw_user;

-- on apflora
CREATE EXTENSION postgres_fdw;

CREATE SERVER ae_server FOREIGN DATA WRAPPER postgres_fdw OPTIONS (
  host 'api.arteigenschaften.ch',
  port '5432',
  dbname 'ae'
);

-- need to use this view
-- because joining tables is way too slow
CREATE FOREIGN TABLE apflora.ae_lr_delarze (
  id uuid,
  name text,
  label text,
  einheit text)
SERVER ae_server options (
  schema_name 'ae',
  table_name 'v_apflora_lr_delarze'
);

-- this is to download the data
-- data needs to be local so relations can be built
DROP FOREIGN TABLE IF EXISTS apflora.ae_taxonomies_download;

CREATE FOREIGN TABLE apflora.ae_taxonomies_download (
  taxonomie_id uuid,
  taxonomie_name text,
  id uuid,
  taxid integer,
  taxid_intern integer,
  familie text,
  artname text,
  artwert integer)
SERVER ae_server options (
  schema_name 'ae',
  table_name 'v_apflora_taxonomies'
);

CREATE USER MAPPING FOR postgres SERVER ae_server OPTIONS (
  USER 'fdw_user',
  PASSWORD 'secret'
);

CREATE USER MAPPING FOR apflora_manager SERVER ae_server OPTIONS (
  USER 'fdw_user',
  PASSWORD 'secret'
);

CREATE USER MAPPING FOR apflora_ap_writer SERVER ae_server OPTIONS (
  USER 'fdw_user',
  PASSWORD 'secret'
);

CREATE USER MAPPING FOR apflora_ap_reader SERVER ae_server OPTIONS (
  USER 'fdw_user',
  PASSWORD 'secret'
);

CREATE USER MAPPING FOR apflora_reader SERVER ae_server OPTIONS (
  USER 'fdw_user',
  PASSWORD 'secret'
);

CREATE USER MAPPING FOR apflora_freiwillig SERVER ae_server OPTIONS (
  USER 'fdw_user',
  PASSWORD 'secret'
);

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
  geodb_oid integer)
SERVER "ogdzhwfs_server" OPTIONS (
  layer 'ms:ogd-0428_aln_fns_betreuungsgebiete_f'
);

