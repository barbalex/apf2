CREATE DATABASE apflora encoding 'UTF8';
CREATE SCHEMA apflora;
CREATE SCHEMA views;
CREATE SCHEMA beob;
-- CREATE EXTENSION pgcrypto;
CREATE EXTENSION "uuid-ossp";

-- create role reader in pgAdmin, then:
GRANT USAGE ON SCHEMA apflora TO read;
GRANT SELECT ON ALL TABLES IN SCHEMA apflora TO read;
