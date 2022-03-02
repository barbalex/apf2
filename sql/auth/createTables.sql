-- run this once
ALTER DATABASE apflora SET "app.jwt_secret" TO 'secret';

-- We put things inside the auth schema to hide
-- them from public view. Certain public procs/views will
-- refer to helpers and tables inside.
CREATE SCHEMA IF NOT EXISTS auth;

-- use a trigger to manually enforce the role being a foreign key to actual
-- database roles
CREATE OR REPLACE FUNCTION auth.check_role_exists ()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $$
BEGIN
  IF NOT EXISTS (
    SELECT
      1
    FROM
      pg_roles AS r
    WHERE
      r.rolname = NEW.role) THEN
  RAISE foreign_key_violation
  USING message = 'unknown database role: ' || NEW.role;
  RETURN NULL;
END IF;
  RETURN new;
END
$$;

DROP TRIGGER IF EXISTS ensure_user_role_exists ON apflora.user;

CREATE CONSTRAINT TRIGGER ensure_user_role_exists
  AFTER INSERT OR UPDATE ON apflora.user FOR EACH ROW
  EXECUTE PROCEDURE auth.check_role_exists ();

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- this does not work on windows and ubuntu (?)
-- need to run pgjwt.sql instead
--create extension if not exists pgjwt;
CREATE OR REPLACE FUNCTION apflora.encrypt_pass ()
  RETURNS TRIGGER
  AS $$
BEGIN
  -- this is REALLY weird:
  -- if NULLIF(NEW.pass,'') IS NOT NULL and (TG_OP = 'INSERT' or NEW.pass <> OLD.pass) then
  -- always only worked the SECOND time pass was changed
  IF NULLIF (NEW.pass, '') IS NOT NULL AND (TG_OP = 'INSERT' OR char_length(NEW.pass) < 40) THEN
    NEW.pass := crypt(NEW.pass, gen_salt('bf'));
  END IF;
  RETURN NEW;
END
$$
LANGUAGE plpgsql
SECURITY DEFINER;

COMMENT ON FUNCTION apflora.encrypt_pass () IS 'hashed das Passwort bei insert und update';

-- We’ll use the pgcrypto extension and a trigger
-- to keep passwords safe in the users table
-- PROBLEM: This trigger does NOT work on insert
DROP TRIGGER IF EXISTS encrypt_pass ON apflora.user;

DROP TRIGGER IF EXISTS on_change_pass ON apflora.user;

CREATE TRIGGER on_change_pass
  BEFORE INSERT OR UPDATE ON apflora.user FOR EACH ROW
  EXECUTE PROCEDURE apflora.encrypt_pass ();

GRANT EXECUTE ON FUNCTION apflora.encrypt_pass () TO apflora_reader;

GRANT EXECUTE ON FUNCTION apflora.encrypt_pass () TO apflora_ap_reader;

GRANT EXECUTE ON FUNCTION apflora.encrypt_pass () TO apflora_ap_writer;

GRANT EXECUTE ON FUNCTION apflora.encrypt_pass () TO apflora_manager;

GRANT EXECUTE ON FUNCTION apflora.encrypt_pass () TO apflora_freiwillig;

GRANT EXECUTE ON FUNCTION apflora.encrypt_pass () TO authenticator;

GRANT EXECUTE ON FUNCTION apflora.encrypt_pass () TO anon;

GRANT EXECUTE ON FUNCTION apflora.encrypt_pass () TO public;

GRANT EXECUTE ON FUNCTION apflora.encrypt_pass () TO authenticator;

GRANT EXECUTE ON FUNCTION public.crypt(text, text) TO public;

-- Helper to check a password against the encrypted column
-- It returns the database role for a user
-- if the name and password are correct
CREATE OR REPLACE FUNCTION auth.user_role (username text, pass text)
  RETURNS name
  LANGUAGE plpgsql
  AS $$
BEGIN
  RETURN (
    SELECT
      ROLE
    FROM
      apflora.user
    WHERE
      apflora.user.name = $1
      AND apflora.user.pass = crypt($2, apflora.user.pass));
END;
$$;

-- stored procedure that returns the token
CREATE TYPE auth.jwt_token AS (
  ROLE text,
  username text,
  token text
);

-- Login function which takes an user name and password
-- and returns JWT if the credentials match a user in the internal table
CREATE OR REPLACE FUNCTION apflora.login (username text, pass text)
  RETURNS auth.jwt_token
  AS $$
DECLARE
  _role name;
  result auth.jwt_token;
  token text;
BEGIN
  -- check username and password
  SELECT
    auth.user_role ($1, $2) INTO _role;
  IF _role IS NULL THEN
    RAISE invalid_password
    USING message = 'invalid user or password';
  END IF;
    RETURN (_role,
      $1,
      current_setting('app.jwt_secret'))::auth.jwt_token;
END;
$$
LANGUAGE plpgsql;

-- permissions that allow anonymous users to create accounts
-- and attempt to log in
CREATE ROLE anon;

CREATE ROLE authenticator WITH LOGIN PASSWORD 'secret' noinherit;

GRANT anon TO authenticator;

GRANT connect ON DATABASE apflora TO authenticator;

GRANT connect ON DATABASE apflora TO anon;

GRANT usage ON SCHEMA public, auth, apflora, request TO anon;

GRANT SELECT ON TABLE pg_authid TO anon;

GRANT EXECUTE ON FUNCTION apflora.login (text, text) TO anon;

GRANT EXECUTE ON FUNCTION auth.sign(json, text, text) TO anon;

GRANT EXECUTE ON FUNCTION auth.user_role (text, text) TO anon;

GRANT EXECUTE ON FUNCTION request.user_name () TO anon;

GRANT EXECUTE ON FUNCTION request.jwt_claim (text) TO anon;

GRANT EXECUTE ON FUNCTION request.env_var (text) TO anon;

GRANT SELECT ON TABLE apflora.user TO anon;

