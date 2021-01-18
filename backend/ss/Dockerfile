FROM node:lts-alpine
RUN apk add dumb-init
ENV NODE_ENV production

# Create app directory
WORKDIR /usr/src/ss

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY --chown=node:node package*.json ./

RUN npm ci --only=production
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 7000

USER node

CMD [ "dumb-init", "node", "server.js" ]