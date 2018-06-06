// @flow
export default {
  Mutation: {
    setMoving: (_, { table, id, label }, { cache }) => {
      cache.writeData({
        data: {
          moving: {
            table,
            id,
            label,
            __typename: 'Moving'
          }
        }
      })
      return null
    },
  },
}
