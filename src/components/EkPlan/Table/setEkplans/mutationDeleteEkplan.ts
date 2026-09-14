import { graphql } from '../../../../gql'

export const mutationDeleteEkplan = graphql(`
  mutation deleteEkplanByIdSetEkplan($id: UUID!) {
    deleteEkplanById(input: { id: $id }) {
      ekplan {
        id
      }
    }
  }
`)
