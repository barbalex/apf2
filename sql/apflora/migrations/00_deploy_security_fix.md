# Deploy the security fix to the live server

Closes the anonymous password-hash leak. No change for users:
nobody is forced to change their password (that happens later,
from the password-strength branch, via 04_set_allrequire.sql).

1. deploy this branch to the server
2. run these migrations in this order:
   - 02_add_require_new_password_on_next_login.sql
     (adds a boolean column, default false - preparation for later
     enforcement of stronger passwords)
   - 05_revoke_anonymous_pass_access.sql
     (revokes anon's table-level SELECT incl. pass, makes
     auth.user_role SECURITY DEFINER so login keeps working)
3. restart the graphql server:
   docker compose up -d graphql
   (--default-role anon instead of postgres: unauthenticated
   requests no longer run as superuser)
4. test:
   - login works, app loads as usual
   - this query against the api must return "permission denied",
     not password hashes:
     query { allUsers(first: 1) { nodes { name pass } } }
