import { gql } from '@apollo/client'

export default gql`
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
`
