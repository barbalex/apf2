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
              tpopsByPopId(filter: $tpopFilter) {
                nodes {
                  id
                  __typename
                  nr
                  status
                  wgs84Lat
                  wgs84Long
                  lv95X
                  lv95Y
                  flurname
                  popStatusWerteByStatus {
                    id
                    __typename
                    text
                  }
                  popByPopId {
                    id
                    __typename
                    nr
                    name
                    apByApId {
                      id
                      __typename
                      aeTaxonomyByArtId {
                        id
                        __typename
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
          __typename
          popsByApId(filter: $popFilter) {
            nodes {
              id
              __typename
              tpopsByPopId(filter: $tpopFilter) {
                nodes {
                  id
                  __typename
                  nr
                  status
                  wgs84Lat
                  wgs84Long
                  lv95X
                  lv95Y
                  flurname
                  popStatusWerteByStatus {
                    id
                    __typename
                    text
                  }
                  popByPopId {
                    id
                    __typename
                    nr
                    name
                    apByApId {
                      id
                      __typename
                      aeTaxonomyByArtId {
                        id
                        __typename
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
