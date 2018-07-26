// @flow

export default {
  Mutation: {
    setView: (_, { value }, { cache }) => {
      cache.writeData({
        data: {
          view: value,
        },
      })
      return null
    },
  },
}
