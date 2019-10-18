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
              ...ApartFields
              aeTaxonomyByArtId {
                id
                beobsByArtId(filter: $beobFilter) {
                  nodes {
                    ...BeobFields
                    beobQuelleWerteByQuelleId {
                      ...BeobQuelleWerteFields
                    }
                    aeTaxonomyByArtId {
                      ...AeTaxonomiesFields
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
  ${aeTaxonomies}
  ${apart}
  ${beob}
  ${beobQuelleWerte}
`
