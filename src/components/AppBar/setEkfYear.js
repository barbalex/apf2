import gql from 'graphql-tag'

export default gql`
  mutation setEkfYear($value: Boolean) {
    setEkfYear(value: $value) @client {
      ekfYear @client
    }
  }
`
