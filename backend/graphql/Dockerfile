FROM node:slim
# RUN apk add dumb-init
RUN apt-get update && apt-get install -y dumb-init

ENV NODE_ENV=production

RUN npm install -g postgraphile@4.14.1
RUN npm install -g postgraphile-plugin-connection-filter@2.3.0
RUN npm install -g @graphile-contrib/pg-order-by-related@1.0.0
RUN npm install -g @graphile/postgis@0.2.0
RUN npm install -g postgraphile-plugin-connection-filter-postgis@1.0.0-alpha.6

COPY --chown=node:node .postgraphilerc.js .postgraphilerc.js

EXPOSE 5000

USER node

ENTRYPOINT ["dumb-init", "postgraphile", "-n", "0.0.0.0"]