import { gql } from '@apollo/client'

export default gql`
  query tpopsQuery(
    $showFilter: Boolean!
    $tpopFilter: TpopFilter!
    $allTpopsFilter: TpopFilter!
    $apId: UUID!
  ) {
    allTpops(filter: $allTpopsFilter) @include(if: $showFilter) {
      totalCount
    }
    tpopsFiltered: allTpops(filter: $tpopFilter) @include(if: $showFilter) {
      totalCount
    }
    popsOfAp: allPops(filter: { apId: { equalTo: $apId } })
      @include(if: $showFilter) {
      nodes {
        id
        tpops: tpopsByPopId {
          totalCount
        }
        tpopsFiltered: tpopsByPopId(filter: $tpopFilter) {
          totalCount
        }
      }
    }
  }
`
