import gql from 'graphql-tag'

export default gql`
  query AppBarQuery {
    view @client
    ekfYear @client
    urlQuery @client {
      projekteTabs
    }
    tree @client {
      activeNodeArray
    }
  }
`
