import gql from 'graphql-tag'

export default gql`
  query AllAdressesQuery {
    allAdresses {
      nodes {
        id
        name
      }
    }
  }
`
