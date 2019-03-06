import gql from 'graphql-tag'

import {
  aeEigenschaften,
  apart,
  beob,
  beobQuelleWerte,
} from '../../../../shared/fragments'

export default gql`
  query BeobAssignLinesQuery(
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
                    tpopId: { isNull: false }
                    nichtZuordnen: { equalTo: false }
                    x: { isNull: false }
                    y: { isNull: false }
                  }
                ) {
                  nodes {
                    ...BeobFields
                    beobQuelleWerteByQuelleId {
                      ...BeobQuelleWerteFields
                    }
                    aeEigenschaftenByArtId {
                      ...AeEigenschaftenFields
                    }
                    tpopByTpopId {
                      id
                      popId
                      nr
                      flurname
                      x
                      y
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
  ${beobQuelleWerte}
`
