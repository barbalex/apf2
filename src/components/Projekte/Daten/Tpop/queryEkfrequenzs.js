import gql from 'graphql-tag'

import { ekfrequenz } from '../../../shared/fragments'

export default gql`
  query ekfrequenzQuery($apId: UUID!) {
    allEkfrequenzs(filter: { apId: { equalTo: $apId } }, orderBy: SORT_ASC) {
      nodes {
        ...EkfrequenzFields
      }
    }
  }
  ${ekfrequenz}
`
