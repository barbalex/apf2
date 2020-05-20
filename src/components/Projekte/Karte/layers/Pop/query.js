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
      perAp: apsByProjId(filter: { id: { equalTo: $apId } })
        @include(if: $perAp) {
        nodes {
          id
          popsByApId(filter: $popFilter) {
            nodes {
              id
              nr
              name
              status
              wgs84Lat
              wgs84Long
              lv95X
              lv95Y
              popStatusWerteByStatus {
                id
                text
              }
              apByApId {
                id
                aeTaxonomyByArtId {
                  id
                  artname
                }
              }
              tpopsByPopId(filter: $tpopFilter)
                @include(if: $tpopLayerIsActive) {
                nodes {
                  id
                  popByPopId {
                    id
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
          popsByApId(filter: $popFilter) {
            nodes {
              id
              nr
              name
              status
              wgs84Lat
              wgs84Long
              lv95X
              lv95Y
              popStatusWerteByStatus {
                id
                text
              }
              apByApId {
                id
                aeTaxonomyByArtId {
                  id
                  artname
                }
              }
              tpopsByPopId(filter: $tpopFilter)
                @include(if: $tpopLayerIsActive) {
                nodes {
                  id
                  popByPopId {
                    id
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
