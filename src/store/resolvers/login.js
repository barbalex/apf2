// @flow

export default {
  Mutation: {
    setLoginInStore: (_, { token, username }, { cache }) => {
      const login = { token, username, __typename: 'Login' }
      cache.writeData({ data: { login } })
      return null
    },
  },
}
