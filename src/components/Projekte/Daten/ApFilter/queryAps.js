import { gql } from '@apollo/client'

export default gql`
  query AllApsQuery($apFilter: ApFilter!) {
    allAps {
      totalCount
    }
    filteredAps: allAps(filter: $apFilter) {
      totalCount
    }
  }
`
