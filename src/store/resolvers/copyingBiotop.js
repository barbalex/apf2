// @flow

export default {
  Mutation: {
    setCopyingBiotop: (_, { id, label }, { cache }) => {
      cache.writeData({ data: {
          copyingBiotop: {
            id,
            label,
            __typename: 'CopyingBiotop'
          }
        }
      })
      return null
    },
  },
}
