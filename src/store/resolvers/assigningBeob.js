// @flow

export default {
  Mutation: {
    setAssigningBeob: (_, { value }, { cache }) => {
      cache.writeData({
        data: {
          assigningBeob: value
        }
      })
      return null
    },
  },
}
