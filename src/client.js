import { ApolloClient } from 'apollo-client'
//import { createHttpLink } from 'apollo-link-http'
import { BatchHttpLink } from 'apollo-link-batch-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink } from 'apollo-link'
import jwtDecode from 'jwt-decode'

import graphQlUri from './modules/graphQlUri'

export default async ({ idb, mobxStore }) => {
  const authLink = setContext(async (_, { headers }) => {
    const { token } = mobxStore.user
    if (token) {
      const tokenDecoded = jwtDecode(token)
      // for unknown reason, date.now returns three more after comma
      // numbers than the exp date contains
      const tokenIsValid = tokenDecoded.exp > Date.now() / 1000
      if (tokenIsValid) {
        return {
          headers: {
            ...headers,
            authorization: `Bearer ${token}`,
          },
        }
      }
    }
    return { headers }
  })

  const cache = new InMemoryCache({
    /*dataIdFromObject: object => {
      return object.id
    },*/
  })
  // use httpLink _instead_ of batchHttpLink in order not to batch
  /*
  const httpLink = createHttpLink({
    uri: graphQlUri(),
  })*/
  const batchHttpLink = new BatchHttpLink({ uri: graphQlUri() })
  const client = new ApolloClient({
    link: ApolloLink.from([authLink, batchHttpLink]),
    cache,
    defaultOptions: { fetchPolicy: 'cache-and-network' },
    //defaultOptions: { fetchPolicy: 'cache-first' },
  })
  return client
}
