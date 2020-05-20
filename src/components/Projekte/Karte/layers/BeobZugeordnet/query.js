import gql from 'graphql-tag'

import {
  aeTaxonomies,
  apart,
  beob,
  beobQuelleWerte,
} from '../../../../shared/fragments'

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
                    beobQuelleWerteByQuelleId {
                      id
                      name
                    }
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
