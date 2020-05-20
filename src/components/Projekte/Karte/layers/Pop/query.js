import gql from 'graphql-tag'

export default gql`
  query PopForMapQuery(
    $projId: UUID!
    $apId: UUID!
    $isActiveInMap: Boolean!
    $tpopLayerIsActive: Boolean!
    $perProj: Boolean!
    $perAp: Boolean!
    $popFilter: PopFilter!
    $tpopFilter: TpopFilter!
  ) {
    projektById(id: $projId) @include(if: $isActiveInMap) {
      id
      __typename
      perAp: apsByProjId(filter: { id: { equalTo: $apId } })
        @include(if: $perAp) {
        nodes {
          id
          __typename
          popsByApId(filter: $popFilter) {
            nodes {
              id
              __typename
              nr
              name
              status
              wgs84Lat
              wgs84Long
              lv95X
              lv95Y
              popStatusWerteByStatus {
                id
                __typename
                text
              }
              apByApId {
                id
                __typename
                aeTaxonomyByArtId {
                  id
                  __typename
                  artname
                }
              }
              tpopsByPopId(filter: $tpopFilter)
                @include(if: $tpopLayerIsActive) {
                nodes {
                  id
                  __typename
                  popByPopId {
                    id
                    __typename
                    nr
                    name
                  }
                }
              }
            }
          }
        }
      }
      perProj: apsByProjId @include(if: $perProj) {
        nodes {
          id
          __typename
          popsByApId(filter: $popFilter) {
            nodes {
              id
              __typename
              nr
              name
              status
              wgs84Lat
              wgs84Long
              lv95X
              lv95Y
              popStatusWerteByStatus {
                id
                __typename
                text
              }
              apByApId {
                id
                __typename
                aeTaxonomyByArtId {
                  id
                  __typename
                  artname
                }
              }
              tpopsByPopId(filter: $tpopFilter)
                @include(if: $tpopLayerIsActive) {
                nodes {
                  id
                  __typename
                  popByPopId {
                    id
                    __typename
                    nr
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`
