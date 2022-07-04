import { gql } from '@apollo/client'

export default gql`
  query tpopsQuery(
    $tpopFilter: TpopFilter!
    $apId: UUID
    $apIdExists: Boolean!
    $apIdNotExists: Boolean!
  ) {
    allTpops @include(if: $apIdNotExists) {
      totalCount
    }
    allTpopsFiltered: allTpops(filter: $tpopFilter)
      @include(if: $apIdNotExists) {
      totalCount
    }
    allPops(filter: { apId: { equalTo: $apId } }) @include(if: $apIdExists) {
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
