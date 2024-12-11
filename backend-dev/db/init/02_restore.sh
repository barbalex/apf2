#!/bin/bash
set -e

echo "restoring database"
# do not declare --host db, seems to create error
pg_restore --dbname=apflora --port 5432 --username "${POSTGRES_USER}" --no-password --verbose "/sik_data/apflora.backup"
echo "database was restored"