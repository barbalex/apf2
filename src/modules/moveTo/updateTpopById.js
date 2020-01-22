import gql from 'graphql-tag'

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
