import { gql } from '@apollo/client'

export default gql`
  mutation updateProjekt($id: UUID!, $name: String, $changedBy: String) {
    updateProjektById(
      input: {
        id: $id
        projektPatch: { id: $id, name: $name, changedBy: $changedBy }
      }
    ) {
      projekt {
        id
        name
        changedBy
      }
    }
  }
`
