#!/bin/bash
# psql does not expand environment variables in .sql init files,
# so the jwt secret has to be set from a shell script
set -e
psql -U postgres -d apflora -v ON_ERROR_STOP=1 -c \
  "ALTER DATABASE apflora SET app.jwt_secret TO '${JWT_SECRET}';"
