//const secrets = require('./secrets.json')
//const url = require('./src/modules/graphQlUri')

module.exports = {
  client: {
    service: {
      url: 'https://apflora.ch/graphql',
      // optional headers
      //headers: {
      //  'X-Hasura-Access-Key': secrets.accessKey,
      //},
    },
  },
}
