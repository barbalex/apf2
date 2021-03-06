-- TODO: this is copied from ae. Apply it to apflora!
\c apflora

ALTER DATABASE apflora SET "app.jwt_secret" TO '${JWT_SECRET}';

revoke connect on database apflora from public;
revoke all on all tables in schema apflora from public;

-- apflora_reader can see all but change nothing
--drop role if exists apflora_reader;
--create role apflora_reader;
grant connect on database apflora to apflora_reader;
grant select on all tables in schema apflora to apflora_reader;
grant usage on schema public, auth, apflora to apflora_reader;
grant select on table pg_authid to apflora_reader;
grant execute on function apflora.login(text,text) to apflora_reader;
alter default privileges in schema apflora
  grant select on tables to apflora_reader;
alter default privileges in schema apflora
  grant select, usage on sequences to apflora_reader;


grant connect on database apflora to apflora_ap_reader;
grant select on all tables in schema apflora to apflora_ap_reader;
grant usage on schema public, auth, apflora to apflora_ap_reader;
grant select on table pg_authid to apflora_ap_reader;
grant execute on function apflora.login(text,text) to apflora_ap_reader;
alter default privileges in schema apflora
  grant select on tables to apflora_ap_reader;
alter default privileges in schema apflora
  grant select, usage on sequences to apflora_ap_reader;

-- apflora_ap_writer can do anything
-- as far as row-level-security allows
-- (allows only permitted projects)
grant connect on database apflora to apflora_ap_writer;
grant all on schema apflora to apflora_ap_writer;
grant usage on schema public, auth to apflora_ap_writer;
grant all on all tables in schema apflora to apflora_ap_writer;
grant all on all sequences in schema apflora to apflora_ap_writer;
grant all on all functions in schema apflora to apflora_ap_writer;
alter default privileges in schema apflora
  grant all on tables to apflora_ap_writer;
alter default privileges in schema apflora
  grant all on sequences to apflora_ap_writer;
alter default privileges in schema apflora
  grant all on functions to apflora_ap_writer;

-- apflora_manager can do anything
-- as far as row-level-security allows
-- (allows only permitted projects)
-- plus: can edit users
-- plus: can edit typ_werte
grant connect on database apflora to apflora_manager;
grant all on schema apflora to apflora_manager;
grant usage on schema public, auth to apflora_manager;
grant all on all tables in schema apflora to apflora_manager;
grant all on all sequences in schema apflora to apflora_manager;
grant all on all functions in schema apflora to apflora_manager;
alter default privileges in schema apflora
  grant all on tables to apflora_manager;
alter default privileges in schema apflora
  grant all on sequences to apflora_manager;
alter default privileges in schema apflora
  grant all on functions to apflora_manager;


grant connect on database apflora to authenticator;
grant apflora_manager to authenticator;
grant apflora_ap_writer to authenticator;
grant apflora_reader to authenticator;
grant apflora_ap_reader to authenticator;
grant anon to authenticator;


grant connect on database apflora to anon;

-- apflora_freiwillig can work on kontrollen
-- need to enforce freiwilligen-kontrollen in ui
grant apflora_reader to apflora_freiwillig;
grant all on apflora.tpopkontr, apflora.tpopkontr_file, apflora.tpopkontrzaehl to apflora_freiwillig;

-- SELECT * FROM pg_group;
-- lost roles: \du
-- check privileges on table: \z apflora.user

-- secure pass and role in apflora.user:
revoke all on apflora.user from public, apflora_reader, apflora_ap_reader, apflora_freiwillig, apflora_ap_writer;
grant select (id, name, email, pass, role, adresse_id) on apflora.user to anon;
grant select (id, name, email, pass, role, adresse_id), update (id, name, email, pass) on apflora.user to apflora_reader, apflora_ap_reader, apflora_freiwillig, apflora_ap_writer;
grant all on apflora.user to apflora_manager;
-- even pure readers need to write to usermessage:
grant all on apflora.usermessage to apflora_reader, apflora_ap_reader, apflora_freiwillig;