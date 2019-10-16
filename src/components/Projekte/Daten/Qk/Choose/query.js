import gql from 'graphql-tag'

import { qk } from '../../../../shared/fragments'

export default gql`
  query QkQuery {
    allQks(orderBy: [SORT_ASC, NAME_ASC]) {
      totalCount
      nodes {
        ...QkFields
      }
    }
  }
  ${qk}
`
