import gql from 'graphql-tag'

export default gql`
  query Query {
    isPrint @client
    ekfYear @client
    ekfAdresseId @client
    urlQuery @client {
      projekteTabs
    }
    tree @client {
      name
      activeNodeArray
      openNodes
    }
  }
`
