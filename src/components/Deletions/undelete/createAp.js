import gql from 'graphql-tag'

import { ap } from '../../shared/fragments'

export default gql`
  mutation createAp(
    $id: UUID
    $projId: UUID
    $bearbeitung: Int
    $startJahr: Int
    $umsetzung: Int
    $artId: UUID
    $bearbeiter: Int
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
