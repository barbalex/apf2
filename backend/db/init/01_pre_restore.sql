CREATE DATABASE apflora WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C.UTF-8' LC_CTYPE = 'C.UTF-8';
\c apflora

-- not necessary as done by restore.sh
--CREATE DATABASE apflora encoding 'UTF8';
--create extension if not exists postgis;
--CREATE EXTENSION if not exists pgcrypto;
--CREATE EXTENSION if not exists "uuid-ossp";
--create extension if not exists tablefunc;
--CREATE EXTENSION intarray;

create role apflora_reader;
create role apflora_art_reader;
create role apflora_manager in group apflora_reader;
create role apflora_artverantwortlich in group apflora_reader;
create role apflora_freiwillig;
create role anon;
create role authenticator with login password '${AUTHENTICATOR_PASSWORD}' noinherit;