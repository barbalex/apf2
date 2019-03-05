import gql from 'graphql-tag'

import { aeEigenschaften } from '../../../../shared/fragments'

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
              id
              apId
              nr
              name
              status
              popStatusWerteByStatus {
                id
                text
              }
              statusUnklar
              statusUnklarBegruendung
              bekanntSeit
              x
              y
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
                  id
                  popId
                  nr
                  gemeinde
                  flurname
                  x
                  y
                  radius
                  hoehe
                  exposition
                  klima
                  neigung
                  beschreibung
                  katasterNr
                  status
                  statusUnklar
                  statusUnklarGrund
                  apberRelevant
                  bekanntSeit
                  eigentuemer
                  kontakt
                  nutzungszone
                  bewirtschafter
                  bewirtschaftung
                  kontrollfrequenz
                  kontrollfrequenzFreiwillige
                  bemerkungen
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
              id
              apId
              nr
              name
              status
              popStatusWerteByStatus {
                id
                text
              }
              statusUnklar
              statusUnklarBegruendung
              bekanntSeit
              x
              y
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
                  id
                  popId
                  nr
                  gemeinde
                  flurname
                  x
                  y
                  radius
                  hoehe
                  exposition
                  klima
                  neigung
                  beschreibung
                  katasterNr
                  status
                  statusUnklar
                  statusUnklarGrund
                  apberRelevant
                  bekanntSeit
                  eigentuemer
                  kontakt
                  nutzungszone
                  bewirtschafter
                  bewirtschaftung
                  kontrollfrequenz
                  kontrollfrequenzFreiwillige
                  bemerkungen
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
`
