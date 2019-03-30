import gql from 'graphql-tag'

export default gql`
  query ApberAdressesQuery {
    allAdresses {
      nodes {
        id
        name
      }
    }
  }
`
