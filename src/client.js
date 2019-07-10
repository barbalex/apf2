import { ApolloClient } from 'apollo-client'
//import { createHttpLink } from "apollo-link-http"
import { BatchHttpLink } from 'apollo-link-batch-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory'
import { ApolloLink } from 'apollo-link'
import { onError } from 'apollo-link-error'
import jwtDecode from 'jwt-decode'

import graphQlUri from './modules/graphQlUri'

export default ({ idb, store }) => {
  const { enqueNotification } = store
  const authLink = setContext((_, { headers }) => {
    const { token } = store.user
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

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) => {
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        )
        return enqueNotification({
          message: `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          options: {
            variant: 'error',
          },
        })
      })
    if (networkError) {
      console.log(`[Network error]: ${networkError}`)
      enqueNotification({
        message: `[Network error]: ${networkError}`,
        options: {
          variant: 'error',
        },
      })
    }
  })

  const cache = new InMemoryCache({
    dataIdFromObject: object => {
      if (object.id && isNaN(object.id)) return object.id
      return defaultDataIdFromObject(object)
    },
  })
  // use httpLink _instead_ of batchHttpLink to _not_ batch

  /*const httpLink = createHttpLink({
    uri: graphQlUri(),
  })*/
  const batchHttpLink = new BatchHttpLink({ uri: graphQlUri() })
  const client = new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, batchHttpLink]),
    cache,
    defaultOptions: { fetchPolicy: 'cache-and-network' },
  })
  return client
}
