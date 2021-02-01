import { gql } from '@apollo/client'

export default gql`
  query BeobZugeordnetForMapQuery(
    $projId: UUID!
    $apId: UUID
    $isActiveInMap: Boolean!
    $beobFilter: BeobFilter!
  ) {
    projektById(id: $projId) @include(if: $isActiveInMap) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          apartsByApId {
            nodes {
              id
              aeTaxonomyByArtId {
                id
                beobsByArtId(filter: $beobFilter) {
                  nodes {
                    id
                    wgs84Lat
                    wgs84Long
                    lv95X
                    lv95Y
                    datum
                    autor
                    quelle
                    aeTaxonomyByArtId {
                      id
                      artname
                    }
                    tpopByTpopId {
                      id
                      popId
                      nr
                      flurname
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
