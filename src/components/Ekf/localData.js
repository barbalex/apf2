import gql from 'graphql-tag'

export default gql`
  query Query {
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
