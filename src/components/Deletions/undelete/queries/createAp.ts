import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { ap } from '../../../shared/fragments.ts'

export default dynamicGql`
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
