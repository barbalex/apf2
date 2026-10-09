import { graphql } from '../../../../gql/index.ts'

export const mutationDeleteEkplan = graphql(`
  mutation deleteEkplanByIdSetEkplan($id: UUID!) {
    deleteEkplanById(input: { id: $id }) {
      ekplan {
        id
      }
    }
  }
`)
