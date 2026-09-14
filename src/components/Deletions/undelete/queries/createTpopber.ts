import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { tpopber } from '../../../shared/fragments.ts'

export default dynamicGql`
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
