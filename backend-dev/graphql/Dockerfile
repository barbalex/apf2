FROM node:slim

RUN apt-get update && apt-get install -y dumb-init

RUN npm install -g postgraphile
RUN npm install -g postgraphile-plugin-connection-filter
RUN npm install -g @graphile-contrib/pg-order-by-related
RUN npm install -g @graphile/postgis
RUN npm install -g postgraphile-plugin-connection-filter-postgis

COPY --chown=node:node .postgraphilerc.js .postgraphilerc.js

# enable exporting schema.json, only in dev
WORKDIR /my_data
RUN chown -R node:node /my_data

EXPOSE 5000

USER node

ENTRYPOINT ["dumb-init", "postgraphile", "-n", "0.0.0.0"]