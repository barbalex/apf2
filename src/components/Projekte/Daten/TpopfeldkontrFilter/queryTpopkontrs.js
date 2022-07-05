import { gql } from '@apollo/client'

export default gql`
  query tpopkontrQueryForEk(
    $apIdExists: Boolean!
    $apIdNotExists: Boolean!
    $tpopkontrFilter: TpopkontrFilter!
    $allTpopkontrFilter: TpopkontrFilter!
    $apId: UUID
  ) {
    allTpopkontrs(filter: $allTpopkontrFilter) @include(if: $apIdNotExists) {
      totalCount
    }
    tpopkontrsFiltered: allTpopkontrs(filter: $tpopkontrFilter)
      @include(if: $apIdNotExists) {
      totalCount
    }
    allPops(filter: { apId: { equalTo: $apId } }) @include(if: $apIdExists) {
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
