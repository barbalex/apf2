import { gql } from '@apollo/client'

export default gql`
  query BeobAssignLinesQuery(
    $projId: UUID!
    $apId: UUID
    $beobFilter: BeobFilter!
  ) {
    projektById(id: $projId) {
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
                      wgs84Lat
                      wgs84Long
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
