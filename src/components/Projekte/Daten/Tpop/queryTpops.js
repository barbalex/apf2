import { gql } from '@apollo/client'

export default gql`
  query tpopsQuery(
    $tpopFilter: TpopFilter!
    $allTpopsFilter: TpopFilter!
    $apId: UUID!
    $apIdExists: Boolean!
  ) {
    allTpops(filter: $allTpopsFilter) @include(if: $apIdExists) {
      totalCount
    }
    tpopsFiltered: allTpops(filter: $tpopFilter) @include(if: $apIdExists) {
      totalCount
    }
    popsOfAp: allPops(filter: { apId: { equalTo: $apId } })
      @include(if: $apIdExists) {
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
