// @flow
export default {
  Mutation: {
    setUser: (_, { name, token }, { cache }) => {
      console.log('resolver user: token:', token)
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
