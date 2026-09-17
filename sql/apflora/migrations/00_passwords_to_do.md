# Phased rollout

## Phase 1 - deploy the security fix NOW (no change for users)

1. deploy the repo to the server
2. run migrations 01, 02, 03 and 05 - NOT 04
   (02 sets require_new_password_on_next_login = false for everyone:
   users keep logging in as before, incl. users without passwords)
3. restart the graphql server (docker compose up -d graphql)
   - closes the anonymous password-hash leak (--default-role anon)
4. test: login works, app works

## Phase 2 - build the proper password-setup flow

- set_initial_password as a SECURITY DEFINER function
  (only for users without a password, ideally with an email token)
- password rotation for logged-in users
- replace the anonymous updateUserById call in src/components/User.tsx
- merge the password-strength branch

## Phase 3 - in a few weeks: force the password change

1. inform users they will have to set new passwords and why
2. run 04_set_allrequire.sql
3. restart the graphql server
4. test: login shows the password setup dialog
