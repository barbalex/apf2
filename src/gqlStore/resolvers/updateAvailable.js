// @flow

export default {
  Mutation: {
    setUpdateAvailable: (_, { value }, { cache }) => {
      cache.writeData({
        data: {
          updateAvailable: value
        }
      })
      return null
    },
  },
}
