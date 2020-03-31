CREATE DATABASE apflora WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C.UTF-8' LC_CTYPE = 'C.UTF-8';
\c apflora

create role apflora_reader;
create role apflora_manager in group apflora_reader;
create role apflora_artverantwortlich in group apflora_reader;
create role apflora_freiwillig;
create role anon;
create role authenticator with login password '${AUTHENTICATOR_PASSWORD}' noinherit;
grant connect on database apflora to authenticator;
grant connect on database apflora to anon;
grant anon to authenticator;