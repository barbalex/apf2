-- Grant permissions for all roles to read the require_new_password_on_next_login column
-- This is needed for the login flow to check if a user needs to set a new password
--
-- BEWARE: apflora_ap_reader, apflora_ap_writer and apflora_freiwillig
-- MUST be included: the computed field apflora.user_label(u) takes the
-- whole row, so every role needs SELECT on EVERY column of apflora.user.
-- Without it, all non-manager logins fail with
-- "permission denied for table user" (#825) because the tree's
-- allUsers(orderBy: LABEL_ASC) { nodes { label } } query is denied.

-- First revoke the existing column-specific grants
-- (apflora_artverantwortlich is optional: the role does not exist
-- in every installation and keeps its old column grants if it does)
REVOKE SELECT ON apflora.user FROM anon;
REVOKE SELECT ON apflora.user FROM apflora_reader;
REVOKE SELECT ON apflora.user FROM apflora_manager;
REVOKE SELECT ON apflora.user FROM apflora_ap_reader;
REVOKE SELECT ON apflora.user FROM apflora_ap_writer;
REVOKE SELECT ON apflora.user FROM apflora_freiwillig;

-- Then grant with the new column included
-- anon gets neither pass nor email: the pre-auth login flow needs
-- id, name and require_new_password_on_next_login only
-- (see also 05_revoke_anonymous_pass_access.sql and
-- 06_harden_password_hashing.sql)
-- All app roles need SELECT on every column incl. pass: postgraphile
-- passes whole rows (e.g. to the user_label computed function),
-- which requires column privileges on all of them.
GRANT SELECT (id, name, require_new_password_on_next_login) ON apflora.user TO anon;
GRANT SELECT (id, name, email, pass, role, adresse_id, require_new_password_on_next_login) ON apflora.user TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_freiwillig, apflora_manager;

-- verify afterwards:
--   SELECT r, has_column_privilege(r, 'apflora.user', 'require_new_password_on_next_login', 'SELECT')
--   FROM unnest(ARRAY['anon','apflora_reader','apflora_ap_reader','apflora_freiwillig','apflora_ap_writer','apflora_manager']) r;
--   expected: true for every role
