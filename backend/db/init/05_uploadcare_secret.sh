#!/bin/bash
# psql does not expand environment variables in .sql init files,
# so the uploadcare secret has to be set from a shell script
set -e
psql -U postgres -d apflora -v ON_ERROR_STOP=1 -c \
  "ALTER DATABASE apflora SET app.uploadcare_secret TO '${UPLOADCARE_SECRET_KEY}';"
