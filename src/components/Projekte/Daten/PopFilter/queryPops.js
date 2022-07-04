import { gql } from '@apollo/client'

export default gql`
  query allPopsQueryForPopFilter(
    $popFilter: PopFilter!
    $apId: UUID
    $apIdExists: Boolean!
  ) {
    pops: allPops(filter: { apId: { equalTo: $apId } })
      @include(if: $apIdExists) {
      totalCount
    }
    popsFiltered: allPops(filter: $popFilter) @include(if: $apIdExists) {
      totalCount
    }
  }
`
