import { graphql } from '../../../../gql/index.ts'

export const mutationDeleteEkplan = graphql(`
  mutation deleteEkplanByIdCellForYearMenu($id: UUID!) {
    deleteEkplanById(input: { id: $id }) {
      deletedEkplanId
    }
  }
`)
