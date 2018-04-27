// @flow
import gql from 'graphql-tag'

export default gql`
  mutation setLoginInStore($token: String!, $username: String!) {
    setLoginInStore(token: $token, username: $username) @client {
      token
      username
    }
  }
`
