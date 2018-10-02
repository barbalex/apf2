import gql from 'graphql-tag'

export default gql`
  mutation createTpop(
    $id: UUID
    $popId: UUID
    $nr: Int
    $gemeinde: String
    $flurname: String
    $x: Int
    $y: Int
    $radius: Int
    $hoehe: Int
    $exposition: String
    $klima: String
    $neigung: String
    $beschreibung: String
    $katasterNr: String
    $status: Int
    $statusUnklarGrund: String
    $apberRelevant: Int
    $bekanntSeit: Int
    $eigentuemer: String
    $kontakt: String
    $nutzungszone: String
    $bewirtschafter: String
    $bewirtschaftung: String
    $kontrollfrequenz: Int
    $bewirtschaftung: String
    $bemerkungen: String
    $statusUnklar: Boolean
  ) {
    createTpop(
      input: {
        tpop: {
          id: $id
          popId: $popId
          nr: $nr
          gemeinde: $gemeinde
          flurname: $flurname
          x: $x
          y: $y
          radius: $radius
          hoehe: $hoehe
          exposition: $exposition
          klima: $klima
          neigung: $neigung
          beschreibung: $beschreibung
          katasterNr: $katasterNr
          status: $status
          statusUnklarGrund: $statusUnklarGrund
          apberRelevant: $apberRelevant
          bekanntSeit: $bekanntSeit
          eigentuemer: $eigentuemer
          kontakt: $kontakt
          nutzungszone: $nutzungszone
          bewirtschafter: $bewirtschafter
          bewirtschaftung: $bewirtschaftung
          bewirtschaftung: $bewirtschaftung
          kontrollfrequenz: $kontrollfrequenz
          bemerkungen: $bemerkungen
          statusUnklar: $statusUnklar
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
