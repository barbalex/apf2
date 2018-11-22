import gql from 'graphql-tag'

export default gql`
  query AppBarQuery {
    tree @client {
      activeNodeArray
    }
  }
`
