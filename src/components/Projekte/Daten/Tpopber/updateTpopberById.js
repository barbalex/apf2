import gql from 'graphql-tag'

export default gql`
  mutation updateTpopber(
    $id: UUID!
    $tpopId: UUID
    $jahr: Int
    $entwicklung: Int
    $bemerkungen: String
    $changedBy: String
  ) {
    updateTpopberById(
      input: {
        id: $id
        tpopberPatch: {
          id: $id
          tpopId: $tpopId
          jahr: $jahr
          entwicklung: $entwicklung
          bemerkungen: $bemerkungen
          changedBy: $changedBy
        }
      }
    ) {
      tpopber {
        id
        tpopId
        jahr
        entwicklung
        tpopEntwicklungWerteByEntwicklung {
          id
          code
          text
          sort
        }
        bemerkungen
        changedBy
        tpopByTpopId {
          id
          popByPopId {
            id
            apId
          }
        }
      }
    }
  }
`
