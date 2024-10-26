import { gql } from '@apollo/client'

export const queryAdresses = gql`
  query ApFilterAdressesQuery {
    allAdresses(orderBy: NAME_ASC) {
      nodes {
        value: id
        label: name
      }
    }
  }
`
