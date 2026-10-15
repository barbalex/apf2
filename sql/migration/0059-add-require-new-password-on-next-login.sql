-- Add require_new_password_on_next_login column to user table
ALTER TABLE apflora.user
  ADD COLUMN IF NOT EXISTS require_new_password_on_next_login boolean DEFAULT true;

-- Set existing users with passwords to false (they don't need to change)
UPDATE apflora.user
  SET require_new_password_on_next_login = false
  WHERE pass IS NOT NULL;

-- New users or users without passwords should be set to true (default handles this)
