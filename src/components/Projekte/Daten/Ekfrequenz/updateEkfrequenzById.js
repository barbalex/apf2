import { gql } from '@apollo/client'

import { ekfrequenz } from '../../../shared/fragments'

export default gql`
  mutation updateEkfrequenz(
    $id: UUID!
    $apId: UUID
    $ektyp: EkType
    $anwendungsfall: String
    $code: String
    $kontrolljahre: [Int]
    $kontrolljahreAb: EkKontrolljahreAb
    $bemerkungen: String
    $sort: Int
    $ekAbrechnungstyp: String
    $changedBy: String
  ) {
    updateEkfrequenzById(
      input: {
        id: $id
        ekfrequenzPatch: {
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
