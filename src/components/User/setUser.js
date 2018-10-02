import gql from 'graphql-tag'

export default gql`
  mutation setUser($name: String, $token: String) {
    setUser(name: $name, token: $token) @client {
      name
      token
    }
  }
`
