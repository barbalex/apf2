import gql from 'graphql-tag'

import {
  ekzaehleinheit,
  tpopkontrzaehlEinheitWerte,
} from '../../../shared/fragments'

export default gql`
  mutation updateEkzaehleinheit(
    $id: UUID!
    $bemerkungen: String
    $apId: UUID
    $zaehleinheitId: UUID
    $zielrelevant: Boolean
    $sort: Int
    $changedBy: String
  ) {
    updateEkzaehleinheitById(
      input: {
        id: $id
        ekzaehleinheitPatch: {
          id: $id
          bemerkungen: $bemerkungen
          apId: $apId
          zaehleinheitId: $zaehleinheitId
          zielrelevant: $zielrelevant
          sort: $sort
          changedBy: $changedBy
        }
      }
    ) {
      ekzaehleinheit {
        ...EkzaehleinheitFields
        tpopkontrzaehlEinheitWerteByZaehleinheitId {
          ...TpopkontrzaehlEinheitWerteFields
        }
      }
    }
  }
  ${ekzaehleinheit}
  ${tpopkontrzaehlEinheitWerte}
`
