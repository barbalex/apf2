# dumped apflora
# stellt dem Filenamen das Datum voran
# dumps apflora
# prepends the datetime to filename
# moves the backup to the correct folder on dropbox
# if the filesize of the dump changed
echo "creating dump file..."
FILENAME=$(date +"%Y-%m-%d_%H-%M-%S_apflora.backup")
PGPASSWORD=$POSTGRES_PASSWORD pg_dump -U postgres -h localhost --file=/sik_data/$FILENAME -Fc -Z9 apflora
# TODO: only copy to dropbox if file contents has changed
# Because this is efficient, change crontab to run also on weekends
# How to:
# if no last.backup exists: (https://askubuntu.com/a/835320/234871)
if [ -f /sik_data/last.backup ]; then
  echo "previous backup exists"
else
  echo "previous backup does not exist"
  # 1. copy to dropbox
  echo "uploading backup file..."
  rclone copy /sik_data/$FILENAME dropbox:Apps/apf
  # 2. rename $FILENAME to last.backup
  # http://manpages.ubuntu.com/manpages/xenial/man1/mv.1.html
  mv -f /sik_data/$FILENAME /sik_data/last.backup
  echo "backed up $FILENAME"
  exit 0
fi
# Check if file content is different: https://stackoverflow.com/a/63976250/712005
#if cmp --silent -- /sik_data/$FILENAME /sik_data/last.backup; then
# this did not work. Probably the dump file contains information on it's creation
# so only compare file size: https://stackoverflow.com/a/17009642/712005
if ((`stat -c%s "/sik_data/$FILENAME"`==`stat -c%s "/sik_data/last.backup"`)); then
  echo "files contents are identical - not uploading"
  # If size has not changed:
  # delete $FILENAME
  rm -f /sik_data/$FILENAME
  exit 0
else
  echo "backup differs from previous"
  # If size has changed:
  # 1. copy to dropbox
  echo "uploading backup file..."
  rclone copy /sik_data/$FILENAME dropbox:Apps/apf
  # 2. delete last.backup
  rm -f /sik_data/last.backup
  # 3. rename $FILENAME to last.backup
  mv -f /sik_data/$FILENAME /sik_data/last.backup
  echo "backed up $FILENAME"
  exit 0
fi