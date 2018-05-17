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
  console.log('processLogin:', { name, token, store })
  store.user.name = name
  store.user.token = token
  console.log('processLogin after setting store.user:', { storeUserToken: store.user.token, storeUserName: store.user.name })
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
