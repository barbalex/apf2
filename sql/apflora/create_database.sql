CREATE DATABASE apflora encoding 'UTF8';
CREATE EXTENSION pgcrypto;
CREATE EXTENSION "uuid-ossp";

-- create role reader in pgAdmin, then:
create role apflora_reader;
create role apflora_artverantwortlich in group apflora_reader;
create role apflora_freiwillig;
create role anon;
create role authenticator with login password 'secret' noinherit;
grant connect on database apflora to authenticator;
grant connect on database apflora to anon;
grant anon to authenticator;
--GRANT USAGE ON SCHEMA apflora TO apflora_reader;
--GRANT SELECT ON ALL TABLES IN SCHEMA apflora TO apflora_reader;

ALTER DATABASE apflora SET "app.jwt_secret" TO 'secret';

-- restore from db.backup

-- add roles
