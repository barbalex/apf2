import gql from 'graphql-tag'

export default gql`
  query tpopmassnsFilterQuery(
    $showFilter: Boolean!
    $tpopmassnFilter: TpopmassnFilter!
    $allTpopmassnFilter: TpopmassnFilter!
    $apId: UUID!
  ) {
    allTpopmassns(filter: $allTpopmassnFilter) @include(if: $showFilter) {
      totalCount
    }
    tpopmassnsFiltered: allTpopmassns(filter: $tpopmassnFilter)
      @include(if: $showFilter) {
      totalCount
    }
    popsOfAp: allPops(filter: { apId: { equalTo: $apId } })
      @include(if: $showFilter) {
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
