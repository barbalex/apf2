import gql from 'graphql-tag'

import { apberuebersicht } from '../../shared/fragments'

export default gql`
  mutation createApberuebersicht(
    $id: UUID
    $projId: UUID
    $jahr: Int
    $bemerkungen: String
  ) {
    createApberuebersicht(
      input: {
        apberuebersicht: {
          id: $id
          projId: $projId
          jahr: $jahr
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
