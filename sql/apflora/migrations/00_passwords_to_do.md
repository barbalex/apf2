# Phased rollout

## Phase 1 - security fix - branch: security-fix

Deployed from the security-fix branch, see
00_deploy_security_fix.md there. It applies migrations 02 and 05
and restarts the graphql server with --default-role anon.
No change for users: nobody is forced to change their password.

## Phase 2 - this branch: enforce strong passwords

1. build the proper password-setup flow:
   - set_initial_password as a SECURITY DEFINER function
     (only for users without a password, ideally with an email token)
   - password rotation for logged-in users
   - replace the anonymous updateUserById call in src/components/User.tsx
2. merge security-fix (or master, once security-fix is merged)
3. run migrations 01 and 03
   (02 and 05 are already applied by security-fix;
   re-running them is harmless)
4. restart the graphql server, test

## Phase 3 - in a few weeks: force the password change

1. inform users they will have to set new passwords and why
2. run 04_set_allrequire.sql
3. restart the graphql server
4. test: login shows the password setup dialog
