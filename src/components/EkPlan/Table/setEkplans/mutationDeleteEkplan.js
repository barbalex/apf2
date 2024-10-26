import { gql } from '@apollo/client'

export const mutationDeleteEkplan = gql`
  mutation deleteEkplanByIdSetEkplan($id: UUID!) {
    deleteEkplanById(input: { id: $id }) {
      ekplan {
        id
      }
    }
  }
`
