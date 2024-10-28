import { gql } from '@apollo/client'

export default gql`
  query TpopfreiwkontrAdressesQuery {
    allAdresses(orderBy: NAME_ASC) {
      nodes {
        value: id
        label: name
      }
    }
  }
`
