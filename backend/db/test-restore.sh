# restore test: downloads the newest backup from nextcloud and
# restores it into a scratch database inside the running postgres,
# runs sanity counts, drops the scratch database.
# run inside the apf_db container: docker exec -it apf_db bash ./test-restore.sh
# optionally pass a local dump file to skip the download:
#   docker exec -it apf_db bash ./test-restore.sh /sik_data/apflora.backup
# BEWARE: rclone config is expected at /root/.config/rclone/rclone.conf
# (mounted from the host, see docker-compose.yml)
# no extensions need pre-creating: the dump carries its own
# CREATE EXTENSION statements (postgis included)

set -e

REMOTE_DIR="nextcloud:Gabriel Software/projekte/apflora/sik"
SCRATCH_DB="apflora_restore_test"
NEWEST=${1:-}

if [ -z "$NEWEST" ]; then
  echo "finding newest backup..."
  NEWEST=$(rclone lsf "$REMOTE_DIR" | grep -E '^[0-9]{4}-' | sort | tail -1)
  if [ -z "$NEWEST" ]; then
    echo "ERROR: no backup found in $REMOTE_DIR"
    exit 1
  fi
  echo "newest backup: $NEWEST"
  echo "downloading..."
  rclone copyto "$REMOTE_DIR/$NEWEST" "/tmp/$NEWEST" --retries 3
  NEWEST="/tmp/$NEWEST"
fi

echo "restoring $NEWEST into scratch database $SCRATCH_DB..."
dropdb --if-exists -U postgres -h localhost "$SCRATCH_DB"
createdb -U postgres -h localhost "$SCRATCH_DB"
# tolerate only benign errors (e.g. objects colliding with what
# createdb made) - anything else fails the test
set +e
pg_restore -U postgres -h localhost --dbname="$SCRATCH_DB" --no-owner "$NEWEST" 2> /tmp/restore.log
set -e
FATAL=$(grep '^pg_restore: error:' /tmp/restore.log | grep -cv 'already exists') || true
if [ "$FATAL" -gt 0 ]; then
  cat /tmp/restore.log
  echo "ERROR: restore had $FATAL fatal errors"
  exit 1
fi
echo "restore ok ($(grep -c '^pg_restore: error:' /tmp/restore.log || true) benign errors tolerated)"

echo "sanity counts:"
for t in projekt ap pop tpop tpopkontr tpopmassn beob adresse '"user"'; do
  COUNT=$(psql -U postgres -h localhost -d "$SCRATCH_DB" -At -c "select count(*) from apflora.$t")
  echo "  $t: $COUNT"
done

echo "cleaning up..."
dropdb -U postgres -h localhost "$SCRATCH_DB"
rm -f "/tmp/"*_apflora.backup
echo "restore test OK: $NEWEST restores cleanly"
