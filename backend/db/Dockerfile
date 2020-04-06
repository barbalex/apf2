FROM postgis/postgis:12-3.0

COPY ./init/ /docker-entrypoint-initdb.d/
COPY ./apflora.backup /sik_data/apflora.backup

RUN chmod +x /docker-entrypoint-initdb.d/02_restore.sh

# Install Cron and curl
RUN apt-get update
RUN apt-get -y install cron
RUN apt-get -y install curl
RUN apt-get -y install bash
RUN apt-get -y install nano

# install dropbox uploader
ADD dropbox_uploader.conf /dropbox_uploader.conf
#ADD .dropbox_uploader ~/.dropbox_uploader
# this did not work as token was never written to the file
#RUN echo "OAUTH_ACCESS_TOKEN=$DROPBOX_OAUTH_ACCESS_TOKEN" >> /dropbox_uploader.conf
RUN curl "https://raw.githubusercontent.com/andreafabrizi/Dropbox-Uploader/master/dropbox_uploader.sh" -o dropbox_uploader.sh
RUN chmod +x dropbox_uploader.sh

# add the backup script
ADD backup.sh /backup.sh
RUN chmod +x /backup.sh
# see: https://stackoverflow.com/a/37458519/712005
RUN chmod 0744 /backup.sh

# Add crontab file in the cron directory
ADD crontab /etc/cron.d/backup-cron
# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/backup-cron

# Apply cron job
RUN crontab /etc/cron.d/backup-cron

# Create the log file to be able to run tail
RUN touch /var/log/cron.log

# Run the command on container startup
# TODO: this causes database to not start !?
#CMD cron && tail -f /var/log/cron.log