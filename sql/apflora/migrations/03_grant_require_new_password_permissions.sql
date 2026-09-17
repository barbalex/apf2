-- Grant permissions for anon users to read the require_new_password_on_next_login column
-- This is needed for the login flow to check if a user needs to set a new password

-- First revoke the existing column-specific grants
-- (apflora_artverantwortlich is optional: the role does not exist
-- in every installation and keeps its old column grants if it does)
REVOKE SELECT ON apflora.user FROM anon;
REVOKE SELECT ON apflora.user FROM apflora_reader;
REVOKE SELECT ON apflora.user FROM apflora_manager;

-- Then grant with the new column included
-- pass is deliberately NOT granted to anon: it holds bcrypt hashes
GRANT SELECT (id, name, email, require_new_password_on_next_login) ON apflora.user TO anon;
GRANT SELECT (id, name, email, require_new_password_on_next_login) ON apflora.user TO apflora_reader;
GRANT SELECT (id, name, email, pass, role, adresse_id, require_new_password_on_next_login) ON apflora.user TO apflora_manager;
