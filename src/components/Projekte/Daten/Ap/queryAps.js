import gql from 'graphql-tag'

import { ap } from '../../../shared/fragments'

export default gql`
  query AllApsQuery($apFilter: ApFilter!) {
    allAps {
      totalCount
    }
    filteredAps: allAps(filter: $apFilter) {
      nodes {
        ...ApFields
      }
    }
  }
  ${ap}
`
