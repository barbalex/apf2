import { gql } from '@apollo/client'

import {
  popStatusWerte,
  tpop,
  tpopApberrelevantGrundWerte,
} from '../../../shared/fragments'

export default gql`
  mutation updateTpop(
    $id: UUID!
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
    $ekfrequenzStartjahr: Int
    $bemerkungen: String
    $statusUnklar: Boolean
    $changedBy: String
  ) {
    updateTpopById(
      input: {
        id: $id
        tpopPatch: {
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
          ekfrequenzStartjahr: $ekfrequenzStartjahr
          bemerkungen: $bemerkungen
          statusUnklar: $statusUnklar
          changedBy: $changedBy
        }
      }
    ) {
      tpop {
        ...TpopFields
        popStatusWerteByStatus {
          ...PopStatusWerteFields
        }
        tpopApberrelevantGrundWerteByApberRelevantGrund {
          ...TpopApberrelevantGrundWerteFields
        }
        popByPopId {
          id
          apId
        }
      }
    }
  }
  ${popStatusWerte}
  ${tpop}
  ${tpopApberrelevantGrundWerte}
`
