import gql from 'graphql-tag'

export default gql`
  mutation updatePopmassnber(
    $id: UUID!
    $popId: UUID
    $jahr: Int
    $beurteilung: Int
    $bemerkungen: String
    $changedBy: String
  ) {
    updatePopmassnberById(
      input: {
        id: $id
        popmassnberPatch: {
          id: $id
          popId: $popId
          jahr: $jahr
          beurteilung: $beurteilung
          bemerkungen: $bemerkungen
          changedBy: $changedBy
        }
      }
    ) {
      popmassnber {
        id
        popId
        jahr
        beurteilung
        tpopmassnErfbeurtWerteByBeurteilung {
          id
          text
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
