import gql from 'graphql-tag'

import { ap, adresse } from '../../../shared/fragments'

export default gql`
  mutation updateAp(
    $id: UUID!
    $bearbeitung: Int
    $startJahr: Int
    $umsetzung: Int
    $artId: UUID
    $bearbeiter: UUID
    $ekfBeobachtungszeitpunkt: String
    $projId: UUID
    $changedBy: String
  ) {
    updateApById(
      input: {
        id: $id
        apPatch: {
          id: $id
          bearbeitung: $bearbeitung
          startJahr: $startJahr
          umsetzung: $umsetzung
          artId: $artId
          bearbeiter: $bearbeiter
          ekfBeobachtungszeitpunkt: $ekfBeobachtungszeitpunkt
          projId: $projId
          changedBy: $changedBy
        }
      }
    ) {
      ap {
        ...ApFields
        adresseByBearbeiter {
          ...AdresseFields
        }
        aeEigenschaftenByArtId {
          id
          artname
          artwert
        }
      }
    }
  }
  ${adresse}
  ${ap}
`
