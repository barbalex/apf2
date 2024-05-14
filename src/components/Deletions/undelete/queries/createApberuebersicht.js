import { gql } from '@apollo/client'

import { apberuebersicht } from '../../../shared/fragments.js'

export default gql`
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
