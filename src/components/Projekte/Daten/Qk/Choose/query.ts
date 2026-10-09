import { gql as dynamicGql } from '../../../../../apolloGql.ts'

import { qk } from '../../../../shared/fragments.ts'

export const query = dynamicGql`
  query QkQueryForRow {
    allQks(orderBy: [SORT_ASC, NAME_ASC]) {
      totalCount
      nodes {
        ...QkFields
      }
    }
  }
  ${qk}
`
