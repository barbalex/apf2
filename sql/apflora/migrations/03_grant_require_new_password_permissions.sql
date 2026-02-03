-- Grant permissions for anon users to read the require_new_password_on_next_login column
-- This is needed for the login flow to check if a user needs to set a new password

-- First revoke the existing column-specific grants
REVOKE SELECT ON apflora.user FROM anon;
REVOKE SELECT ON apflora.user FROM apflora_reader;
REVOKE SELECT ON apflora.user FROM apflora_artverantwortlich;
REVOKE SELECT ON apflora.user FROM apflora_manager;

-- Then grant with the new column included
GRANT SELECT (id, name, email, pass, require_new_password_on_next_login) ON apflora.user TO anon;
GRANT SELECT (id, name, email, require_new_password_on_next_login) ON apflora.user TO apflora_reader;
GRANT SELECT (id, name, email, require_new_password_on_next_login) ON apflora.user TO apflora_artverantwortlich;
GRANT SELECT (id, name, email, pass, require_new_password_on_next_login) ON apflora.user TO apflora_manager;
