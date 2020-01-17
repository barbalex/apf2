import gql from 'graphql-tag'

export default gql`
  query allPopsQueryForPop(
    $showFilter: Boolean!
    $popFilter: PopFilter!
    $popApFilter: PopFilter!
    $allPopsFilter: PopFilter!
    $apId: UUID!
  ) {
    allPops(filter: $allPopsFilter) @include(if: $showFilter) {
      totalCount
    }
    popsFiltered: allPops(filter: $popFilter) @include(if: $showFilter) {
      totalCount
    }
    popsOfAp: allPops(filter: { apId: { equalTo: $apId } })
      @include(if: $showFilter) {
      totalCount
    }
    popsOfApFiltered: allPops(filter: $popApFilter) @include(if: $showFilter) {
      totalCount
    }
  }
`
