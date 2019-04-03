import gql from 'graphql-tag'

export default gql`
  query AllAdressesQuery {
    allAdresses(orderBy: NAME_ASC) {
      nodes {
        value: id
        label: name
      }
    }
  }
`
