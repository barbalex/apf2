import gql from 'graphql-tag'

export default gql`
  mutation setAssigningBeob($value: Boolean) {
    setAssigningBeob(value: $value) @client {
      assigningBeob @client
    }
  }
`
