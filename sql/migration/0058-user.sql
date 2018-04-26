alter schema basic_auth rename to auth;

-- create table
CREATE TABLE apflora.user (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  name text UNIQUE,
  -- allow other attributes to be null
  -- so names and roles can be set beforehand by topos
  email text UNIQUE default null,
  -- is role still used?
  role name DEFAULT NULL check (length(role) < 512),
  pass text DEFAULT NULL check (length(pass) > 5),
  CONSTRAINT proper_email CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);
CREATE INDEX ON apflora.user USING btree (id);
CREATE INDEX ON apflora.user USING btree (name);

-- move data
insert into apflora.user (name,email,role,pass)
select name,email,role,pass from auth.users;

-- change references
alter table apflora.usermessage drop constraint fk_users;
ALTER TABLE apflora.usermessage ADD CONSTRAINT fk_user FOREIGN KEY (user_name) REFERENCES apflora.user (name) ON DELETE CASCADE ON UPDATE CASCADE;

-- secure pass and role in apflora.user:
revoke all on apflora.user from public;
grant select (id, name, email) on apflora.user to anon;
grant select (id, name, email) on apflora.user to apflora_reader;
grant select (id, name, email) on apflora.user to apflora_artverantwortlich;


drop table if exists auth.users cascade;

ALTER TABLE apflora.user ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS reader_writer ON apflora.user;
CREATE POLICY reader_writer ON apflora.user
  USING (
    name = current_user_name()
    -- TODO: this only for USING, not for CHECK?
    OR current_user = 'anon'
  );







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
-- this does not work on windows
-- need to run pgjwt.sql
--create extension if not exists pgjwt;

create or replace function auth.encrypt_pass()
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
-- to keep passwords safe in the user table
drop trigger if exists encrypt_pass on apflora.user;
create trigger encrypt_pass
  before insert or update on apflora.user
  for each row
  execute procedure auth.encrypt_pass();

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

-- Login function which takes an user name and password
-- and returns JWT if the credentials match a user in the internal table
--create type login_return as (token auth.jwt_token, role text);
create or replace function apflora.login(username text, pass text)
returns auth.jwt_token
  as $$
declare
  _role name;
  result auth.jwt_token;
begin
  -- check username and password
  select auth.user_role($1, $2) into _role;
  if _role is null then
    raise invalid_password using message = 'invalid user or password';
  end if;

  select auth.sign(
      row_to_json(r), current_setting('app.jwt_secret')
    ) as token
    from (
      select _role as role,
      $1 as username,
      extract(epoch from now())::integer + 60*60*24*30 as exp
    ) r
    into result;
  return result;
end;
$$ language plpgsql;

-- permissions that allow anonymous users to create accounts
-- and attempt to log in
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



CREATE OR REPLACE FUNCTION auth.url_encode(data bytea) RETURNS text LANGUAGE sql AS $$
    SELECT translate(encode(data, 'base64'), E'+/=\n', '-_');
$$;


CREATE OR REPLACE FUNCTION auth.url_decode(data text) RETURNS bytea LANGUAGE sql AS $$
WITH t AS (SELECT translate(data, '-_', '+/') AS trans),
     rem AS (SELECT length(t.trans) % 4 AS remainder FROM t) -- compute padding size
    SELECT decode(
        t.trans ||
        CASE WHEN rem.remainder > 0
           THEN repeat('=', (4 - rem.remainder))
           ELSE '' END,
    'base64') FROM t, rem;
$$;


CREATE OR REPLACE FUNCTION auth.algorithm_sign(signables text, secret text, algorithm text)
RETURNS text LANGUAGE sql AS $$
WITH
  alg AS (
    SELECT CASE
      WHEN algorithm = 'HS256' THEN 'sha256'
      WHEN algorithm = 'HS384' THEN 'sha384'
      WHEN algorithm = 'HS512' THEN 'sha512'
      ELSE '' END AS id)  -- hmac throws error
SELECT auth.url_encode(hmac(signables, secret, alg.id)) FROM alg;
$$;


CREATE OR REPLACE FUNCTION auth.sign(payload json, secret text, algorithm text DEFAULT 'HS256')
RETURNS text LANGUAGE sql AS $$
WITH
  header AS (
    SELECT auth.url_encode(convert_to('{"alg":"' || algorithm || '","typ":"JWT"}', 'utf8')) AS data
    ),
  payload AS (
    SELECT auth.url_encode(convert_to(payload::text, 'utf8')) AS data
    ),
  signables AS (
    SELECT header.data || '.' || payload.data AS data FROM header, payload
    )
SELECT
    signables.data || '.' ||
    auth.algorithm_sign(signables.data, secret, algorithm) FROM signables;
$$;


CREATE OR REPLACE FUNCTION auth.verify(token text, secret text, algorithm text DEFAULT 'HS256')
RETURNS table(header json, payload json, valid boolean) LANGUAGE sql AS $$
  SELECT
    convert_from(auth.url_decode(r[1]), 'utf8')::json AS header,
    convert_from(auth.url_decode(r[2]), 'utf8')::json AS payload,
    r[3] = auth.algorithm_sign(r[1] || '.' || r[2], secret, algorithm) AS valid
  FROM regexp_split_to_array(token, '\.') r;
$$;


grant select on table apflora.user to anon;
