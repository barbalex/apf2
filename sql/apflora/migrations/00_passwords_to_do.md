# Phased rollout

## Phase 1 - security fix - DONE, deployed 2026-09-17

Merged to master, applied to the live server, see
2026-09-17_security-fix/00_deploy_security_fix.md.
No user was forced to change their password.

## Phase 2 - this branch: enforce strong passwords

Built:
- 08_set_password.sql: apflora.set_password SECURITY DEFINER
  - user without a password: sets the initial one
  - user with a password: the old password must be proved
    (this is the forced-rotation path for phase 3)
  - complexity enforced by the validation trigger (01),
    hashing by on_change_pass
- src/components/User.tsx uses setPassword instead of the
  anonymous updateUserById (which was broken and dangerous)
- the setup dialog asks for the current password when the
  server demands it (rotation case)

Deploy:
1. merge this branch
2. run migrations 01, 03 and 08
3. restart the graphql server
4. test: a user without a password can set one via the login
   dialog; setting a password for an account that has one
   requires the old password

## Phase 3 - in a few weeks: force the password change

1. inform users they will have to set new passwords and why
2. run 04_set_allrequire.sql
3. restart the graphql server
4. test: login shows the password setup dialog; users with a
   password must enter the old one, users without set a new one
