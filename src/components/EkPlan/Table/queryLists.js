import gql from 'graphql-tag'

import { ekfrequenz } from '../../shared/fragments'

export default gql`
  query TpopListsQuery($apIds: [UUID!]) {
    allEkfrequenzs(filter: { apId: { in: $apIds } }, orderBy: SORT_ASC) {
      nodes {
        ...EkfrequenzFields
      }
    }
  }
  ${ekfrequenz}
`
