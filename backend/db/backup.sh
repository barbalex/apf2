# dumped apflora
# stellt dem Filenamen das Datum voran
# kopiert das File auf die dropbox
# entfernt das File
echo "will back up apflora"
FILENAME=$(date +"%Y-%m-%d_%H-%M-%S_apflora.backup")
PGPASSWORD=Wy5doZyg0z5B pg_dump -U postgres -h localhost --file=/sik_data/$FILENAME -Fc -Z9 apflora
/dropbox_uploader.sh upload /sik_data/$FILENAME $FILENAME
rm /sik_data/$FILENAME
echo "backed up $FILENAME" >> /var/log/cron.log 2>&1