import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { ekfrequenz } from '../../../shared/fragments.ts'

export default dynamicGql`
  mutation createEkfrequenzForUndelete(
    $id: UUID
    $apId: UUID
    $ektyp: String
    $anwendungsfall: String
    $code: String
    $kontrolljahre: [Int]
    $kontrolljahreAb: String
    $bemerkungen: String
    $sort: Int
    $ekAbrechnungstyp: String
    $changedBy: String
  ) {
    createEkfrequenz(
      input: {
        ekfrequenz: {
          id: $id
          apId: $apId
          ektyp: $ektyp
          anwendungsfall: $anwendungsfall
          code: $code
          kontrolljahre: $kontrolljahre
          kontrolljahreAb: $kontrolljahreAb
          bemerkungen: $bemerkungen
          sort: $sort
          ekAbrechnungstyp: $ekAbrechnungstyp
          changedBy: $changedBy
        }
      }
    ) {
      ekfrequenz {
        ...EkfrequenzFields
      }
    }
  }
  ${ekfrequenz}
`
