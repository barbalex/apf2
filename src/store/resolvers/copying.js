// @flow
export default {
  Mutation: {
    setCopying: (_, { table, id, label, withNextLevel }, { cache }) => {
      cache.writeData({
        data: {
          copying: {
            table,
            id,
            label,
            withNextLevel,
            __typename: 'Copying'
          }
        }
      })
      return null
    },
  },
}
