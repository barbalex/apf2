// @flow
import gql from 'graphql-tag'

import initiateDataFromUrl from './initiateDataFromUrl'

export default async ({
  store,
  name,
  token,
  client,
}: {
  store: Object,
  name: String,
  token: String,
  client: Object,
}) => {
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
