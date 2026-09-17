-- Fix anonymous password-hash exposure
--
-- sql/auth/createTables.sql historically granted full table SELECT on
-- apflora.user to anon, including the pass column (bcrypt hashes).
-- Anyone could fetch every user's hash:
--   query { allUsers { nodes { name pass } } }
--
-- This revokes the table-level grant. The column-level grants for
-- (id, name, email) from migration 0058 remain in effect, and
-- require_new_password_on_next_login is added so the pre-auth login
-- flow can still decide whether a password setup is needed -
-- without reading pass.
--
-- The pass column is deliberately NOT granted to anon.
-- A user needing to set a password is signalled by
-- require_new_password_on_next_login (true by default for users
-- without a password).

REVOKE SELECT ON TABLE apflora.user FROM anon;

GRANT SELECT (id, name, email, require_new_password_on_next_login)
  ON apflora.user TO anon;

-- auth.user_role reads apflora.user.pass to verify credentials.
-- It is executed by anon during login, so it must run as its owner
-- (SECURITY DEFINER) instead of the calling role.
-- search_path is pinned because the function is SECURITY DEFINER.
ALTER FUNCTION auth.user_role(text, text) SECURITY DEFINER;
ALTER FUNCTION auth.user_role(text, text) SET search_path = apflora, public;

-- verify afterwards:
--   as anon: SELECT pass FROM apflora.user;  -> permission denied
--   GraphQL: query { allUsers { nodes { name pass } } }  -> error on pass
--   GraphQL: mutation { login(...) }  -> invalid user or password (not
--     permission denied)
