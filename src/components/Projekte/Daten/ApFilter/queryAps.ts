import { graphql } from '../../../../gql/index.ts'

export const queryAps = graphql(`
  query AllApsQuery($filteredFilter: ApFilter!, $allFilter: ApFilter!) {
    allAps(filter: $allFilter) {
      totalCount
    }
    filteredAps: allAps(filter: $filteredFilter) {
      totalCount
    }
  }
`)
