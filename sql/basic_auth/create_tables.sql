-- We put things inside the basic_auth schema to hide
-- them from public view. Certain public procs/views will
-- refer to helpers and tables inside.
CREATE SCHEMA IF NOT EXISTS basic_auth;

CREATE TABLE IF NOT EXISTS basic_auth.users (
  name varchar(30) PRIMARY KEY,
  role name NOT NULL check (length(role) < 512),
  -- allow other attributes to be null
  -- so names and roles can be set beforehand by topos
  email text DEFAULT NULL check ( email ~* '^.+@.+\..+$' ),
  pass text DEFAULT NULL check (length(pass) < 512)
);

-- use a trigger to manually enforce the role being a foreign key to actual
-- database roles
create or replace function
basic_auth.check_role_exists() returns trigger
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

drop trigger if exists ensure_user_role_exists on basic_auth.users;
create constraint trigger ensure_user_role_exists
  after insert or update on basic_auth.users
  for each row
  execute procedure basic_auth.check_role_exists();

create extension if not exists pgcrypto;
-- this does not work on windows
-- need to run pgjwt.sql
create extension if not exists pgjwt;

create or replace function basic_auth.encrypt_pass()
  returns trigger
  language plpgsql as
$$
begin
  if tg_op = 'INSERT' or new.pass <> old.pass then
    new.pass = crypt(new.pass, gen_salt('bf'));
  end if;
  return new;
end
$$;

-- We’ll use the pgcrypto extension and a trigger
-- to keep passwords safe in the users table
drop trigger if exists encrypt_pass on basic_auth.users;
create trigger encrypt_pass
  before insert or update on basic_auth.users
  for each row
  execute procedure basic_auth.encrypt_pass();

-- Helper to check a password against the encrypted column
-- It returns the database role for a user
-- if the name and password are correct
create or replace function
basic_auth.user_role(name text, pass text) returns name
  language plpgsql
  as $$
begin
  return (
  select role from basic_auth.users
   where users.name = user_role.name
     and users.pass = crypt(user_role.pass, users.pass)
  );
end;
$$;

-- run this once
ALTER DATABASE apflora SET "app.jwt_secret" TO '!!secret!!';

-- stored procedure that returns the token
CREATE TYPE basic_auth.jwt_token AS (
  token text
);

-- Login function which takes an user name and password
-- and returns JWT if the credentials match a user in the internal table
--create type login_return as (token basic_auth.jwt_token, role text);
create or replace function
apflora.login(name text, pass text) returns basic_auth.jwt_token
  as $$
declare
  _role name;
  result basic_auth.jwt_token;
begin
  -- check name and password
  select basic_auth.user_role(name, pass) into _role;
  if _role is null then
    raise invalid_password using message = 'invalid user or password';
  end if;

  select basic_auth.sign(
      row_to_json(r), current_setting('app.jwt_secret')
    ) as token
    from (
      select _role as role, login.name as name,
         extract(epoch from now())::integer + 60*60*24*30 as exp
    ) r
    into result;
  return result;
end;
$$ language plpgsql;

-- permissions that allow anonymous users to create accounts
-- and attempt to log in
create role anon;
create role authenticator noinherit;
grant anon to authenticator;

grant usage on schema public, basic_auth to anon;
grant select on table pg_authid, basic_auth.users to anon;
grant execute on function apflora.login(text,text) to anon;
