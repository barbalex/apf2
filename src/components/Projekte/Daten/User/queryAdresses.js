import { gql } from '@apollo/client'

export default gql`
  query AllAdressesQuery($id: UUID!) {
    allAdresses(
      orderBy: NAME_ASC
      filter: {
        or: [
          { usersByAdresseIdExist: false }
          { usersByAdresseId: { every: { id: { equalTo: $id } } } }
        ]
      }
    ) {
      nodes {
        value: id
        label: name
      }
    }
  }
`
