import { gql } from '@apollo/client'

export default gql`
  mutation deleteEkplanByIdCellForYearMenu($id: UUID!) {
    deleteEkplanById(input: { id: $id }) {
      deletedEkplanId
    }
  }
`
