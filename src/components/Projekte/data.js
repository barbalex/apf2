import gql from 'graphql-tag'

export default gql`query MyData {
  isPrint @client
  urlQuery @client {
    projekteTabs
  }
}
`