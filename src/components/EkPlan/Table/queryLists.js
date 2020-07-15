import { gql } from '@apollo/client'

import { ekfrequenz } from '../../shared/fragments'

export default gql`
  query TpopListsQueryForTable($apIds: [UUID!]) {
    allEkfrequenzs(filter: { apId: { in: $apIds } }, orderBy: SORT_ASC) {
      nodes {
        ...EkfrequenzFields
        ekAbrechnungstypWerteByEkAbrechnungstyp {
          id
          text
        }
      }
    }
  }
  ${ekfrequenz}
`
