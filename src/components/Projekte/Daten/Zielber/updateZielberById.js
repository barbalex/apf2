import gql from 'graphql-tag'

export default gql`
  mutation updateZielber(
    $id: UUID!
    $zielId: UUID
    $jahr: Int
    $erreichung: String
    $bemerkungen: String
    $changedBy: String
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
          changedBy: $changedBy
        }
      }
    ) {
      zielber {
        id
        zielId
        jahr
        erreichung
        bemerkungen
        changedBy
        zielByZielId {
          id
          apId
        }
      }
    }
  }
`
