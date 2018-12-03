import gql from 'graphql-tag'

export default gql`
  mutation updateZiel(
    $id: UUID!
    $apId: UUID
    $typ: Int
    $jahr: Int
    $bezeichnung: String
    $changedBy: String
  ) {
    updateZielById(
      input: {
        id: $id
        zielPatch: {
          id: $id
          apId: $apId
          typ: $typ
          jahr: $jahr
          bezeichnung: $bezeichnung
          changedBy: $changedBy
        }
      }
    ) {
      ziel {
        id
        apId
        typ
        jahr
        bezeichnung
        changedBy
      }
    }
  }
`
