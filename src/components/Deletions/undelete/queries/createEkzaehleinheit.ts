import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { ekzaehleinheit } from '../../../shared/fragments.ts'

export default dynamicGql`
  mutation createEkzaehleinheitForUndelete(
    $id: UUID
    $apId: UUID
    $label: String
    $zaehleinheitId: UUID
    $zielrelevant: Boolean
    $notMassnCountUnit: Boolean
    $sort: Int
    $bemerkungen: String
    $changedBy: String
  ) {
    createEkzaehleinheit(
      input: {
        ekzaehleinheit: {
          id: $id
          apId: $apId
          label: $label
          zaehleinheitId: $zaehleinheitId
          zielrelevant: $zielrelevant
          notMassnCountUnit: $notMassnCountUnit
          sort: $sort
          bemerkungen: $bemerkungen
          changedBy: $changedBy
        }
      }
    ) {
      ekzaehleinheit {
        ...EkzaehleinheitFields
      }
    }
  }
  ${ekzaehleinheit}
`
