import gql from 'graphql-tag'

import { aeEigenschaften } from '../../../../shared/fragments'

export default gql`
  query TpopForMapQuery(
    $apId: UUID!
    $projId: UUID!
    $isActiveInMap: Boolean!
    $perProj: Boolean!
    $perAp: Boolean!
  ) {
    projektById(id: $projId) @include(if: $isActiveInMap) {
      id
      perAp: apsByProjId(filter: { id: { equalTo: $apId } })
        @include(if: $perAp) {
        nodes {
          id
          aeEigenschaftenByArtId {
            ...AeEigenschaftenFields
          }
          popsByApId {
            nodes {
              id
              apId
              nr
              name
              status
              statusUnklar
              statusUnklarBegruendung
              bekanntSeit
              x
              y
              tpopsByPopId(
                filter: { x: { isNull: false }, y: { isNull: false } }
              ) {
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
                  popStatusWerteByStatus {
                    id
                    text
                  }
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
                    apByApId {
                      id
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
      perProj: apsByProjId @include(if: $perProj) {
        nodes {
          id
          aeEigenschaftenByArtId {
            ...AeEigenschaftenFields
          }
          popsByApId {
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
              tpopsByPopId(
                filter: { x: { isNull: false }, y: { isNull: false } }
              ) {
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
                    apByApId {
                      id
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
  }
  ${aeEigenschaften}
`
