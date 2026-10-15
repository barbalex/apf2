# dumps apflora db
# prepends the datetime to filename
# uploads the backup to nextcloud
# but only if the size of the dump changed
# BEWARE: rclone config is expected at /root/.config/rclone/rclone.conf
# it is mounted from the host file /root/backup/rclone.conf, see docker-compose.yml

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

if [ ! -f /sik_data/last.backup ]; then
  echo "previous backup does not exist"
  upload
else
  # dump files contain creation metadata, so comparing contents does not work
  # only compare file size: https://stackoverflow.com/a/17009642/712005
  if (( $(stat -c%s "/sik_data/$FILENAME") == $(stat -c%s "/sik_data/last.backup") )); then
    echo "backup is identical to previous - not uploading"
    rm -f "/sik_data/$FILENAME"
    exit 0
  fi
  echo "backup differs from previous"
  upload
fi

# only replace last.backup after a successful upload
rm -f /sik_data/last.backup
mv -f "/sik_data/$FILENAME" /sik_data/last.backup
echo "backed up $FILENAME"
