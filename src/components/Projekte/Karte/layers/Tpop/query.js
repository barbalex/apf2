import gql from 'graphql-tag'

export default gql`
  query TpopForMapQuery(
    $apId: UUID!
    $projId: UUID!
    $isActiveInMap: Boolean!
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
              tpopsByPopId(filter: $tpopFilter) {
                nodes {
                  id
                  nr
                  status
                  wgs84Lat
                  wgs84Long
                  lv95X
                  lv95Y
                  flurname
                  popStatusWerteByStatus {
                    id
                    text
                  }
                  popByPopId {
                    id
                    nr
                    name
                    apByApId {
                      id
                      aeTaxonomyByArtId {
                        id
                        artname
                      }
                    }
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
              tpopsByPopId(filter: $tpopFilter) {
                nodes {
                  id
                  nr
                  status
                  wgs84Lat
                  wgs84Long
                  lv95X
                  lv95Y
                  flurname
                  popStatusWerteByStatus {
                    id
                    text
                  }
                  popByPopId {
                    id
                    nr
                    name
                    apByApId {
                      id
                      aeTaxonomyByArtId {
                        id
                        artname
                      }
                    }
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
