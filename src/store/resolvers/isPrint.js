// @flow

export default {
  Mutation: {
    setIsPrint: (_, { value }, { cache }) => {
      cache.writeData({
        data: {
          isPrint: value,
        },
      })
      return null
    },
  },
}
