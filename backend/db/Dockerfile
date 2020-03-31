FROM postgis/postgis:12-master

COPY ./init/ /docker-entrypoint-initdb.d/
COPY ./apflora.backup /sik_data/apflora.backup

RUN chmod +x /docker-entrypoint-initdb.d/02_restore.sh