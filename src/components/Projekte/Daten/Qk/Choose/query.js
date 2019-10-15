import gql from 'graphql-tag'

import { qk } from '../../../../shared/fragments'

export default gql`
  query QkQuery($apId: UUID!) {
    allQks(orderBy: [SORT_ASC, NAME_ASC]) {
      totalCount
      nodes {
        ...QkFields
        apqksByQkName(filter: { apId: { equalTo: $apId } }) {
          totalCount
        }
      }
    }
  }
  ${qk}
`
