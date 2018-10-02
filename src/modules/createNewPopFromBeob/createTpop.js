import gql from 'graphql-tag'

export default gql`
  mutation createTpop(
    $popId: UUID
    $gemeinde: String
    $flurname: String
    $x: Int
    $y: Int
    $bekanntSeit: Int
  ) {
    createTpop(
      input: {
        tpop: {
          popId: $popId
          gemeinde: $gemeinde
          flurname: $flurname
          x: $x
          y: $y
          bekanntSeit: $bekanntSeit
        }
      }
    ) {
      tpop {
        id
        popId
        nr
        gemeinde
        flurname
        x
        y
        radius
        hoehe
        exposition
        klima
        neigung
        beschreibung
        katasterNr
        status
        statusUnklarGrund
        apberRelevant
        bekanntSeit
        eigentuemer
        kontakt
        nutzungszone
        bewirtschafter
        bewirtschaftung
        kontrollfrequenz
        kontrollfrequenzFreiwillige
        bemerkungen
        statusUnklar
      }
    }
  }
`
