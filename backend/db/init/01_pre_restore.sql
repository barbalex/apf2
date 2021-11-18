CREATE DATABASE apflora WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C.UTF-8' LC_CTYPE = 'C.UTF-8';
\ c apflora;
-- not sure if this hyphen is correct
create role apflora_reader;
create role apflora_ap_reader;
create role apflora_manager in group apflora_reader;
create role apflora_ap_writer in group apflora_reader;
create role apflora_freiwillig;
create role anon;
create role authenticator with login password '${AUTHENTICATOR_PASSWORD}' noinherit;