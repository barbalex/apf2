import gql from 'graphql-tag'

export default gql`
  mutation updateTpopmassnById($id: UUID!, $tpopId: UUID) {
    updateTpopmassnById(
      input: { id: $id, tpopmassnPatch: { tpopId: $tpopId } }
    ) {
      tpopmassn {
        id
        tpopId
      }
    }
  }
`
