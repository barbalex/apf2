import gql from 'graphql-tag'

import { tpopmassnber } from '../../../shared/fragments'

export default gql`
  mutation updateTpopmassnber(
    $id: UUID!
    $tpopId: UUID
    $jahr: Int
    $beurteilung: Int
    $bemerkungen: String
    $changedBy: String
  ) {
    updateTpopmassnberById(
      input: {
        id: $id
        tpopmassnberPatch: {
          id: $id
          tpopId: $tpopId
          jahr: $jahr
          beurteilung: $beurteilung
          bemerkungen: $bemerkungen
          changedBy: $changedBy
        }
      }
    ) {
      tpopmassnber {
        ...TpopmassnberFields
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
  ${tpopmassnber}
`
