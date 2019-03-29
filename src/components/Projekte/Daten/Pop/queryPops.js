import gql from 'graphql-tag'

export default gql`
  query allPopsQuery(
    $showFilter: Boolean!
    $popFilter: PopFilter!
    $popApFilter: PopFilter!
    $apId: UUID!
  ) {
    allPops @include(if: $showFilter) {
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
