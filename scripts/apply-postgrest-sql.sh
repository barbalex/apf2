#!/bin/bash
# Applies the PostgREST-migration SQL to the local dev database
# (backend-dev, container apf_db).
#
# Needed after every fresh restore: the seed backup
# (backend-dev/db/apflora.backup) predates the PostgREST migration, so
# `docker compose down -v` leaves the db without the new apflora.login
# and the query_*/compile_filter RPC family the frontend depends on —
# login then "succeeds" but returns the raw jwt secret as the token and
# every migrated query 404s.
#
# Usage: scripts/apply-postgrest-sql.sh
set -e
cd "$(dirname "$0")/.."

FILES=(
  sql/migration/0063-postgrest-login.sql
  sql/migration/0064-views-security-invoker.sql
  sql/migration/0065-rpc-hardening.sql
  sql/apflora/migrations/2026-10-12_issue-823-ekf-passwort/00_grant_require_new_password.sql
  sql/apflora/migrations/2026-11-04_issue-835-login-password-enforcement/00_enforce_password_change_in_login.sql
  sql/apflora/migrations/2026-11-09_set-password-no-passless-claiming/00_close_passless_claiming.sql
  sql/postgrest/createComputedViews.sql
  sql/postgrest/compileFilter.sql
  sql/postgrest/createQueryRpcs.sql
  sql/postgrest/createGetGemeinde.sql
  sql/postgrest/createKarteHelpers.sql
  sql/postgrest/createApberForYear.sql
  sql/postgrest/createApberForApFromAp.sql
  sql/postgrest/createApberChartsBulk.sql
)

for file in "${FILES[@]}"; do
  echo "=== applying $file ==="
  docker exec -i apf_db psql -U postgres -d apflora -v ON_ERROR_STOP=1 -q < "$file"
done

# PostgREST caches the schema: make it pick up the new functions
docker exec apf_db psql -U postgres -d apflora -c "NOTIFY pgrst, 'reload schema'"
echo "done"
