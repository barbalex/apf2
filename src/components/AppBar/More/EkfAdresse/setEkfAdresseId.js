import gql from 'graphql-tag'

export default gql`mutation setEkfAdresseId($value: String) {
  setEkfAdresseId(value: $value) @client {
    ekfAdresseId @client
  }
}`
