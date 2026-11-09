-- Close the passless-account claiming hole (tasks.md 2026-11-03):
-- set_password set an initial password WITHOUT ANY PROOF when pass was
-- still NULL, so anyone knowing a passless username could take over
-- the account (18/91 accounts were pre-provisioned without a password).
--
-- Onboarding now runs through topos: a manager assigns an initial
-- password in the Benutzer form (which re-arms the forced rotation,
-- see #835) and communicates it out of band; the recipient must
-- replace it on first login, proving knowledge of the assigned one.
-- anon keeps EXECUTE on set_password - the forced rotation needs it,
-- and it is safe now that every call must prove the current password.
--
-- login tells passless users to coordinate with topos instead of the
-- generic 'invalid user or password'. Deliberate, small disclosure:
-- anon can already enumerate names and the flag via /user?name=eq...,
-- and once claiming is impossible, knowing who is passless yields
-- nothing but a locked account.

BEGIN;

CREATE OR REPLACE FUNCTION apflora.set_password (
  p_username text,
  p_new_pass text,
  p_old_pass text DEFAULT NULL
)
  RETURNS uuid
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = apflora, public, pg_temp
  AS $$
DECLARE
  v_id uuid;
  v_pass text;
BEGIN
  SELECT id, pass INTO v_id, v_pass
    FROM apflora.user WHERE name = p_username;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Benutzer nicht gefunden';
  END IF;

  -- passless accounts can never prove knowledge of a password:
  -- onboarding is a topos-assigned initial password (Benutzer form)
  -- BEWARE: check this BEFORE the crypt() comparison - crypt(x, NULL)
  -- is NULL and NULL IS DISTINCT FROM NULL is false, so the check
  -- below alone would let passless accounts through
  IF v_pass IS NULL THEN
    RAISE EXCEPTION
      USING message = 'Für diesen Benutzer wurde noch kein Passwort gesetzt. Wenden Sie sich an topos, um ein initiales Passwort zu erhalten';
  END IF;

  IF NULLIF(p_old_pass, '') IS NULL THEN
    RAISE EXCEPTION 'altes Passwort erforderlich';
  END IF;
  IF v_pass IS DISTINCT FROM crypt(p_old_pass, v_pass) THEN
    RAISE EXCEPTION 'altes Passwort ist nicht korrekt';
  END IF;

  UPDATE apflora.user
    SET pass = p_new_pass,
        require_new_password_on_next_login = false
    WHERE id = v_id;

  RETURN v_id;
END;
$$;

COMMENT ON FUNCTION apflora.set_password(text, text, text) IS
  'sets a new password after proving knowledge of the old one; callable before login (forced rotation, #835). Passless accounts are refused: topos assigns their initial password';

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
    -- a passless account can never present valid credentials: its
    -- owner gets the topos instruction instead of the generic
    -- refusal (see the header comment for why this is no leak).
    -- Alias u: the parameter name pass would shadow/ambiguate the
    -- column of the same name
    IF EXISTS (
      SELECT 1 FROM apflora.user u
        WHERE u.name = $1 AND u.pass IS NULL
    ) THEN
      RAISE EXCEPTION
        USING message = 'Für diesen Benutzer wurde noch kein Passwort gesetzt. Wenden Sie sich an topos, um ein initiales Passwort zu erhalten';
    END IF;
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
