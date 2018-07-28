// @flow

export default {
  Mutation: {
    setEkfAdresseId: (_, { value }, { cache }) => {
      cache.writeData({
        data: {
          ekfAdresseId: value,
        },
      })
      return null
    },
  },
}
