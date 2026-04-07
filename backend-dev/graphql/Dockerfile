FROM node:slim

RUN apt-get update && apt-get install -y dumb-init


# in v5: v5
RUN npm install -g postgraphile@4.14.1
# in v5: preset i.e. extends in graphile.config.ts
RUN npm install -g postgraphile-plugin-connection-filter@2.3.0
# in v5: preset i.e. extends in graphile.config.ts
RUN npm install -g @graphile-contrib/pg-order-by-related@1.0.0
# in v5: preset i.e. extends in graphile.config.ts
# but: not yet ported, see: https://postgraphile.org/postgraphile/5/migrating-from-v4#makev4preset
# https://github.com/graphile/postgis/issues/58
RUN npm install -g @graphile/postgis@0.2.0
# in v5: 
# https://github.com/graphile-contrib/postgraphile-plugin-connection-filter-postgis/issues/36
RUN npm install -g postgraphile-plugin-connection-filter-postgis

# need to add a graphile.config.js file for the presets
COPY --chown=node:node .postgraphilerc.js .postgraphilerc.js

# enable exporting schema.json, only in dev
# WORKDIR /my_data
# RUN chown -R node:node /my_data

EXPOSE 5000

USER node

ENTRYPOINT ["dumb-init", "postgraphile", "-n", "0.0.0.0"]