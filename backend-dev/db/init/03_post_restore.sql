-- TODO: this is copied from ae. Apply it to apflora!
\c apflora
-- app.jwt_secret is set by 04_jwt_secret.sh: psql does not expand
-- env vars in .sql init files, so it needs a shell script

REVOKE connect ON DATABASE apflora FROM public;

REVOKE ALL ON ALL tables IN SCHEMA apflora FROM public;

-- apflora_reader can see all but change nothing
--drop role if exists apflora_reader;
--create role apflora_reader;
GRANT connect ON DATABASE apflora TO apflora_reader;

GRANT SELECT ON ALL tables IN SCHEMA apflora TO apflora_reader;

GRANT usage ON SCHEMA public, auth, apflora TO apflora_reader;


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

-- postgraphile connects as authenticator and switches to the role
-- from the JWT (or anon) per request: it must be a member of every
-- role a user can have
GRANT apflora_manager TO authenticator;

GRANT apflora_ap_writer TO authenticator;

GRANT apflora_reader TO authenticator;

GRANT apflora_ap_reader TO authenticator;

GRANT apflora_freiwillig TO authenticator;

GRANT anon TO authenticator;

-- schema access for the connection itself (introspection)
GRANT usage ON SCHEMA public, auth, apflora, request TO authenticator;

GRANT connect ON DATABASE apflora TO anon;

-- apflora_freiwillig can work on kontrollen
-- need to enforce freiwilligen-kontrollen in ui
GRANT apflora_reader TO apflora_freiwillig;

GRANT ALL ON apflora.tpopkontr, apflora.tpopkontr_file, apflora.tpopkontrzaehl TO apflora_freiwillig;

-- SELECT * FROM pg_group;
-- lost roles: \du
-- check privileges on table: \z apflora.user
-- secure pass and role in apflora.user:
-- The authenticated roles get TABLE-level SELECT: q_user/v_user/
-- query_user and the user_label computed function take the whole row,
-- so a column list breaks on every new user column - one missing
-- column kills the whole /Daten tree for non-managers (#825, #836).
-- anon additionally gets neither email nor pass: the pre-auth login
-- flow (checkUserPassword) needs id, name and
-- require_new_password_on_next_login only.
REVOKE ALL ON apflora.user FROM public, apflora_reader, apflora_ap_reader, apflora_freiwillig, apflora_ap_writer;

REVOKE ALL ON apflora.user FROM anon;
GRANT SELECT (id, name, require_new_password_on_next_login) ON apflora.user TO anon;

GRANT SELECT ON apflora.user TO apflora_reader, apflora_ap_reader, apflora_freiwillig, apflora_ap_writer;

GRANT UPDATE (id, name, email, pass) ON apflora.user TO apflora_reader, apflora_ap_reader, apflora_freiwillig, apflora_ap_writer;

GRANT SELECT ON apflora.user TO apflora_manager;

GRANT UPDATE (id, name, email, ROLE, pass, adresse_id, require_new_password_on_next_login) ON apflora.user TO apflora_manager;

-- even pure readers need to write to usermessage:
GRANT ALL ON apflora.usermessage TO apflora_reader, apflora_ap_reader, apflora_freiwillig;

