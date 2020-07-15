import { gql } from '@apollo/client'

import { ap, aeTaxonomies } from '../../../shared/fragments'

export default gql`
  mutation updateApForFilter(
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
        aeTaxonomyByArtId {
          ...AeTaxonomiesFields
        }
      }
    }
  }
  ${ap}
  ${aeTaxonomies}
`
