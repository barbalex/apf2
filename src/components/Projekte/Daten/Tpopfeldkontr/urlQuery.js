import gql from 'graphql-tag'

export default gql`
  query Query {
    urlQuery @client {
      projekteTabs
      feldkontrTab
    }
  }
`
