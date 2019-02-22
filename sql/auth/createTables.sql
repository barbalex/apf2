-- run this once
ALTER DATABASE apflora SET "app.jwt_secret" TO 'secret';

-- We put things inside the auth schema to hide
-- them from public view. Certain public procs/views will
-- refer to helpers and tables inside.
CREATE SCHEMA IF NOT EXISTS auth;

-- use a trigger to manually enforce the role being a foreign key to actual
-- database roles
create or replace function auth.check_role_exists() returns trigger
  language plpgsql
  as $$
begin
  if not exists (select 1 from pg_roles as r where r.rolname = new.role) then
    raise foreign_key_violation using message =
      'unknown database role: ' || new.role;
    return null;
  end if;
  return new;
end
$$;

drop trigger if exists ensure_user_role_exists on apflora.user;
create constraint trigger ensure_user_role_exists
  after insert or update on apflora.user
  for each row
  execute procedure auth.check_role_exists();

create extension if not exists pgcrypto;

-- this does not work on windows and ubuntu (?)
-- need to run pgjwt.sql instead
--create extension if not exists pgjwt;

create or replace function apflora.encrypt_pass()
  returns trigger
  language plpgsql as
$$
begin
  if TG_OP = 'INSERT' or new.pass <> old.pass then
    new.pass = crypt(new.pass, gen_salt('bf'));
  end if;
  return new;
end
$$;

-- We’ll use the pgcrypto extension and a trigger
-- to keep passwords safe in the users table
-- PROBLEM: This trigger does NOT work on insert
drop trigger if exists encrypt_pass on apflora.user;
create trigger encrypt_pass
  before insert or update on apflora.user
  for each row
  execute procedure apflora.encrypt_pass();
GRANT EXECUTE ON FUNCTION apflora.encrypt_pass() TO apflora_reader;
GRANT EXECUTE ON FUNCTION apflora.encrypt_pass() TO apflora_freiwillig;
GRANT EXECUTE ON FUNCTION apflora.encrypt_pass() TO authenticator;
GRANT EXECUTE ON FUNCTION apflora.encrypt_pass() TO anon;

-- Helper to check a password against the encrypted column
-- It returns the database role for a user
-- if the name and password are correct
create or replace function auth.user_role(username text, pass text)
returns name
  language plpgsql
  as $$
begin
  return (
  select role from apflora.user
   where apflora.user.name = $1
     and apflora.user.pass = crypt($2, apflora.user.pass)
  );
end;
$$;

-- stored procedure that returns the token
CREATE TYPE auth.jwt_token AS (
  role text,
  username text,
  token text
);

-- Login function which takes an user name and password
-- and returns JWT if the credentials match a user in the internal table
--create type login_return as (token auth.jwt_token, role text);
create or replace function apflora.login(username text, pass text)
returns auth.jwt_token
  as $$
declare
  _role name;
  result auth.jwt_token;
  token text;
begin
  -- check username and password
  select auth.user_role($1, $2) into _role;
  if _role is null then
    raise invalid_password using message = 'invalid user or password';
  end if;

  return (
    _role,
    $1,
    current_setting('app.jwt_secret')
  )::auth.jwt_token;
end;
$$ language plpgsql;

-- permissions that allow anonymous users to create accounts
-- and attempt to log in
create role anon;
create role authenticator with login password 'secret' noinherit;
grant anon to authenticator;
grant connect on database apflora to authenticator;
grant connect on database apflora to anon;

grant usage on schema public, auth, apflora, request to anon;
grant select on table pg_authid to anon;
grant execute on function apflora.login(text,text) to anon;
grant execute on function auth.sign(json,text,text) to anon;
grant execute on function auth.user_role(text,text) to anon;
grant execute on function request.user_name() to anon;
grant execute on function request.jwt_claim(text) to anon;
grant execute on function request.env_var(text) to anon;
grant select on table apflora.user to anon;
