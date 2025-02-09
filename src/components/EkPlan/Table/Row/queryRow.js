import { gql } from '@apollo/client'
import { ekfrequenz } from '../../../shared/fragments.js'

export const queryRow = gql`
  query RowQueryForEkPlan($apIds: [UUID!], $tpopId: UUID!) {
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
      ekfrequenzStartjahr
      ekfrequenzAbweichend
    }
  }
  ${ekfrequenz}
`
