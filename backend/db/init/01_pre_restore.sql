CREATE DATABASE apflora WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C.UTF-8' LC_CTYPE = 'C.UTF-8';

c apflora;

-- not sure if this hyphen is correct
CREATE ROLE apflora_reader;

CREATE ROLE apflora_ap_reader;

CREATE ROLE apflora_manager IN
GROUP apflora_reader;

CREATE ROLE apflora_ap_writer IN
GROUP apflora_reader;

CREATE ROLE apflora_freiwillig;

CREATE ROLE anon;

CREATE ROLE authenticator WITH LOGIN PASSWORD '${AUTHENTICATOR_PASSWORD}' noinherit;

