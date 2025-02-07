import { gql } from '@apollo/client'
import { ekfrequenz } from '../../../shared/fragments.js'

export const query = gql`
  query EkfrequenzQueryForCellForEkfrequenz($apIds: [UUID!], $tpopId: UUID!) {
    allEkfrequenzs(filter: { apId: { in: $apIds } }, orderBy: SORT_ASC) {
      nodes {
        ...EkfrequenzFields
        ekAbrechnungstypWerteByEkAbrechnungstyp {
          id
          text
        }
      }
    }
    tpopById(id: $tpopId) {
      id
      ekfrequenz
    }
  }
  ${ekfrequenz}
`
