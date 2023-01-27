import { gql } from '@apollo/client'

import { zielber } from '../../../shared/fragments'

export default gql`
  mutation createZielberForUndelete(
    $id: UUID
    $zielId: UUID
    $jahr: Int
    $erreichung: String
    $bemerkungen: String
  ) {
    createZielber(
      input: {
        zielber: {
          id: $id
          zielId: $zielId
          jahr: $jahr
          erreichung: $erreichung
          bemerkungen: $bemerkungen
        }
      }
    ) {
      zielber {
        ...ZielberFields
      }
    }
  }
  ${zielber}
`
