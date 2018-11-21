import gql from 'graphql-tag'

export default gql`
  query AppBarQuery {
    urlQuery @client {
      projekteTabs
    }
    tree @client {
      activeNodeArray
    }
  }
`
