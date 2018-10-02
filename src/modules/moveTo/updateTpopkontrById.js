import gql from 'graphql-tag'

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
