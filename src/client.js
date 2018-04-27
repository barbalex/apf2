import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { withClientState } from 'apollo-link-state'
import { ApolloLink } from 'apollo-link'
import get from 'lodash/get'
import jwtDecode from 'jwt-decode'

import graphQlUri from './modules/graphQlUri'
import resolvers from './gqlStore/resolvers'
import defaults from './gqlStore/defaults'
import setLoginMutation from './modules/loginMutation'

export default db => {
  const authMiddleware = setContext(async () => {
    let users
    users = await db.users.toArray()
    const token = get(users, '[0].token')
    if (token) {
      const tokenDecoded = jwtDecode(token)
      // for unknown reason, date.now returns three more after comma
      // numbers than the exp date contains
      const tokenIsValid = tokenDecoded.exp > Date.now() / 1000
      if (tokenIsValid) {
        return {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      } else {
        // token is not valid any more > remove it
        db.users.clear()
        client.mutate({
          mutation: setLoginMutation,
          variables: {
            username: 'Login abgelaufen',
            token: '',
          },
        })
        setTimeout(
          () =>
            client.mutate({
              mutation: setLoginMutation,
              variables: {
                username: '',
                token: '',
              },
            }),
          10000
        )
      }
      // TODO: tell user "Ihre Anmeldung ist abgelaufen"
    }
  })
  const cache = new InMemoryCache()
  const stateLink = withClientState({
    resolvers,
    cache,
    defaults,
  })
  const httpLink = createHttpLink({
    uri: graphQlUri(),
  })
  const client = new ApolloClient({
    link: ApolloLink.from([stateLink, authMiddleware, httpLink]),
    cache,
  })
  return client
}
