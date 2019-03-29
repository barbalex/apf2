import gql from 'graphql-tag'

export default gql`
  query tpopmassnsQuery(
    $showFilter: Boolean!
    $tpopmassnFilter: TpopmassnFilter!
    $apId: UUID!
  ) {
    allTpopmassns @include(if: $showFilter) {
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
