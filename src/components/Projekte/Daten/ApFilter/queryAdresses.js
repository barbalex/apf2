import gql from 'graphql-tag'

export default gql`
  query ApFilterAdressesQuery {
    allAdresses(orderBy: NAME_ASC) {
      nodes {
        value: id
        label: name
      }
    }
  }
`
