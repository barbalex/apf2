import gql from 'graphql-tag'

export default gql`
  query Query {
    tree @client {
      activeNodeArray
    }
    tree2 @client {
      activeNodeArray
    }
  }
`
