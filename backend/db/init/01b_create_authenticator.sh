#!/bin/bash
# psql does not expand environment variables in .sql init files,
# so the authenticator role with its password has to be created
# from a shell script
set -e
psql -U postgres -d postgres -v ON_ERROR_STOP=1 -c \
  "CREATE ROLE authenticator WITH LOGIN PASSWORD '${AUTHENTICATOR_PASSWORD}' noinherit;"
