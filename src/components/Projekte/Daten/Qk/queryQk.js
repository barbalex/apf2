import { gql } from '@apollo/client'

import { qk, apqk } from '../../../shared/fragments'

export default gql`
  query QkQueryForQkTop($apId: UUID!) {
    allQks(orderBy: [SORT_ASC, NAME_ASC]) {
      totalCount
      nodes {
        ...QkFields
        #apqksByQkName(filter: { apId: { equalTo: $apId } }) {
        #  totalCount
        #}
      }
    }
    allApqks(filter: { apId: { equalTo: $apId } }) {
      totalCount
      nodes {
        ...ApqkFields
      }
    }
  }
  ${qk}
  ${apqk}
`
