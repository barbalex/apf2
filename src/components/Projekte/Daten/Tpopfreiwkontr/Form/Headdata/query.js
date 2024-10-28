import { gql } from '@apollo/client'

export const query = gql`
  query TpopfreiwkontrAdressesQuery {
    allAdresses(orderBy: NAME_ASC) {
      nodes {
        value: id
        label: name
      }
    }
  }
`
