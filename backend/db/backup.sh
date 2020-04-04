# dumped apflora
# stellt dem Filenamen das Datum voran
# kopiert das File auf die dropbox
# entfernt das File
#PATH=$PATH:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin
#SHELL=/bin/sh PATH=/bin:/sbin:/usr/bin:/usr/sbin:/root/
FILENAME=$(date +"%Y-%m-%d_%H-%M-%S_apflora.backup")
PGPASSWORD=Wy5doZyg0z5B pg_dump -U postgres -h localhost --file=/shared/$FILENAME -Fc -Z9 apflora
/dropbox_uploader.sh upload /shared/$FILENAME $FILENAME
rm /shared/$FILENAME
echo "backed up $(FILENAME)" >> /var/log/cron.log 2>&1