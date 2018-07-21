// @flow

export default {
  Mutation: {
    setIsPrint: (_, { value }, { cache }) => {
      console.log('resolvers: isPrint:', value)
      cache.writeData({
        data: {
          isPrint: value,
        },
      })
      return null
    },
  },
}
