import { gql } from '@apollo/client'

export const queryAps = gql`
  query AllApsQuery($filteredFilter: ApFilter!, $allFilter: ApFilter!) {
    allAps(filter: $allFilter) {
      totalCount
    }
    filteredAps: allAps(filter: $filteredFilter) {
      totalCount
    }
  }
`
