// see: https://www.apollographql.com/docs/references/apollo-config/

module.exports = {
  client: {
    service: {
      name: 'apflora',
      // Use remote endpoint for schema introspection
      url: 'http://localhost:5000/graphql',
    },
  },
}
