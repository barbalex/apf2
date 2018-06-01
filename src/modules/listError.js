// @flow
import gql from 'graphql-tag'
import app from 'ampersand-app'

export default (error: Object): void => {
  app.client.mutate({
    mutation: gql`
      mutation setError($error: String!) {
        setError(error: $error) @client
      }
    `,
    variables: { error: error.message }
  })
  console.log('listError: Error:', error) // eslint-disable-line no-console
}
