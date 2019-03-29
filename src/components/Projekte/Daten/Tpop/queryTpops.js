import gql from 'graphql-tag'

export default gql`
  query tpopsQuery(
    $showFilter: Boolean!
    $tpopFilter: TpopFilter!
    $apId: UUID!
  ) {
    allTpops @include(if: $showFilter) {
      totalCount
    }
    tpopsFiltered: allTpops(filter: $tpopFilter) @include(if: $showFilter) {
      totalCount
    }
    tpopsOfAp: allPops(filter: { apId: { equalTo: $apId } })
      @include(if: $showFilter) {
      nodes {
        id
        tpopsByPopId {
          totalCount
        }
      }
    }
    tpopsOfApFiltered: allPops(filter: { apId: { equalTo: $apId } })
      @include(if: $showFilter) {
      nodes {
        id
        tpopsByPopId(filter: $tpopFilter) {
          totalCount
        }
      }
    }
  }
`
