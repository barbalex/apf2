import gql from 'graphql-tag'

import { apberuebersicht } from '../../shared/fragments'

export default gql`
  mutation createApberuebersichtForUndelete(
    $id: UUID
    $projId: UUID
    $jahr: Int
    $historyDate: Date
    $bemerkungen: String
  ) {
    createApberuebersicht(
      input: {
        apberuebersicht: {
          id: $id
          projId: $projId
          jahr: $jahr
          historyDate: $historyDate
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
