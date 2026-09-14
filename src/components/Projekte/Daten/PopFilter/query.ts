import { graphql } from '../../../../gql'

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
