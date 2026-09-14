import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { tpopmassnber } from '../../../shared/fragments.ts'

export default dynamicGql`
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
