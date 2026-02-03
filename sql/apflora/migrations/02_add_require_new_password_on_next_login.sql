-- Add require_new_password_on_next_login column to user table
-- This column allows forcing users to change their password on next login

ALTER TABLE apflora.user
  ADD COLUMN IF NOT EXISTS require_new_password_on_next_login boolean DEFAULT true;

-- Set existing users with passwords to false (they don't need to change)
-- Users without passwords will keep the default true value
-- DEACTIVATED to enforce immediate password change for all existing users
-- UPDATE apflora.user
--   SET require_new_password_on_next_login = false
--   WHERE pass IS NOT NULL;

-- New users or users without passwords will have the default true value
-- which will prompt them to set a password on next login

-- remember to reload ghe graphql server after applying this migration
