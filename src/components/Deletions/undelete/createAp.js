import { gql } from '@apollo/client'

import { ap } from '../../shared/fragments'

export default gql`
  mutation createApForUndelete(
    $id: UUID
    $projId: UUID
    $bearbeitung: Int
    $startJahr: Int
    $umsetzung: Int
    $artId: UUID
    $bearbeiter: UUID
  ) {
    createAp(
      input: {
        ap: {
          id: $id
          projId: $projId
          bearbeitung: $bearbeitung
          startJahr: $startJahr
          umsetzung: $umsetzung
          artId: $artId
          bearbeiter: $bearbeiter
        }
      }
    ) {
      ap {
        ...ApFields
      }
    }
  }
  ${ap}
`
