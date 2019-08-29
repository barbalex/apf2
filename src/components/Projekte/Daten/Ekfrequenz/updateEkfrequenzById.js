import gql from 'graphql-tag'

import { ekfrequenz } from '../../../shared/fragments'

export default gql`
  mutation updateEkfrequenz(
    $id: UUID!
    $apId: UUID
    $ek: Boolean
    $ekf: Boolean
    $anwendungsfall: String
    $code: String
    $kontrolljahre: [Int]
    $anzahlMin: Int
    $anzahlMax: Int
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
          ek: $ek
          ekf: $ekf
          anwendungsfall: $anwendungsfall
          code: $code
          kontrolljahre: $kontrolljahre
          anzahlMin: $anzahlMin
          anzahlMax: $anzahlMax
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
