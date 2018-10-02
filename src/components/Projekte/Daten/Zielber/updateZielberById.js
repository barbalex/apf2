import gql from 'graphql-tag'

export default gql`
  mutation updateZielber(
    $id: UUID!
    $zielId: UUID
    $jahr: Int
    $erreichung: String
    $bemerkungen: String
  ) {
    updateZielberById(
      input: {
        id: $id
        zielberPatch: {
          id: $id
          zielId: $zielId
          jahr: $jahr
          erreichung: $erreichung
          bemerkungen: $bemerkungen
        }
      }
    ) {
      zielber {
        id
        zielId
        jahr
        erreichung
        bemerkungen
        zielByZielId {
          id
          apId
        }
      }
    }
  }
`
