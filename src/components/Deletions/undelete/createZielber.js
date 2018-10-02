import gql from 'graphql-tag'

export default gql`
  mutation createZielber(
    $id: UUID
    $zielId: UUID
    $jahr: Int
    $erreichung: String
    $bemerkungen: String
  ) {
    createZielber(
      input: {
        zielber: {
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
      }
    }
  }
`
