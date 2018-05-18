// @flow
export default {
  Mutation: {
    setStoreInitated: (_, { value }, { cache }) => {
      cache.writeData({
        data: {
          storeInitated: value
        } 
      })
      return null
    },
  },
}
