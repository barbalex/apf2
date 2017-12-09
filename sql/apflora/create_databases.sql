CREATE DATABASE apflora encoding 'UTF8';
CREATE EXTENSION pgcrypto;
CREATE EXTENSION "uuid-ossp";

-- create role reader in pgAdmin, then:
create role apflora_reader;
create role apflora_artverantwortlich in group apflora_reader;
create role apflora_freiwillig;
create role anon;
create role authenticator with login password 'secret' noinherit;
--GRANT USAGE ON SCHEMA apflora TO apflora_reader;
--GRANT SELECT ON ALL TABLES IN SCHEMA apflora TO apflora_reader;

ALTER DATABASE apflora SET "app.jwt_secret" TO 'secret';
