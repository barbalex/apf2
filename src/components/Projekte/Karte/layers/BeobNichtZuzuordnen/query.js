import gql from 'graphql-tag'

import { aeEigenschaften, apart, beob } from '../../../../shared/fragments'

export default gql`
  query BeobNichtZuzuordnenForMapQuery(
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
              aeEigenschaftenByArtId {
                id
                beobsByArtId(filter: $beobFilter) {
                  nodes {
                    ...BeobFields
                    beobQuelleWerteByQuelleId {
                      id
                      name
                    }
                    aeEigenschaftenByArtId {
                      ...AeEigenschaftenFields
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
  ${aeEigenschaften}
  ${apart}
  ${beob}
`
