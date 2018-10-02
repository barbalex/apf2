import gql from 'graphql-tag'

export default gql`
  mutation setIsPrint($value: Boolean) {
    setIsPrint(value: $value) @client {
      isPrint @client
    }
  }
`
