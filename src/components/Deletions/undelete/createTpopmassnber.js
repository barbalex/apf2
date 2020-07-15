import { gql } from '@apollo/client'

import { tpopmassnber } from '../../shared/fragments'

export default gql`
  mutation createTpopmassnberForUndelete(
    $id: UUID
    $tpopId: UUID
    $jahr: Int
    $beurteilung: Int
    $bemerkungen: String
  ) {
    createTpopmassnber(
      input: {
        tpopmassnber: {
          id: $id
          tpopId: $tpopId
          jahr: $jahr
          beurteilung: $beurteilung
          bemerkungen: $bemerkungen
        }
      }
    ) {
      tpopmassnber {
        ...TpopmassnberFields
      }
    }
  }
  ${tpopmassnber}
`
