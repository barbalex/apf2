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
# (production counterpart: scripts/apply-production-sql.sh)
set -e
cd "$(dirname "$0")/.."

source scripts/sql-files.sh

for file in "${FILES[@]}"; do
  echo "=== applying $file ==="
  docker exec -i apf_db psql -U postgres -d apflora -v ON_ERROR_STOP=1 -q < "$file"
done

# PostgREST caches the schema: make it pick up the new functions
docker exec apf_db psql -U postgres -d apflora -c "NOTIFY pgrst, 'reload schema'"
echo "done"
