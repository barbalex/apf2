FROM node:slim

RUN npm install -g postgraphile@4.13.0
RUN npm install -g postgraphile-plugin-connection-filter@2.3.0
RUN npm install -g @graphile-contrib/pg-order-by-related@1.0.0
RUN npm install -g @graphile/postgis@0.2.0
RUN npm install -g postgraphile-plugin-connection-filter-postgis

COPY --chown=node:node .postgraphilerc.js .postgraphilerc.js

EXPOSE 5000

USER node

ENTRYPOINT ["postgraphile", "-n", "0.0.0.0"]