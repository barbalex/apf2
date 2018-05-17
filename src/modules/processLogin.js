// @flow
import axios from 'axios'
import gql from 'graphql-tag'

import initiateDataFromUrl from './initiateDataFromUrl'

export default async ({
  store,
  name,
  token,
  client
}: {
  store: Object,
  name: String,
  token: String,
  client: Object
}) => {
  // TODO: remove
  store.user.name = name
  store.user.token = token
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

  await client.mutate({
    mutation: gql`
      mutation setUser($name: String, $token: String) {
        setUser(name: $name, token: $token) @client {
          name
          token
        }
      }
    `,
    variables: {
      name,
      token,
    },
  })

  initiateDataFromUrl(store)
}
