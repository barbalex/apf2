# dumps apflora db
# encrypts the dump with age BEFORE it leaves this container
# bundles globals + .env as a second encrypted file next to the dump
# prepends the datetime to filename
# uploads the backup to nextcloud
# but only if the data fingerprint changed
# BEWARE: rclone config is expected at /root/.config/rclone/rclone.conf
# it is mounted from the host file /root/backup/rclone.conf, see docker-compose.yml

# encryption: only the PUBLIC key lives here — creating backups is all it
# can do, so it is safe to commit. the private key never touches the VM
# or nextcloud (ransomware model: a compromised VM must not decrypt the
# offsite copies): it lives on the notebook (~/.config/age/keys.txt, plus
# a printout) — decrypt on the notebook via `npm run fetchBackup` or
# `age -d -i ~/.config/age/keys.txt`. if the private key is lost, all
# encrypted backups are garbage — the printout is part of the system.
AGE_RECIPIENT="age13cmlq4g2ycefly443zpdlnfx8f6jcn0jlt6zvfm7vkvrm8y6f4aqq7tveg"

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

TS=$(date +"%Y-%m-%d_%H-%M-%S")
FILENAME="${TS}_apflora.backup.age"
META_FILENAME="${TS}_apflora.meta.age"
REMOTE_DIR="nextcloud:Gabriel Software/projekte/apflora/sik"

# --- meta bundle: globals + .env, encrypted alongside every dump -------
# roles/tablespaces (with their passwords) plus the VM's compose .env —
# everything a lost-VM restore needs besides the dump itself. Same
# timestamp prefix as the dump, so retention pruning treats them as a
# pair. Built and uploaded FIRST: it is small, so a dead nextcloud
# fails the run before the expensive dump is built.
# BEWARE: /backup-env/.env is mounted by docker-compose.yml
# (/root/apf/.env:/backup-env/.env:ro)
echo "bundling globals + env..."
STAGE=/sik_data/meta-stage
rm -rf "$STAGE" && mkdir -p "$STAGE"
if ! PGPASSWORD=$POSTGRES_PASSWORD pg_dumpall -U postgres -h localhost --globals-only > "$STAGE/globals.sql"; then
  echo "ERROR: pg_dumpall failed"
  rm -rf "$STAGE"
  exit 1
fi
if [ -f /backup-env/.env ]; then
  cp /backup-env/.env "$STAGE/env"
else
  # degraded, not fatal: the dump is the critical artifact and the env
  # exists elsewhere too (vault, notes). but this should not happen —
  # the compose mount is part of this change.
  echo "WARNING: /backup-env/.env not mounted - env not bundled (see docker-compose.yml)"
fi
if ! tar -C "$STAGE" -cf /sik_data/meta.tmp .; then
  echo "ERROR: tar of meta bundle failed"
  rm -rf "$STAGE" /sik_data/meta.tmp
  exit 1
fi
rm -rf "$STAGE"
if ! age -r "$AGE_RECIPIENT" -o "/sik_data/$META_FILENAME" /sik_data/meta.tmp; then
  echo "ERROR: age encryption of meta bundle failed"
  rm -f /sik_data/meta.tmp "/sik_data/$META_FILENAME"
  exit 1
fi
rm -f /sik_data/meta.tmp
echo "uploading meta bundle..."
if ! rclone copyto "/sik_data/$META_FILENAME" "$REMOTE_DIR/$META_FILENAME" --retries 3; then
  echo "ERROR: meta bundle upload to nextcloud failed"
  rm -f "/sik_data/$META_FILENAME"
  exit 1
fi

# --- the dump itself -----------------------------------------------------
echo "creating dump file..."
PGPASSWORD=$POSTGRES_PASSWORD pg_dump -U postgres -h localhost --file=/sik_data/dump.tmp -Fc -Z9 apflora || {
  echo "ERROR: pg_dump failed"
  rm -f /sik_data/dump.tmp "/sik_data/$META_FILENAME"
  exit 1
}

echo "encrypting dump file..."
if ! age -r "$AGE_RECIPIENT" -o "/sik_data/$FILENAME" /sik_data/dump.tmp; then
  echo "ERROR: age encryption failed"
  rm -f /sik_data/dump.tmp "/sik_data/$META_FILENAME"
  exit 1
fi
rm -f /sik_data/dump.tmp
# plaintext-era leftovers — the encrypted pipeline replaced them
rm -f /sik_data/last.backup

upload() {
  echo "uploading backup file..."
  # BEWARE: the remote name needs to match the one defined in rclone.conf, i.e. nextcloud
  if ! rclone copyto "/sik_data/$FILENAME" "$REMOTE_DIR/$FILENAME" --retries 3; then
    # on failure: keep last.backup.age so the next run retries the upload
    echo "ERROR: upload to nextcloud failed"
    rm -f "/sik_data/$FILENAME" "/sik_data/$META_FILENAME"
    exit 1
  fi
}

upload

# only replace the lasts and the fingerprint after a successful upload
rm -f /sik_data/last.backup.age /sik_data/last.meta.age
mv -f "/sik_data/$FILENAME" /sik_data/last.backup.age
mv -f "/sik_data/$META_FILENAME" /sik_data/last.meta.age
echo "$FINGERPRINT" > /sik_data/last.fingerprint
echo "backed up $FILENAME (+ $META_FILENAME)"

# prune the nextcloud folder to the retention scheme (7/4/12/yearly).
# best-effort: the dumps are already safe at this point, so a prune
# failure warns but does not fail the backup (the dead-man's switch
# stays green — check the log for the warning line)
echo "pruning nextcloud folder to retention scheme..."
if ! ./prune-backups.sh; then
  echo "WARNING: retention pruning failed - run ./prune-backups.sh manually"
fi
