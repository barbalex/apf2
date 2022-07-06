import { gql } from '@apollo/client'

export default gql`
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
`
