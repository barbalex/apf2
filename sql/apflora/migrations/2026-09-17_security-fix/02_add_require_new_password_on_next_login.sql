-- Add require_new_password_on_next_login column to user table
-- This column allows forcing users to change their password on next login

-- DEFAULT false: existing users keep logging in normally.
-- New users get their initial password set by a manager via the
-- Benutzer form (the current workflow) until the self-service
-- password setup is deployed.
-- The forced password change for all users happens later,
-- by running 04_set_allrequire.sql
ALTER TABLE apflora.user
  ADD COLUMN IF NOT EXISTS require_new_password_on_next_login boolean DEFAULT false;

-- set the default to false also on databases where the column
-- was already added with DEFAULT true
ALTER TABLE apflora.user
  ALTER COLUMN require_new_password_on_next_login SET DEFAULT false;

-- remember to reload the graphql server after applying this migration
