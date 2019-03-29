import gql from 'graphql-tag'

export default gql`
  query tpopkontrQuery(
    $showFilter: Boolean!
    $tpopkontrFilter: TpopkontrFilter!
    $apId: UUID!
  ) {
    allTpopkontrs(
      filter: {
        or: [
          { typ: { notEqualTo: "Freiwilligen-Erfolgskontrolle" } }
          { typ: { isNull: true } }
        ]
      }
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
