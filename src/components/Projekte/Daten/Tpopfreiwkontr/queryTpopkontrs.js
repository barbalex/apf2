import { gql } from '@apollo/client'

export default gql`
  query tpopkontrQueryForEkf(
    $apIdExists: Boolean!
    $tpopkontrFilter: TpopkontrFilter!
    $allTpopkontrFilter: TpopkontrFilter!
    $apId: UUID!
  ) {
    allTpopkontrs(filter: $allTpopkontrFilter) @include(if: $apIdExists) {
      totalCount
    }
    tpopkontrsFiltered: allTpopkontrs(filter: $tpopkontrFilter)
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
