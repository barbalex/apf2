// @flow
export default {
  Mutation: {
    setUser: (_, { name, token }, { cache }) => {
      cache.writeData({
        data: {
          user: {
            name,
            token,
            __typename: 'User'
          }
        }
      })
      return null
    },
  },
}
