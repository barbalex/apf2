import gql from 'graphql-tag'

export default gql`
  mutation updateApberuebersicht(
    $id: UUID!
    $projId: UUID
    $jahr: Int
    $bemerkungen: String
    $changedBy: String
  ) {
    updateApberuebersichtById(
      input: {
        id: $id
        apberuebersichtPatch: {
          id: $id
          projId: $projId
          jahr: $jahr
          bemerkungen: $bemerkungen
          changedBy: $changedBy
        }
      }
    ) {
      apberuebersicht {
        id
        projId
        jahr
        bemerkungen
        changedBy
      }
    }
  }
`
