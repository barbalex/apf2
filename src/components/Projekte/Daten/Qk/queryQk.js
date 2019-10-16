import gql from 'graphql-tag'

import { qk } from '../../../shared/fragments'

export default gql`
  query QkQueryForQkTop($apId: UUID!) {
    allQks(orderBy: [SORT_ASC, NAME_ASC]) {
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
