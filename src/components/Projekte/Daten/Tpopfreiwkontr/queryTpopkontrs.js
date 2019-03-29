import gql from 'graphql-tag'

export default gql`
  query tpopkontrQuery(
    $showFilter: Boolean!
    $tpopkontrFilter: TpopkontrFilter!
    $apId: UUID!
  ) {
    allTpopkontrs(
      filter: { typ: { equalTo: "Freiwilligen-Erfolgskontrolle" } }
    ) @include(if: $showFilter) {
      totalCount
    }
    tpopkontrsFiltered: allTpopkontrs(filter: $tpopkontrFilter)
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
            tpopkontrs: tpopkontrsByTpopId(
              filter: { typ: { equalTo: "Freiwilligen-Erfolgskontrolle" } }
            ) {
              totalCount
            }
            tpopkontrsFiltered: tpopkontrsByTpopId(filter: $tpopkontrFilter) {
              totalCount
            }
          }
        }
      }
    }
  }
`
