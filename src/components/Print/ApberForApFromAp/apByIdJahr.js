// @flow
import gql from 'graphql-tag'

import {
  adresse,
  aeEigenschaften,
  ap,
  apber,
  tpopber,
  ziel,
} from '../../shared/fragments'

export default gql`
  query apByIdJahr($apId: UUID!, $jahr: Int!) {
    apById(id: $apId) {
      ...ApFields
      aeEigenschaftenByArtId {
        ...AeEigenschaftenFields
      }
      popsByApId {
        nodes {
          id
          tpopsByPopId(condition: { apberRelevant: 1 }) {
            nodes {
              id
              apberRelevant
              firstTpopmassn: tpopmassnsByTpopId(orderBy: DATUM_ASC, first: 1) {
                nodes {
                  id
                  datum
                }
              }
              tpopmassnsByTpopId(condition: { jahr: $jahr }) {
                nodes {
                  id
                  datum
                  tpopmassnTypWerteByTyp {
                    id
                    text
                  }
                  beschreibung
                  tpopByTpopId {
                    id
                    nr
                    flurname
                    popByPopId {
                      id
                      nr
                      name
                    }
                  }
                }
              }
              firstTpopber: tpopbersByTpopId(orderBy: JAHR_ASC, first: 1) {
                nodes {
                  ...TpopberFields
                }
              }
            }
          }
        }
      }
      erfkritsByApId {
        nodes {
          id
          kriterien
          apErfkritWerteByErfolg {
            id
            text
            sort
          }
        }
      }
      zielsByApId(condition: { jahr: $jahr }) {
        nodes {
          ...ZielFields
          zielTypWerteByTyp {
            id
            text
            sort
          }
          zielbersByZielId {
            nodes {
              id
              erreichung
              bemerkungen
            }
          }
        }
      }
      apbersByApId(filter: { jahr: { equalTo: $jahr } }) {
        nodes {
          ...AbperFields
          apErfkritWerteByBeurteilung {
            id
            text
          }
          adresseByBearbeiter {
            ...AdresseFields
          }
        }
      }
    }
  }
  ${aeEigenschaften}
  ${ap}
  ${apber}
  ${adresse}
  ${tpopber}
  ${ziel}
`
