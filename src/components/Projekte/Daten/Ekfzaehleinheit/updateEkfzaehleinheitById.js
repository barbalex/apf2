import gql from 'graphql-tag'

import { ekfzaehleinheit } from '../../../shared/fragments'

export default gql`
  mutation updateEkfzaehleinheit(
    $id: UUID!
    $bemerkungen: String
    $apId: UUID
    $zaehleinheitId: UUID
    $changedBy: String
  ) {
    updateEkfzaehleinheitById(
      input: {
        id: $id
        ekfzaehleinheitPatch: {
          id: $id
          bemerkungen: $bemerkungen
          apId: $apId
          zaehleinheitId: $zaehleinheitId
          changedBy: $changedBy
        }
      }
    ) {
      ekfzaehleinheit {
        ...EkfzaehleinheitFields
        tpopkontrzaehlEinheitWerteByZaehleinheitId {
          id
          text
        }
      }
    }
  }
  ${ekfzaehleinheit}
`
