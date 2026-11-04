-- Server-side enforcement of require_new_password_on_next_login (#835)
--
-- Until now only the frontend honoured the flag: User.tsx asks (as
-- anon) for require_new_password_on_next_login before calling login
-- and swaps in the password-setup dialog when it is set. The rpc
-- itself minted a token for valid credentials regardless, so the
-- gate was bypassable with a direct api call - and it failed open
-- whenever the precheck errored (it deliberately never blocks the
-- login attempt).
--
-- login now refuses to mint a token while the flag is set. The
-- credentials are verified FIRST: the refusal must not leak whether
-- an account exists or is flagged. The frontend maps the message to
-- the password-setup dialog.
--
-- The function becomes SECURITY DEFINER (like set_password): it now
-- reads require_new_password_on_next_login directly, and that read
-- must not depend on the caller's column grants - anon's grant on
-- the flag was revoked by 0065-rpc-hardening and re-granted for the
-- frontend precheck; a missing grant must not break login itself.
--
-- Manager UI companions to this migration (same deploy): saving a
-- pass in the Benutzer form re-arms the flag, so an assigned
-- password must be rotated by its owner. set_password (the setup
-- dialog) keeps clearing it.

BEGIN;

CREATE OR REPLACE FUNCTION apflora.login (username text, pass text)
  RETURNS auth.jwt_token
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = pg_catalog, public, pg_temp
  AS $$
DECLARE
  _role name;
  _needs_new_password boolean;
BEGIN
  -- check username and password
  SELECT
    auth.user_role ($1, $2) INTO _role;
  IF _role IS NULL THEN
    RAISE invalid_password
    USING message = 'invalid user or password';
  END IF;
  -- forced password rotation: no token until a new password is set
  SELECT
    require_new_password_on_next_login INTO _needs_new_password
  FROM
    apflora.user
  WHERE
    name = $1;
  IF COALESCE(_needs_new_password, false) THEN
    RAISE EXCEPTION
      USING message = 'neues Passwort erforderlich';
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
$$;

COMMIT;
