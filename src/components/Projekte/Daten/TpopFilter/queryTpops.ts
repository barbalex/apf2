import { graphql } from '../../../../gql/index.ts'

export const queryTpops = graphql(`
  query tpopsQuery($filteredFilter: TpopFilter!, $allFilter: TpopFilter!) {
    allTpops(filter: $allFilter) {
      totalCount
    }
    allTpopsFiltered: allTpops(filter: $filteredFilter) {
      totalCount
    }
  }
`)
