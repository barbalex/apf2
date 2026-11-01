-- PostgREST migration, phase 1 (see tasks.md):
-- 1. login signs the JWT in the database. PostGraphile did the signing
--    itself until now (it converted the auth.jwt_token composite into a
--    token); PostgREST cannot. Claim set matches what PostGraphile
--    minted: 24 h lifetime, aud/iss postgraphile.
--    This also fixes a leak: the old login returned the raw signing
--    secret as the token field, and PostGraphile embedded it as a claim
--    in every issued JWT — any logged-in user could forge tokens for
--    arbitrary roles. Rotate the secret when applying this migration.
-- 2. current_user_name reads PostgREST's single request.jwt.claims JSON
--    GUC, falling back to PostGraphile's jwt.claims.username (dual-stack).

BEGIN;

CREATE OR REPLACE FUNCTION current_user_name()
  RETURNS text
  AS $$
  SELECT coalesce(
    nullif(current_setting('request.jwt.claims', TRUE)::jsonb ->> 'username', ''),
    nullif(current_setting('jwt.claims.username', TRUE), '')
  )::text;
$$
LANGUAGE sql
STABLE
SECURITY DEFINER;

CREATE OR REPLACE FUNCTION apflora.login (username text, pass text)
  RETURNS auth.jwt_token
  AS $$
DECLARE
  _role name;
BEGIN
  -- check username and password
  SELECT
    auth.user_role ($1, $2) INTO _role;
  IF _role IS NULL THEN
    RAISE invalid_password
    USING message = 'invalid user or password';
  END IF;
  RETURN (
    _role,
    $1,
    auth.sign(
      json_build_object(
        'role', _role::text,
        'username', $1,
        'iat', (extract(epoch FROM now()))::bigint,
        'exp', (extract(epoch FROM now() + interval '24 hours'))::bigint,
        'aud', 'postgraphile',
        'iss', 'postgraphile'
      ),
      current_setting('app.jwt_secret'),
      'HS256'
    )
  )::auth.jwt_token;
END;
$$
LANGUAGE plpgsql;

COMMIT;
