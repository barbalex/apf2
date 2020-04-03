# dumped apflora
# stellt dem Filenamen das Datum voran
# kopiert das File auf die dropbox
# entfernt das File
#PATH=$PATH:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin
#SHELL=/bin/sh PATH=/bin:/sbin:/usr/bin:/usr/sbin:/root/
FILENAME=$(date +"%Y-%m-%d_%H-%M-%S_apflora.backup")
# see: https://stackoverflow.com/a/29913462/712005
docker exec -t apf_db pg_dump -U postgres -h localhost --file=/sik_data/$FILENAME -Fc -Z9 apflora
# see: https://stackoverflow.com/a/22050116/712005
docker cp apf_db:/sik_data/$FILENAME /shared/$FILENAME
/dropbox_uploader.sh upload /shared/$FILENAME $FILENAME
rm /shared/$FILENAME
docker exec apf_db rm /sik_data/$FILENAME
echo "backed up $(FILENAME)" >> /var/log/cron.log 2>&1