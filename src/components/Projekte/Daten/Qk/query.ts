import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { qk, apqk } from '../../../shared/fragments.ts'

export const query = dynamicGql`
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
