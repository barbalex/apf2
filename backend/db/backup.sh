# dumped apflora
# stellt dem Filenamen das Datum voran
# kopiert das File auf die dropbox
# entfernt das File
echo "creating dump file..."
FILENAME=$(date +"%Y-%m-%d_%H-%M-%S_apflora.backup")
PGPASSWORD=$POSTGRES_PASSWORD pg_dump -U postgres -h localhost --file=/sik_data/$FILENAME -Fc -Z9 apflora
echo "uploading dump file..."
/dropbox_uploader.sh -f dropbox_uploader.conf upload /sik_data/$FILENAME $FILENAME
rm /sik_data/$FILENAME
echo "backed up $FILENAME" >> /var/log/cron.log 2>&1