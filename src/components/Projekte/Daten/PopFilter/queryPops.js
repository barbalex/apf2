import { gql } from '@apollo/client'

export default gql`
  query allPopsQueryForPopFilter(
    $popFilter: PopFilter!
    $apId: UUID
    $apIdExists: Boolean!
    $apIdNotExists: Boolean!
  ) {
    pops: allPops(filter: { apId: { equalTo: $apId } })
      @include(if: $apIdExists) {
      totalCount
    }
    popsFiltered: allPops(filter: $popFilter) @include(if: $apIdExists) {
      totalCount
    }
    allPops: allPops @include(if: $apIdNotExists) {
      totalCount 
    }
    allPopsFiltered: allPops(filter: $popFilter) @include(if: $apIdNotExists) {
      totalCount
    }
  }
`
