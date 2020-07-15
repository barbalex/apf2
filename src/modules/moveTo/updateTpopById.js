import { gql } from '@apollo/client'

export default gql`
  mutation updateTpopByIdForMoveTo($id: UUID!, $popId: UUID) {
    updateTpopById(input: { id: $id, tpopPatch: { popId: $popId } }) {
      tpop {
        id
        popId
      }
    }
  }
`
