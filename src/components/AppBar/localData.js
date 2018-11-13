import gql from 'graphql-tag'

export default gql`
  query AppBarQuery {
    view @client
    ekfYear @client
    user @client {
      name
      token
    }
    urlQuery @client {
      projekteTabs
    }
    tree @client {
      activeNodeArray
    }
  }
`
