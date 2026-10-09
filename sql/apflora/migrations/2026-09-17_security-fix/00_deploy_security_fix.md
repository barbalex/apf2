# Deploy the security fix to the live server

Closes the anonymous password-hash exposure, hardens password
hashing and connects PostGraphile as a non-superuser.
No change for users: nobody is forced to change their password
(that happens later, from the password-strength branch,
via 04_set_allrequire.sql).

1. deploy this branch to the server
2. run these migrations in this order:
   - 02_add_require_new_password_on_next_login.sql
     (adds a boolean column, default false - preparation for later
     enforcement of stronger passwords)
   - 05_revoke_anonymous_pass_access.sql
     (revokes anon's table-level SELECT incl. pass, makes
     auth.user_role SECURITY DEFINER so login keeps working)
   - 06_harden_password_hashing.sql
     (fixes encrypt_pass storing 40+ character passwords as
     plaintext, raises bcrypt cost to 12, completes column grants
     for all app roles)
   - 07_connect_as_authenticator.sql
     (memberships and schema access for the authenticator role)
3. on the server database, set a strong password for authenticator
   (NOT in a migration file - it is environment specific):
     docker exec apf_db psql -U postgres -d apflora -c \
       "ALTER ROLE authenticator PASSWORD '<strong password>';"
4. in backend/.env set:
     DATABASE_URL=postgres://authenticator:<strong password>@db:5432/apflora
5. restart the graphql server:
   docker compose up -d graphql
   (--default-role anon: unauthenticated requests no longer run as
   superuser; GraphiQL is disabled)
6. test:
   - login works, app loads as usual
   - these queries against the api must return "permission denied",
     not data:
     query { allUsers(first: 1) { nodes { name pass } } }
     query { allUsers(first: 1) { nodes { email } } }
   - https://api.apflora.ch/graphiql must no longer be served

rollback (if the graphql server fails to start):
- in backend/.env revert DATABASE_URL to the postgres user
  and restart the graphql server
