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

# install rclone
# WARNING: THIS PREVENTED THE GRAPHQL SERVER FROM RUNNING CORRECTLY!
# https://rclone.org/install/#install-with-docker
# https://hub.docker.com/r/rclone/rclone/dockerfile
# https://github.com/bcardiff/docker-rclone/blob/master/Dockerfile
#FROM alpine:3.9

#LABEL maintainer="Brian J. Cardiff <bcardiff@gmail.com>"

#ARG RCLONE_VERSION=current
#ARG ARCH=amd64
#ENV SYNC_SRC=
#ENV SYNC_DEST=
#ENV SYNC_OPTS=-v
#ENV RCLONE_OPTS="--config /config/rclone.conf"
#ENV CRON=
#ENV CRON_ABORT=
#ENV FORCE_SYNC=
#ENV CHECK_URL=
#ENV TZ=

#RUN apk -U add ca-certificates fuse wget dcron tzdata \
#&& rm -rf /var/cache/apk/*

#RUN URL=http://downloads.rclone.org/${RCLONE_VERSION}/rclone-${RCLONE_VERSION}-linux-${ARCH}.zip ; \
#  URL=${URL/\/current/} ; \
#  cd /tmp \
#  && wget -q $URL \
#  && unzip /tmp/rclone-${RCLONE_VERSION}-linux-${ARCH}.zip \
#  && mv /tmp/rclone-*-linux-${ARCH}/rclone /usr/bin \
#  && rm -r /tmp/rclone*

#COPY entrypoint.sh /
#COPY sync.sh /
#COPY sync-abort.sh /
#RUN chmod +x entrypoint.sh
#RUN chmod +x sync.sh
#RUN chmod +x sync-abort.sh

#VOLUME ["/config"]

#ENTRYPOINT ["/entrypoint.sh"]

#CMD [""]

# install dropbox uploader
ADD dropbox_uploader.conf /dropbox_uploader.conf
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