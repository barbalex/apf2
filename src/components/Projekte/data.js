import gql from 'graphql-tag'

export default gql`
  query MyData {
    urlQuery @client {
      projekteTabs
    }
  }
`
