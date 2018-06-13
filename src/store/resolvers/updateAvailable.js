// @flow

export default {
  Mutation: {
    setUpdateAvailable: (_, { value }, { cache }) => {
      console.log('resolvers: updateAvailable, value:', value)
      cache.writeData({
        data: {
          updateAvailable: value
        }
      })
      return null
    },
  },
}
