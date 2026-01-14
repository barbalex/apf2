import { gql } from '@apollo/client'

export const query = gql`
  query TpopfreiwkontrAdressesFilterQuery {
    allAdresses(orderBy: NAME_ASC) {
      nodes {
        value: id
        label: name
      }
    }
  }
`
