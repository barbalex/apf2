-- Harden password hashing
--
-- 1. The old encrypt_pass trigger only encrypted passwords shorter
--    than 40 characters: a password of 40+ characters was stored as
--    PLAINTEXT (and login then failed for it).
--    New rule: encrypt everything that is not already a bcrypt hash.
-- 2. bcrypt cost is raised from 6 to 12. Existing hashes keep
--    verifying (the cost is encoded in the salt); new and changed
--    passwords get the stronger hashing.

CREATE OR REPLACE FUNCTION apflora.encrypt_pass ()
  RETURNS TRIGGER
  AS $$
BEGIN
  IF NULLIF (NEW.pass, '') IS NOT NULL AND NEW.pass !~ '^\$2[aby]\$[0-9]{2}\$' THEN
    NEW.pass := crypt(NEW.pass, gen_salt('bf', 12));
  END IF;
  RETURN NEW;
END
$$
LANGUAGE plpgsql
SECURITY DEFINER;

-- anon does not need email: the login flow reads id, name and
-- require_new_password_on_next_login only
REVOKE SELECT ON apflora.user FROM anon;
GRANT SELECT (id, name, require_new_password_on_next_login)
  ON apflora.user TO anon;

-- manager needs SELECT on every column incl. pass: postgraphile
-- passes whole rows (e.g. to the user_label computed function),
-- which requires column privileges on all of them.
-- (values are only returned for explicitly selected fields)
REVOKE SELECT ON apflora.user FROM apflora_manager;
GRANT SELECT (id, name, email, pass, role, adresse_id, require_new_password_on_next_login)
  ON apflora.user TO apflora_manager;

-- same for the other app roles: older installations narrowed their
-- column grants (e.g. migration 0058 granted readers only
-- id, name, email) which breaks whole-row access
REVOKE SELECT ON apflora.user FROM apflora_reader;
REVOKE SELECT ON apflora.user FROM apflora_ap_reader;
REVOKE SELECT ON apflora.user FROM apflora_freiwillig;
REVOKE SELECT ON apflora.user FROM apflora_ap_writer;
GRANT SELECT (id, name, email, pass, role, adresse_id, require_new_password_on_next_login)
  ON apflora.user TO apflora_reader, apflora_ap_reader, apflora_freiwillig, apflora_ap_writer;

-- verify afterwards:
--   GraphQL as anon: allUsers { nodes { email } }  -> permission denied
--   UPDATE apflora.user SET pass = '<41 chars>' ... -> stored as $2a$12$ hash
