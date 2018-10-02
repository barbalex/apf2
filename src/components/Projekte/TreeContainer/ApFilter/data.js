import gql from 'graphql-tag'

export default gql`
  query Query {
    tree @client {
      name
      apFilter
      activeNodeArray
      openNodes
    }
    tree2 @client {
      name
      apFilter
      activeNodeArray
      openNodes
    }
  }
`
