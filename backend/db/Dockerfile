FROM postgis/postgis:12-3.0

COPY ./init/ /docker-entrypoint-initdb.d/
COPY ./apflora.backup /sik_data/apflora.backup

RUN chmod +x /docker-entrypoint-initdb.d/02_restore.sh

# now to the backup
# TODO:
# for unkonwn reason what follows leads to the db not starting

#Install Cron and curl
#RUN apt-get update
#RUN apt-get -y install cron
#RUN apt-get -y install curl
#RUN apt-get -y install bash

#ADD dropbox_uploader.conf /.dropbox_uploader/dropbox_uploader.conf
#RUN curl "https://raw.githubusercontent.com/andreafabrizi/Dropbox-Uploader/master/dropbox_uploader.sh" -o dropbox_uploader.sh
#RUN chmod +x dropbox_uploader.sh

# Add crontab file in the cron directory
#ADD crontab /etc/cron.d/backup-cron
# Give execution rights on the cron job
#RUN chmod 0644 /etc/cron.d/backup-cron

#ADD backup.sh /backup.sh
#RUN chmod +x /backup.sh
# see: https://stackoverflow.com/a/37458519/712005
#RUN chmod 0744 /backup.sh

# Create the log file to be able to run tail
#RUN touch /var/log/cron.log

# create schared folder to write backups to
#RUN mkdir /shared
#RUN chmod -R 777 /shared

# Run the command on container startup
#CMD cron && tail -f /var/log/cron.log