import { gql } from '@apollo/client'

export default gql`
  query tpopmassnsFilterQuery(
    $apIdExists: Boolean!
    $tpopmassnFilter: TpopmassnFilter!
    $allTpopmassnFilter: TpopmassnFilter!
    $apId: UUID!
  ) {
    allTpopmassns(filter: $allTpopmassnFilter) @include(if: $apIdExists) {
      totalCount
    }
    tpopmassnsFiltered: allTpopmassns(filter: $tpopmassnFilter)
      @include(if: $apIdExists) {
      totalCount
    }
    popsOfAp: allPops(filter: { apId: { equalTo: $apId } })
      @include(if: $apIdExists) {
      nodes {
        id
        tpops: tpopsByPopId {
          nodes {
            id
            tpopmassns: tpopmassnsByTpopId {
              totalCount
            }
            tpopmassnsFiltered: tpopmassnsByTpopId(filter: $tpopmassnFilter) {
              totalCount
            }
          }
        }
      }
    }
  }
`
