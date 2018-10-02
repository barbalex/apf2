import gql from 'graphql-tag'

export default gql`
  query Query {
    moving @client {
      table
      id
      label
    }
  }
`
