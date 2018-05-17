// @flow
export default {
  Mutation: {
    setUser: (_, { name, token }, { cache }) => {
      console.log('user resolver:', { name, token })
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
