import gql from 'graphql-tag'

export default gql`
  mutation setView($value: String) {
    setView(value: $value) @client {
      view @client
    }
  }
`
