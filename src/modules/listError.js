// @flow
import gql from 'graphql-tag'
import app from 'ampersand-app'

export default (error: Object): void => {
  app.client.mutate({
    mutation: gql`
      mutation addError($error: String!) {
        addError(error: $error) @client {
          errors @client
        }
      }
    `,
    variables: { error: error.message }
  })
  console.log('listError: Error:', error.message) // eslint-disable-line no-console
}
