import { gql } from '@apollo/client'

export const mutationDeleteEkplan = gql`
  mutation deleteEkplanByIdCellForYearMenu($id: UUID!) {
    deleteEkplanById(input: { id: $id }) {
      deletedEkplanId
    }
  }
`
