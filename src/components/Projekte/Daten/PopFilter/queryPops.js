import { gql } from '@apollo/client'

export default gql`
  query allPopsQueryForPopFilter(
    $popFilter: PopFilter!
    $popApFilter: PopFilter!
    $allPopsFilter: PopFilter!
    $apId: UUID!
    $apIdExists: Boolean!
  ) {
    allPops(filter: $allPopsFilter) @include(if: $apIdExists) {
      totalCount
    }
    popsFiltered: allPops(filter: $popFilter) @include(if: $apIdExists) {
      totalCount
    }
    popsOfAp: allPops(filter: { apId: { equalTo: $apId } })
      @include(if: $apIdExists) {
      totalCount
    }
    popsOfApFiltered: allPops(filter: $popApFilter) @include(if: $apIdExists) {
      totalCount
    }
  }
`
