-- 1. create db apflora
-- usually directly in pgAdmin
CREATE DATABASE apflora encoding 'UTF8';
create extension if not exists postgis;
CREATE EXTENSION if not exists pgcrypto;
CREATE EXTENSION if not exists "uuid-ossp";

-- 2. create role reader in pgAdmin, then:
create role apflora_reader;
create role apflora_manager in group apflora_reader;
create role apflora_artverantwortlich in group apflora_reader;
create role apflora_freiwillig;
create role anon;
create role authenticator with login password 'USE REAL SECRET HERE' noinherit;
grant connect on database apflora to authenticator;
grant connect on database apflora to anon;
grant anon to authenticator;
--GRANT USAGE ON SCHEMA apflora TO apflora_reader;
--GRANT SELECT ON ALL TABLES IN SCHEMA apflora TO apflora_reader;

-- restore from backup, then:
-- run these two once with real secret (see how_to.md)
ALTER DATABASE apflora SET "app.jwt_secret" TO 'secret';
