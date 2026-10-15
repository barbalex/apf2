-- Secure password setup for the pre-auth login flow
--
-- Replaces the frontend's anonymous updateUserById call, which was
-- both broken (anon has no UPDATE privilege) and dangerous (with
-- that privilege, anyone could have taken over any account).
--
-- Rules:
-- - user without a password: sets the initial one
-- - user with a password: the old password must be proved first
--   (this is the forced-rotation path for phase 3)
-- - complexity is enforced by the 0_validate_password_before_encrypt
--   trigger, hashing by on_change_pass - both fire on this UPDATE
-- - SECURITY DEFINER: executed by anon during login, reads and
--   writes apflora.user.pass

CREATE OR REPLACE FUNCTION apflora.set_password (
  p_username text,
  p_new_pass text,
  p_old_pass text DEFAULT NULL
)
  RETURNS uuid
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = apflora, public
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

  IF v_pass IS NOT NULL THEN
    -- a password is already set: prove knowledge of it
    IF NULLIF(p_old_pass, '') IS NULL THEN
      RAISE EXCEPTION 'altes Passwort erforderlich';
    END IF;
    IF v_pass IS DISTINCT FROM crypt(p_old_pass, v_pass) THEN
      RAISE EXCEPTION 'altes Passwort ist nicht korrekt';
    END IF;
  END IF;

  UPDATE apflora.user
    SET pass = p_new_pass,
        require_new_password_on_next_login = false
    WHERE id = v_id;

  RETURN v_id;
END;
$$;

COMMENT ON FUNCTION apflora.set_password(text, text, text) IS
  'sets the initial password or - with proof of the old one - a new one; callable before login';

-- pre-auth password setup: executable by anonymous visitors
GRANT EXECUTE ON FUNCTION apflora.set_password(text, text, text) TO anon;
GRANT EXECUTE ON FUNCTION apflora.set_password(text, text, text) TO authenticator;
