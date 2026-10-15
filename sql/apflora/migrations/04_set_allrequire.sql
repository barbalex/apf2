-- FORCE A PASSWORD CHANGE FOR ALL USERS ON THEIR NEXT LOGIN
--
-- DO NOT RUN THIS YET.
-- Run it when the self-service password setup is deployed
-- and users have been informed that they will have to set
-- a new password and why (see 00_passwords_to_do.md).
--
-- After running, every user gets the password setup dialog
-- on their next login. Users without a password get one too.

UPDATE apflora.user
  SET require_new_password_on_next_login = true;

-- new users should set their own password on first login
ALTER TABLE apflora.user
  ALTER COLUMN require_new_password_on_next_login SET DEFAULT true;

-- remember to reload the graphql server after applying this migration
