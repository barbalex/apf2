import gql from 'graphql-tag'

export default gql`
  mutation updateZiel(
    $id: UUID!
    $apId: UUID
    $typ: Int
    $jahr: Int
    $bezeichnung: String
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
        }
      }
    ) {
      ziel {
        id
        apId
        typ
        jahr
        bezeichnung
      }
    }
  }
`
