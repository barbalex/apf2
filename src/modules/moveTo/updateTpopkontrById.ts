import { graphql } from '../../gql'

export const updateTpopkontrById= graphql(`
  mutation updateTpopkontrById($id: UUID!, $tpopId: UUID) {
    updateTpopkontrById(
      input: { id: $id, tpopkontrPatch: { tpopId: $tpopId } }
    ) {
      tpopkontr {
        id
        tpopId
      }
    }
  }
`)
