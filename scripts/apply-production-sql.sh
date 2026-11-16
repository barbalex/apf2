#!/bin/bash
# Applies SQL to the PRODUCTION database on api.apflora.ch
# (ssh root@api.apflora.ch, container apf_db, db apflora, user postgres).
#
# What it does, in order:
#   1. prints target + files and asks for confirmation (--yes skips)
#   2. snapshots all RLS policies of the apflora schema to a local
#      timestamped file under prod-snapshots/ (rollback artifact)
#   3. applies each file in a SINGLE transaction, aborting on the first
#      error (transactional DDL — a failed file leaves no partial state)
#   4. reloads the PostgREST schema cache and smoke-tests the API
#
# Usage:
#   scripts/apply-production-sql.sh                      # standard list (scripts/sql-files.sh)
#   scripts/apply-production-sql.sh path/to/file.sql …   # explicit files
#   scripts/apply-production-sql.sh --yes …              # skip the prompt (CI)
#
# DB migrations must be applied BEFORE deploying a frontend that depends
# on them (npm run deploy deploys the frontend).
set -e
cd "$(dirname "$0")/.."

PROD_HOST="${PROD_HOST:-root@api.apflora.ch}"
PSQL="docker exec -i apf_db psql -U postgres -d apflora"

source scripts/sql-files.sh

ASSUME_YES=false
if [ "${1:-}" = "--yes" ]; then
  ASSUME_YES=true
  shift
fi
if [ $# -gt 0 ]; then
  FILES=("$@")
fi

echo "Target: $PROD_HOST ($PSQL)"
echo "Files:"
for file in "${FILES[@]}"; do
  [ -f "$file" ] || { echo "no such file: $file" >&2; exit 1; }
  echo "  $file"
done

if [ "$ASSUME_YES" = false ]; then
  # shellcheck disable=SC2162
  read -r -p "Apply to PRODUCTION? Type yes: " answer
  [ "$answer" = "yes" ] || { echo "aborted"; exit 1; }
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
SNAPSHOT="prod-snapshots/policies-${STAMP}.txt"
mkdir -p prod-snapshots
ssh "$PROD_HOST" "$PSQL -t -A" > "$SNAPSHOT" <<'SQL'
select schemaname, tablename, policyname, cmd, qual, coalesce(with_check, '-')
from pg_policies where schemaname = 'apflora' order by tablename, policyname;
SQL
echo "policy snapshot written: $SNAPSHOT"

for file in "${FILES[@]}"; do
  echo "=== applying $file ==="
  ssh "$PROD_HOST" "$PSQL -v ON_ERROR_STOP=1 -1 -q -f -" < "$file"
done

ssh "$PROD_HOST" "$PSQL -q" <<'SQL'
NOTIFY pgrst, 'reload schema';
SQL

echo "smoke test:"
curl -s -o /dev/null -w "  GET https://api.apflora.ch/postgrest/ -> %{http_code}\n" https://api.apflora.ch/postgrest/
echo "done"
