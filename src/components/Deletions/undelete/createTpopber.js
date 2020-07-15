import { gql } from '@apollo/client'

import { tpopber } from '../../shared/fragments'

export default gql`
  mutation createTpopberForUndelete(
    $id: UUID
    $tpopId: UUID
    $jahr: Int
    $entwicklung: Int
    $bemerkungen: String
  ) {
    createTpopber(
      input: {
        tpopber: {
          id: $id
          tpopId: $tpopId
          jahr: $jahr
          entwicklung: $entwicklung
          bemerkungen: $bemerkungen
        }
      }
    ) {
      tpopber {
        ...TpopberFields
      }
    }
  }
  ${tpopber}
`
