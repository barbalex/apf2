-- apflora_reader can look at all but change nothing
create role apflora_reader;
revoke connect on database apflora from public;
grant connect on database apflora to apflora_reader;
revoke all on all tables in schema apflora from public;
grant select on all tables in schema apflora to apflora_reader;
alter default privileges for role apflora_reader in schema apflora
  grant select on tables to apflora_reader;
alter default privileges in schema apflora
  grant select, usage on sequences to apflora_reader;

-- apflora_artverantwortlich can do anything
-- as far as row-level-security allows
-- (allows only permitted projects)
create role apflora_artverantwortlich;
grant connect on database apflora to apflora_artverantwortlich;
grant all on all tables in schema apflora to apflora_artverantwortlich;
alter default privileges for role apflora_artverantwortlich in schema apflora
  grant all on tables to apflora_artverantwortlich;
alter default privileges in schema apflora
  grant all on sequences to apflora_artverantwortlich;

-- apflora_freiwillig can work on kontrollen
-- need to enforce freiwilligen-kontrollen in ui
create role apflora_freiwillig;
grant apflora_reader to apflora_freiwillig;
grant all on tpopkontr, tpopkontrzaehl to apflora_freiwillig;
