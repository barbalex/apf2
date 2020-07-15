import { gql } from '@apollo/client'

export default gql`
  query ApberAdressesQuery {
    allAdresses(orderBy: NAME_ASC) {
      nodes {
        value: id
        label: name
      }
    }
  }
`
