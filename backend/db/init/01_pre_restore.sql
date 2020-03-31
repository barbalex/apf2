-- TODO: this is copied from ae. Apply it to apflora!
CREATE DATABASE apflora WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C.UTF-8' LC_CTYPE = 'C.UTF-8';
\c apflora
create extension if not exists postgis;
create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";
create extension if not exists tablefunc;
create extension intarray;


create role apflora_reader;
create role apflora_manager in group apflora_reader;
create role apflora_artverantwortlich in group apflora_reader;
create role apflora_freiwillig;
create role anon;
create role authenticator with login password '${AUTHENTICATOR_PASSWORD}' noinherit;
grant connect on database apflora to authenticator;
grant connect on database apflora to anon;
grant anon to authenticator;


-- use an sql file instead of .sh script
-- using pg_restore in an .sh. script resultet in schema apflora being already created and the restore then failing
-- to use a .backup file run: pg_restore apflora.backup > apflora.sql