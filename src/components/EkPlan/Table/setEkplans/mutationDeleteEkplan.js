import { gql } from '@apollo/client'

export default gql`
  mutation deleteEkplanByIdSetEkplan($id: UUID!) {
    deleteEkplanById(input: { id: $id }) {
      ekplan {
        id
      }
    }
  }
`
