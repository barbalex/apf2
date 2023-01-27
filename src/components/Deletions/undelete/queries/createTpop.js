import { gql } from '@apollo/client'

import { tpop } from '../../../shared/fragments'

export default gql`
  mutation createTpopForUndelete(
    $id: UUID
    $popId: UUID
    $nr: Int
    $gemeinde: String
    $flurname: String
    $geomPoint: GeoJSON
    $radius: Int
    $hoehe: Int
    $exposition: String
    $klima: String
    $neigung: String
    $bodenTyp: String
    $bodenKalkgehalt: String
    $bodenDurchlaessigkeit: String
    $bodenHumus: String
    $bodenNaehrstoffgehalt: String
    $bodenAbtrag: String
    $wasserhaushalt: String
    $beschreibung: String
    $katasterNr: String
    $status: Int
    $statusUnklarGrund: String
    $apberRelevant: Boolean
    $apberRelevantGrund: Int
    $bekanntSeit: Int
    $eigentuemer: String
    $kontakt: String
    $nutzungszone: String
    $bewirtschafter: String
    $bewirtschaftung: String
    $ekfrequenz: UUID
    $ekfrequenzAbweichend: Boolean
    $ekfKontrolleur: UUID
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
          geomPoint: $geomPoint
          radius: $radius
          hoehe: $hoehe
          exposition: $exposition
          klima: $klima
          neigung: $neigung
          bodenTyp: $bodenTyp
          bodenKalkgehalt: $bodenKalkgehalt
          bodenDurchlaessigkeit: $bodenDurchlaessigkeit
          bodenHumus: $bodenHumus
          bodenNaehrstoffgehalt: $bodenNaehrstoffgehalt
          bodenAbtrag: $bodenAbtrag
          wasserhaushalt: $wasserhaushalt
          beschreibung: $beschreibung
          katasterNr: $katasterNr
          status: $status
          statusUnklarGrund: $statusUnklarGrund
          apberRelevant: $apberRelevant
          apberRelevantGrund: $apberRelevantGrund
          bekanntSeit: $bekanntSeit
          eigentuemer: $eigentuemer
          kontakt: $kontakt
          nutzungszone: $nutzungszone
          bewirtschafter: $bewirtschafter
          bewirtschaftung: $bewirtschaftung
          ekfrequenz: $ekfrequenz
          ekfrequenzAbweichend: $ekfrequenzAbweichend
          ekfKontrolleur: $ekfKontrolleur
          bemerkungen: $bemerkungen
          statusUnklar: $statusUnklar
        }
      }
    ) {
      tpop {
        ...TpopFields
      }
    }
  }
  ${tpop}
`
