import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { apberuebersicht } from '../../../shared/fragments.ts'

export default dynamicGql`
  mutation createApberuebersichtForUndelete(
    $id: UUID
    $projId: UUID
    $jahr: Int
    $historyDate: Date
    $historyFixed: Boolean
    $bemerkungen: String
  ) {
    createApberuebersicht(
      input: {
        apberuebersicht: {
          id: $id
          projId: $projId
          jahr: $jahr
          historyDate: $historyDate
          historyFixed: $historyFixed
          bemerkungen: $bemerkungen
        }
      }
    ) {
      apberuebersicht {
        ...ApberuebersichtFields
      }
    }
  }
  ${apberuebersicht}
`
