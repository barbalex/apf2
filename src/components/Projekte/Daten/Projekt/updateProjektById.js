import gql from 'graphql-tag'

export default gql`
  mutation updateProjekt($id: UUID!, $name: String) {
    updateProjektById(
      input: { id: $id, projektPatch: { id: $id, name: $name } }
    ) {
      projekt {
        id
        name
      }
    }
  }
`
