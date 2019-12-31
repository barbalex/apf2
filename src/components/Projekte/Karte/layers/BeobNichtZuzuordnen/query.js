import gql from 'graphql-tag'

import { aeTaxonomies, apart, beob } from '../../../../shared/fragments'

export default gql`
  query KarteBeobNichtZuzuordnenQuery(
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
                      id
                      name
                    }
                    aeTaxonomyByArtId {
                      ...AeTaxonomiesFields
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
`
