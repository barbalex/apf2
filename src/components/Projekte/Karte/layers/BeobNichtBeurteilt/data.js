import gql from 'graphql-tag'

import { aeEigenschaften, apart, beob } from '../../../../shared/fragments'

export default gql`
  query BeobNichtBeurteiltForMapQuery(
    $projId: UUID!
    $apId: UUID
    $isActiveInMap: Boolean!
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
                beobsByArtId(
                  filter: {
                    tpopId: { isNull: true }
                    nichtZuordnen: { equalTo: false }
                    x: { isNull: false }
                    y: { isNull: false }
                  }
                ) {
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
