-- Let PostGraphile connect as the non-superuser role authenticator
-- instead of the postgres superuser (DATABASE_URL in backend/.env).
--
-- authenticator switches to the role from the JWT (or anon) per
-- request, so it must be a member of every role a user can have.

-- apflora_freiwillig was missing: freiwillig users could not be
-- switched to their role
GRANT apflora_freiwillig TO authenticator;

-- schema access for the connection itself (introspection)
GRANT USAGE ON SCHEMA apflora, auth, public, request TO authenticator;

-- NOT part of this migration because it is environment specific:
-- set a strong password and use it in backend/.env:
--   ALTER ROLE authenticator PASSWORD '<strong password>';
--   DATABASE_URL=postgres://authenticator:<strong password>@db:5432/apflora
-- rollback: revert DATABASE_URL to the postgres user and restart
-- the graphql server
