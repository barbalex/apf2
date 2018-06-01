// @flow
import gql from 'graphql-tag'
import app from 'ampersand-app'

export default (error: Object): void => {
  app.client.mutate({
    mutation: gql`
      mutation createError($error: String!) {
        createError(error: $error) @client {
          errors @client
        }
      }
    `,
    variables: { error }
  })
  console.log('listError: Error:', error) // eslint-disable-line no-console
}
