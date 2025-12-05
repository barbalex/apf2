# beware when upgrading: need to re-create backups!
# 2025.08.21: live version is 14
# 2025.12.05: live version is 17
FROM postgis/postgis:17-3.5

# mount SQL files directly into the Postgres containers’ initialization directory
COPY ./init/ /docker-entrypoint-initdb.d/
# enable to seed data
COPY ./apflora.backup /sik_data/apflora.backup

RUN chmod +x /docker-entrypoint-initdb.d/02_restore.sh

# Install some helpful stuff
RUN apt-get -qq update
# log less: https://askubuntu.com/a/668859
RUN apt-get install -y -qq curl
RUN apt-get install -y -qq bash
RUN apt-get install -y -qq nano
RUN apt-get install -y -qq rclone
RUN apt-get install -y -qq dos2unix

# add the backup script
ADD backup.sh /backup.sh
# Change line ending format to LF
RUN dos2unix /backup.sh
RUN chmod +x /backup.sh
# see: https://stackoverflow.com/a/37458519/712005
RUN chmod 0744 /backup.sh