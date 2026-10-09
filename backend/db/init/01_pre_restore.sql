CREATE DATABASE apflora WITH TEMPLATE = template0 ENCODING = 'UTF8';

\connect apflora;
-- not sure if this hyphen is correct
CREATE ROLE apflora_reader;

CREATE ROLE apflora_ap_reader;

CREATE ROLE apflora_manager IN
GROUP apflora_reader;

CREATE ROLE apflora_ap_writer IN
GROUP apflora_reader;

CREATE ROLE apflora_freiwillig;

CREATE ROLE anon;

-- authenticator is created by 01b_create_authenticator.sh:
-- psql does not expand env vars in .sql init files, so the password
-- has to be set from a shell script

