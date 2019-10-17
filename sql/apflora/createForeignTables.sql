-- enable ae as foreign tables
-- see: https://www.percona.com/blog/2018/08/21/foreign-data-wrappers-postgresql-postgres_fdw/

-- on arteigenschaften.ch:
-- postgresql insists on a password. but data is open,
-- so no problem not to use a secure one
create user fdw_user with encrypted password 'secret';
grant select on table ae.v_apflora_lr_delarze to fdw_user;

-- on apflora
CREATE EXTENSION postgres_fdw;
CREATE SERVER ae_server
  FOREIGN DATA WRAPPER postgres_fdw
  OPTIONS (host '207.154.212.35', port '5432', dbname 'ae');

-- need to use this view
-- because joining tables is way too slow
create foreign table apflora.ae_lr_delarze (
  id uuid,
  name text,
  label text,
  einheit text
)
server ae_server options (schema_name 'ae', table_name 'v_apflora_lr_delarze');

CREATE USER MAPPING
    FOR postgres
 SERVER ae_server
OPTIONS (user 'fdw_user', password 'secret');
CREATE USER MAPPING
    FOR apflora_manager
 SERVER ae_server
OPTIONS (user 'fdw_user', password 'secret');
CREATE USER MAPPING
    FOR apflora_artverantwortlich
 SERVER ae_server
OPTIONS (user 'fdw_user', password 'secret');
CREATE USER MAPPING
    FOR apflora_freiwillig
 SERVER ae_server
OPTIONS (user 'fdw_user', password 'secret');