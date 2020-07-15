import { gql } from '@apollo/client'

import { qk } from '../../../../shared/fragments'

export default gql`
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
