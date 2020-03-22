import gql from 'graphql-tag'

import { apberuebersicht } from '../../../shared/fragments'

export default gql`
  mutation updateApberuebersicht(
    $id: UUID!
    $projId: UUID
    $jahr: Int
    $historyDate: Date
    $bemerkungen: String
    $changedBy: String
  ) {
    updateApberuebersichtById(
      input: {
        id: $id
        apberuebersichtPatch: {
          id: $id
          projId: $projId
          jahr: $jahr
          historyDate: $historyDate
          bemerkungen: $bemerkungen
          changedBy: $changedBy
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
