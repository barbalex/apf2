-- apflora_reader can look at all but change nothing
drop role if exists apflora_reader;
create role apflora_reader;
revoke connect on database apflora from public;
grant connect on database apflora to apflora_reader;
revoke all on all tables in schema apflora from public;
grant select on all tables in schema apflora to apflora_reader;
grant usage on schema public, basic_auth to apflora_reader;
grant select on table pg_authid, basic_auth.users to apflora_reader;
grant execute on function apflora.login(text,text) to apflora_reader;
alter default privileges for role apflora_reader in schema apflora
  grant select on tables to apflora_reader;
alter default privileges in schema apflora
  grant select, usage on sequences to apflora_reader;
grant anon to apflora_reader;
alter role apflora_reader with login;

-- apflora_artverantwortlich can do anything
-- as far as row-level-security allows
-- (allows only permitted projects)
drop role if exists apflora_artverantwortlich;
create role apflora_artverantwortlich with login in group anon, apflora_reader;
revoke connect on database apflora from public;
grant connect on database apflora to apflora_artverantwortlich;
grant all on all tables in schema apflora to apflora_artverantwortlich;
grant all on schema apflora to apflora_artverantwortlich;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA apflora TO apflora_artverantwortlich;
alter default privileges for role apflora_artverantwortlich in schema apflora
  grant all on tables to apflora_artverantwortlich;
alter default privileges in schema apflora
  grant all on sequences to apflora_artverantwortlich;
grant anon to apflora_artverantwortlich;

create role z with login password 'z' in group apflora_artverantwortlich, anon;
grant anon to z;
-- alter role z with login;
-- set password: psql: \password my_secret

grant apflora_artverantwortlich to authenticator;
grant z to authenticator;

-- apflora_freiwillig can work on kontrollen
-- need to enforce freiwilligen-kontrollen in ui
drop role if exists apflora_freiwillig;
create role apflora_freiwillig;
revoke connect on database apflora from public;
grant apflora_reader to apflora_freiwillig;
grant all on apflora.tpopkontr, apflora.tpopkontrzaehl to apflora_freiwillig;
grant anon to apflora_freiwillig;
grant apflora_reader to apflora_freiwillig;
alter role apflora_freiwillig with login;

grant apflora_artverantwortlich to postgres;

-- SELECT * FROM pg_group;
