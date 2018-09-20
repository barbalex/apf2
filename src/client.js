import { ApolloClient } from 'apollo-client'
//import { createHttpLink } from 'apollo-link-http'
import { BatchHttpLink } from 'apollo-link-batch-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { withClientState } from 'apollo-link-state'
import { ApolloLink } from 'apollo-link'
import jwtDecode from 'jwt-decode'
import get from 'lodash/get'
import gql from 'graphql-tag'
import app from 'ampersand-app'

import graphQlUri from './modules/graphQlUri'
import resolvers from './store/resolvers'
import defaults from './store/defaults'

export default async idb => {
  const authLink = setContext(async (_, { headers }) => {
    const users = await idb.currentUser.toArray()
    let token = get(users, '[0].token', null)
    let tokenFromStore
    let result
    if (app.client) {
      result = await app.client.query({
        query: gql`
          query Query {
            user @client {
              token
            }
          }
        `,
      })
      tokenFromStore = get(result, 'data.user.token')
    }
    /**
     * after logging out, then logging back in
     * token in store exists, but not yet in idb
     */
    if (!token && tokenFromStore) token = tokenFromStore
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
    dataIdFromObject: object => {
      return object.id
    },
  })
  const myDefaults = await defaults(idb)
  const stateLink = withClientState({
    resolvers,
    cache,
    defaults: myDefaults,
  })
  // use httpLink _instead_ of batchHttpLink in order not to batch
  /*
  const httpLink = createHttpLink({
    uri: graphQlUri(),
  })*/
  const batchHttpLink = new BatchHttpLink({ uri: graphQlUri() })
  const client = new ApolloClient({
    link: ApolloLink.from([stateLink, authLink, batchHttpLink]),
    cache,
  })
  return client
}
