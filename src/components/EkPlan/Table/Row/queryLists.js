import gql from 'graphql-tag'

import { ekfrequenz } from '../../../shared/fragments'

export default gql`
  query TpopListsQuery($apIds: [UUID!]) {
    allEkfrequenzs(filter: { apId: { in: $apIds } }, orderBy: SORT_ASC) {
      nodes {
        ...EkfrequenzFields
      }
    }
    allEkAbrechnungstypWertes(
      orderBy: SORT_ASC
      filter: { code: { isNull: false } }
    ) {
      nodes {
        value: code
        label: text
      }
    }
  }
  ${ekfrequenz}
`
