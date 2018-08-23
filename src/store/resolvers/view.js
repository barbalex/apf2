// @flow

export default {
  Mutation: {
    setView: (_, { value }, { cache }) => {
      console.log('store, resolvers, setView, value:', value)
      cache.writeData({
        data: {
          view: value,
        },
      })
      return null
    },
  },
}
