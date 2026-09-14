import { graphql } from '../../../../gql'

export const mutationDeleteEkplan = graphql(`
  mutation deleteEkplanByIdCellForYearMenu($id: UUID!) {
    deleteEkplanById(input: { id: $id }) {
      deletedEkplanId
    }
  }
`)
