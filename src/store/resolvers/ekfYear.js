// @flow

export default {
  Mutation: {
    setEkfYear: (_, { value }, { cache }) => {
      cache.writeData({
        data: {
          ekfYear: value,
        },
      })
      return null
    },
  },
}
