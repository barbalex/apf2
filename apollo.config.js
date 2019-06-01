//const secrets = require('./secrets.json')
//const url = require('./src/modules/graphQlUri')

module.exports = {
  client: {
    service: {
      url: process.env.GRAPHQL_URL,
      // optional headers
      //headers: {
      //  'X-Hasura-Access-Key': secrets.accessKey,
      //},
    },
  },
}
