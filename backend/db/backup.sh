# dumps apflora db
# prepends the datetime to filename
# uploads the backup to nextcloud
# but only if the data fingerprint changed
# BEWARE: rclone config is expected at /root/.config/rclone/rclone.conf
# it is mounted from the host file /root/backup/rclone.conf, see docker-compose.yml

# data fingerprint: deterministic checksum over every base table's
# rows in the apflora schema: per table the row count plus an
# order-independent sum of per-row md5 hashes (to_jsonb normalizes
# key order, so column order does not matter). replaces the old
# size-equality check - equal size with different content silently
# skipped backups. a plain string_agg over the rows would overflow
# the 1GB string buffer on beob (500k rows with geometries).
# the table list is generated from the catalog, so future migration
# tables are covered automatically.
# error_report is excluded: client-error telemetry changes almost
# daily without real data changing (it stays in the dump itself).
FINGERPRINT=$(
  PGPASSWORD=$POSTGRES_PASSWORD psql -U postgres -h localhost -d apflora -At <<'EOSQL' | md5sum | cut -d' ' -f1
select format(
  'select %L, count(*), coalesce(sum(((''x'' || substr(md5((to_jsonb(t))::text), 1, 16))::bit(64)::bigint)), 0) from apflora.%I t;',
  c.relname, c.relname
)
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'apflora'
  and c.relkind = 'r'
  and c.relname <> 'error_report'
order by c.relname
\gexec
EOSQL
)
if [ -f /sik_data/last.fingerprint ] && [ "$FINGERPRINT" = "$(cat /sik_data/last.fingerprint)" ]; then
  echo "data fingerprint unchanged - not dumping"
  exit 0
fi

echo "creating dump file..."
FILENAME=$(date +"%Y-%m-%d_%H-%M-%S_apflora.backup")
PGPASSWORD=$POSTGRES_PASSWORD pg_dump -U postgres -h localhost --file=/sik_data/$FILENAME -Fc -Z9 apflora

REMOTE_DIR="nextcloud:Gabriel Software/projekte/apflora/sik"

upload() {
  echo "uploading backup file..."
  # BEWARE: the remote name needs to match the one defined in rclone.conf, i.e. nextcloud
  if ! rclone copyto "/sik_data/$FILENAME" "$REMOTE_DIR/$FILENAME" --retries 3; then
    # on failure: keep last.backup so the next run retries the upload
    echo "ERROR: upload to nextcloud failed"
    rm -f "/sik_data/$FILENAME"
    exit 1
  fi
}

upload

# only replace last.backup and the fingerprint after a successful upload
rm -f /sik_data/last.backup
mv -f "/sik_data/$FILENAME" /sik_data/last.backup
echo "$FINGERPRINT" > /sik_data/last.fingerprint
echo "backed up $FILENAME"
