import { graphql } from '../../gql'

export const updateTpopById = graphql(`
  mutation updateTpopByIdForMoveTo($id: UUID!, $popId: UUID) {
    updateTpopById(input: { id: $id, tpopPatch: { popId: $popId } }) {
      tpop {
        id
        popId
      }
    }
  }
`)
