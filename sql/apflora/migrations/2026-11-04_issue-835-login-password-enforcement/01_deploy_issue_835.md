# Deploy the login password-change enforcement to the live server

Closes #835. Root cause found on the live server (2026-11-04):
anon's SELECT on require_new_password_on_next_login is missing -

  curl 'https://api.apflora.ch/postgrest/user?name=eq.<user>&select=require_new_password_on_next_login'
  -> 42501 permission denied for table user

0065-rpc-hardening.sql revoked it, and the 2026-10-12 re-grant
(2026-10-12_issue-823-ekf-passwort/00_grant_require_new_password.sql)
was never applied to production. The frontend precheck therefore
errors for EVERY account, fails open by design ("never block the
login attempt"), and the deployed login body never checked the flag
either - so no flagged user ever saw the password-setup dialog.

1. run BOTH migrations on the live server, in this order:
   - sql/apflora/migrations/2026-10-12_issue-823-ekf-passwort/00_grant_require_new_password.sql
     (restores the precheck: with the current frontend, flagged
     users get the setup dialog again immediately)
   - 00_enforce_password_change_in_login.sql
     (login becomes SECURITY DEFINER and refuses to mint a token
     for a flagged account, valid credentials included - the
     rotation no longer depends on the frontend at all)
2. verify the grant (must be 200 with a boolean, not 42501):
   curl 'https://api.apflora.ch/postgrest/user?name=eq.<test user>&select=require_new_password_on_next_login'
3. verify the refusal (expect HTTP 400 and the message, not a token):
   docker exec apf_db psql -U postgres -d apflora -c \
     "UPDATE apflora.user SET require_new_password_on_next_login = true WHERE name = '<test user>';"
   curl -s https://api.apflora.ch/postgrest/rpc/login \
     -H 'content-type: application/json' \
     -d '{"username":"<test user>","pass":"<their password>"}'
   then let the test user log in in the app: the setup dialog must
   appear; after setting a new password the login must succeed
4. reset the test user:
   docker exec apf_db psql -U postgres -d apflora -c \
     "UPDATE apflora.user SET require_new_password_on_next_login = false WHERE name = '<test user>';"
5. deploy this branch (frontend): User.tsx maps the new
   'neues Passwort erforderlich' error to the setup dialog, and the
   Benutzer form re-arms the flag whenever a pass is saved

The old frontend tolerates step 1: with the grant restored, its
precheck opens the setup dialog before login is even called; the
new refusal only surfaces (as a silent no-op, then fixed by step 5)
if the precheck request errors.

Rollback: re-run the previous apflora.login body (git history of
sql/auth/createTables.sql).
