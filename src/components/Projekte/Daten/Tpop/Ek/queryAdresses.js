import { gql } from '@apollo/client'

export default gql`
  query TpopfeldkontrAdressesQueryForEk {
    allAdresses(orderBy: NAME_ASC, filter: { usersByAdresseIdExist: true }) {
      nodes {
        value: id
        label: name
      }
    }
  }
`
