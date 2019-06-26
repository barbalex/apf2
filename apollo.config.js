// see: https://www.apollographql.com/docs/references/apollo-config/

module.exports = {
  client: {
    service: {
      name: 'apflora',
      localSchemaFile: './schema.json',
    },
  },
}
