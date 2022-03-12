-- TODO: this is copied from ae. Apply it to apflora!
\c apflora
ALTER DATABASE apflora SET "app.jwt_secret" TO '${JWT_SECRET}';

REVOKE connect ON DATABASE apflora FROM public;

REVOKE ALL ON ALL tables IN SCHEMA apflora FROM public;

-- apflora_reader can see all but change nothing
--drop role if exists apflora_reader;
--create role apflora_reader;
GRANT connect ON DATABASE apflora TO apflora_reader;

GRANT SELECT ON ALL tables IN SCHEMA apflora TO apflora_reader;

GRANT usage ON SCHEMA public, auth, apflora TO apflora_reader;

GRANT SELECT ON TABLE pg_authid TO apflora_reader;

GRANT EXECUTE ON FUNCTION apflora.login (text, text) TO apflora_reader;

ALTER DEFAULT privileges IN SCHEMA apflora GRANT
SELECT
  ON tables TO apflora_reader;

ALTER DEFAULT privileges IN SCHEMA apflora GRANT
SELECT
, usage ON sequences TO apflora_reader;

GRANT connect ON DATABASE apflora TO apflora_ap_reader;

GRANT SELECT ON ALL tables IN SCHEMA apflora TO apflora_ap_reader;

GRANT usage ON SCHEMA public, auth, apflora TO apflora_ap_reader;

GRANT SELECT ON TABLE pg_authid TO apflora_ap_reader;

GRANT EXECUTE ON FUNCTION apflora.login (text, text) TO apflora_ap_reader;

ALTER DEFAULT privileges IN SCHEMA apflora GRANT
SELECT
  ON tables TO apflora_ap_reader;

ALTER DEFAULT privileges IN SCHEMA apflora GRANT
SELECT
, usage ON sequences TO apflora_ap_reader;

-- apflora_ap_writer can do anything
-- as far as row-level-security allows
-- (allows only permitted projects)
GRANT connect ON DATABASE apflora TO apflora_ap_writer;

GRANT ALL ON SCHEMA apflora TO apflora_ap_writer;

GRANT usage ON SCHEMA public, auth TO apflora_ap_writer;

GRANT ALL ON ALL tables IN SCHEMA apflora TO apflora_ap_writer;

GRANT ALL ON ALL sequences IN SCHEMA apflora TO apflora_ap_writer;

GRANT ALL ON ALL functions IN SCHEMA apflora TO apflora_ap_writer;

ALTER DEFAULT privileges IN SCHEMA apflora GRANT ALL ON tables TO apflora_ap_writer;

ALTER DEFAULT privileges IN SCHEMA apflora GRANT ALL ON sequences TO apflora_ap_writer;

ALTER DEFAULT privileges IN SCHEMA apflora GRANT ALL ON functions TO apflora_ap_writer;

-- apflora_manager can do anything
-- as far as row-level-security allows
-- (allows only permitted projects)
-- plus: can edit users
-- plus: can edit typ_werte
GRANT connect ON DATABASE apflora TO apflora_manager;

GRANT ALL ON SCHEMA apflora TO apflora_manager;

GRANT usage ON SCHEMA public, auth TO apflora_manager;

GRANT ALL ON ALL tables IN SCHEMA apflora TO apflora_manager;

GRANT ALL ON ALL sequences IN SCHEMA apflora TO apflora_manager;

GRANT ALL ON ALL functions IN SCHEMA apflora TO apflora_manager;

ALTER DEFAULT privileges IN SCHEMA apflora GRANT ALL ON tables TO apflora_manager;

ALTER DEFAULT privileges IN SCHEMA apflora GRANT ALL ON sequences TO apflora_manager;

ALTER DEFAULT privileges IN SCHEMA apflora GRANT ALL ON functions TO apflora_manager;

GRANT connect ON DATABASE apflora TO authenticator;

GRANT apflora_manager TO authenticator;

GRANT apflora_ap_writer TO authenticator;

GRANT apflora_reader TO authenticator;

GRANT apflora_ap_reader TO authenticator;

GRANT anon TO authenticator;

GRANT connect ON DATABASE apflora TO anon;

-- apflora_freiwillig can work on kontrollen
-- need to enforce freiwilligen-kontrollen in ui
GRANT apflora_reader TO apflora_freiwillig;

GRANT ALL ON apflora.tpopkontr, apflora.tpopkontr_file, apflora.tpopkontrzaehl TO apflora_freiwillig;

-- SELECT * FROM pg_group;
-- lost roles: \du
-- check privileges on table: \z apflora.user
-- secure pass and role in apflora.user:
REVOKE ALL ON apflora.user FROM public, apflora_reader, apflora_ap_reader, apflora_freiwillig, apflora_ap_writer;

GRANT SELECT (id, name, email, pass, ROLE, adresse_id) ON apflora.user TO anon;

GRANT SELECT (id, name, email, pass, ROLE, adresse_id), UPDATE (id, name, email, pass) ON apflora.user TO apflora_reader, apflora_ap_reader, apflora_freiwillig, apflora_ap_writer;

GRANT ALL ON apflora.user TO apflora_manager;

-- even pure readers need to write to usermessage:
GRANT ALL ON apflora.usermessage TO apflora_reader, apflora_ap_reader, apflora_freiwillig;

