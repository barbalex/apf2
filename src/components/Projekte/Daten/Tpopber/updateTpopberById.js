import gql from 'graphql-tag'

import { tpopber } from '../../../shared/fragments'

export default gql`
  mutation updateTpopber(
    $id: UUID!
    $tpopId: UUID
    $jahr: Int
    $entwicklung: Int
    $bemerkungen: String
    $changedBy: String
  ) {
    updateTpopberById(
      input: {
        id: $id
        tpopberPatch: {
          id: $id
          tpopId: $tpopId
          jahr: $jahr
          entwicklung: $entwicklung
          bemerkungen: $bemerkungen
          changedBy: $changedBy
        }
      }
    ) {
      tpopber {
        ...TpopberFields
        tpopByTpopId {
          id
          popByPopId {
            id
            apId
          }
        }
      }
    }
  }
  ${tpopber}
`
