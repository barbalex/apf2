import { gql } from '@apollo/client'

export default gql`
  query AllApsQuery($filteredFilter: ApFilter!, $allFilter: ApFilter!) {
    allAps(filter: $allFilter) {
      totalCount
    }
    filteredAps: allAps(filter: $filteredFilter) {
      totalCount
    }
  }
`
