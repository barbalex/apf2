import gql from 'graphql-tag'

export default gql`
  query Query {
    tree @client {
      activeNodeArray
    }
  }
`
