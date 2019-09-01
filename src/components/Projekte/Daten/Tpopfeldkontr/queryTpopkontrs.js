import gql from 'graphql-tag'

export default gql`
  query tpopkontrQueryForEk(
    $showFilter: Boolean!
    $tpopkontrFilter: TpopkontrFilter!
    $allTpopkontrFilter: TpopkontrFilter!
    $apId: UUID!
  ) {
    allTpopkontrs(filter: $allTpopkontrFilter) @include(if: $showFilter) {
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
              filter: {
                or: [
                  { typ: { notEqualTo: "Freiwilligen-Erfolgskontrolle" } }
                  { typ: { isNull: true } }
                ]
              }
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
