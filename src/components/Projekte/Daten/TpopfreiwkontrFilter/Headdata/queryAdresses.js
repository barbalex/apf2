import { gql } from '@apollo/client'

export default gql`
  query TpopfreiwkontrAdressesFilterQuery {
    allAdresses(orderBy: NAME_ASC) {
      nodes {
        value: id
        label: name
      }
    }
  }
`
