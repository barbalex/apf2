import { graphql } from '../../../../gql/index.ts'

export const query = graphql(`
  query allPopsQueryForPopFilter(
    $filteredFilter: PopFilter!
    $allFilter: PopFilter!
  ) {
    pops: allPops(filter: $allFilter) {
      totalCount
    }
    popsFiltered: allPops(filter: $filteredFilter) {
      totalCount
    }
  }
`)
