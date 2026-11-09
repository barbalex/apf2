# Close the passless-account claiming hole

Resolves the design decision left open by 0065-rpc-hardening
(tasks.md 2026-11-03): `set_password` set an initial password without
any proof when `pass` was still NULL, so **anyone knowing a passless
username could claim the account**. 18 of 91 accounts were
pre-provisioned without a password.

Fix:

- `set_password` refuses passless accounts ('noch kein Passwort
  gesetzt'). anon keeps EXECUTE - the forced rotation (#835) needs it
  and every call must now prove the current password.
- `login` answers passless accounts with the same topos notice instead
  of the generic 'invalid user or password' (small, deliberate
  disclosure: names and the flag are anon-readable anyway, and a
  passless account is no longer claimable).
- Onboarding runs through topos: a manager assigns an initial password
  in the Benutzer form (this re-arms require_new_password_on_next_login)
  and communicates it out of band; the recipient must replace it on
  first login. This replaces the deferred invite-token design - the
  trust assumption is the same (out-of-band delivery of a temporary,
  must-be-rotated credential) without any token machinery.

The DB changes are backward-compatible with the old frontend: a
passless user then sees the server message inline in the setup dialog
instead of the new info dialog. Run them BEFORE the frontend deploy.

## Steps

1. run the migration on the live server:
   - `00_close_passless_claiming.sql`
2. verify the hole is closed (needs a passless account - see step 4;
   with `<passless-name>` from that list, expect 400 and the message
   'noch kein Passwort gesetzt'):
   `curl 'https://api.apflora.ch/postgrest/rpc/set_password' -H 'content-type: application/json' -d '{"p_username":"<passless-name>","p_new_pass":"Testpasswort-2026!"}'`
   (NOT with the value from step 4's list if that account has already
   been given a password - re-check with the query below)
3. deploy the frontend (maps the message to the info dialog)
4. topos task until it returns 0:
   `SELECT name FROM apflora."user" WHERE pass IS NULL;`
   For each account: set an initial password in the Benutzer form
   (Daten → Benutzer) and communicate it out of band. The forced
   rotation makes the recipient replace it on first login.
