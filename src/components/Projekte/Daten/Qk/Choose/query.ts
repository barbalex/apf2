import { gql } from '@apollo/client'

import { qk } from '../../../../shared/fragments.ts'

export const query = gql`
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
