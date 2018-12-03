import gql from 'graphql-tag'

export default gql`
  mutation updatePopber(
    $id: UUID!
    $popId: UUID
    $jahr: Int
    $entwicklung: Int
    $bemerkungen: String
    $changedBy: String
  ) {
    updatePopberById(
      input: {
        id: $id
        popberPatch: {
          id: $id
          popId: $popId
          jahr: $jahr
          entwicklung: $entwicklung
          bemerkungen: $bemerkungen
          changedBy: $changedBy
        }
      }
    ) {
      popber {
        id
        popId
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
        popByPopId {
          id
          apId
        }
      }
    }
  }
`
