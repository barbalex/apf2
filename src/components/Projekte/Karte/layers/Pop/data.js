import gql from 'graphql-tag'

import { aeEigenschaften, pop, tpop } from '../../../../shared/fragments'

export default gql`
  query PopForMapQuery(
    $projId: UUID!
    $apId: UUID!
    $isActiveInMap: Boolean!
    $tpopLayerIsActive: Boolean!
    $perProj: Boolean!
    $perAp: Boolean!
  ) {
    projektById(id: $projId) @include(if: $isActiveInMap) {
      id
      perAp: apsByProjId(filter: { id: { equalTo: $apId } })
        @include(if: $perAp) {
        nodes {
          id
          popsByApId(filter: { x: { isNull: false }, y: { isNull: false } }) {
            nodes {
              ...PopFields
              popStatusWerteByStatus {
                id
                text
              }
              apByApId {
                id
                aeEigenschaftenByArtId {
                  ...AeEigenschaftenFields
                }
              }
              tpopsByPopId(
                filter: { x: { isNull: false }, y: { isNull: false } }
              ) @include(if: $tpopLayerIsActive) {
                nodes {
                  ...TpopFields
                  popByPopId {
                    id
                    nr
                    name
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
          popsByApId(filter: { x: { isNull: false }, y: { isNull: false } }) {
            nodes {
              ...PopFields
              popStatusWerteByStatus {
                id
                text
              }
              apByApId {
                id
                aeEigenschaftenByArtId {
                  ...AeEigenschaftenFields
                }
              }
              tpopsByPopId(
                filter: { x: { isNull: false }, y: { isNull: false } }
              ) @include(if: $tpopLayerIsActive) {
                nodes {
                  ...TpopFields
                  popByPopId {
                    id
                    nr
                    name
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
  ${pop}
  ${tpop}
`
