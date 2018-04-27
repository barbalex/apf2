import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { withClientState } from 'apollo-link-state'
import { ApolloLink } from 'apollo-link'
import jwtDecode from 'jwt-decode'
import get from 'lodash/get'

import graphQlUri from './modules/graphQlUri'
import resolvers from './gqlStore/resolvers'
import defaults from './gqlStore/defaults'

export default store => {
  const authMiddleware = setContext(async () => {
    const token = get(store, 'user.token')
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
      }
    }
  })
  const cache = new InMemoryCache({ dataIdFromObject: object => object.id })
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
