import gql from 'graphql-tag'

export default gql`
  query ApAdressesQuery {
    allAdresses {
      nodes {
        id
        name
      }
    }
  }
`
