import gql from 'graphql-tag'

import {
  adresse,
  aeEigenschaften,
  ap,
  apber,
  tpopber,
  ziel,
  apErfkritWerte,
  tpopmassnTypWerte,
  zielber,
  zielTypWerte,
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
          tpopsByPopId(condition: { apberRelevant: true }) {
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
                    ...TpopmassnTypWerteFields
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
            ...ApErfkritWerteFields
          }
        }
      }
      zielsByApId(condition: { jahr: $jahr }) {
        nodes {
          ...ZielFields
          zielTypWerteByTyp {
            ...ZielTypWerteFields
          }
          zielbersByZielId {
            nodes {
              ...ZielberFields
            }
          }
        }
      }
      apbersByApId(filter: { jahr: { equalTo: $jahr } }) {
        nodes {
          ...ApberFields
          apErfkritWerteByBeurteilung {
            ...ApErfkritWerteFields
          }
          adresseByBearbeiter {
            ...AdresseFields
          }
        }
      }
    }
  }
  ${adresse}
  ${aeEigenschaften}
  ${ap}
  ${apber}
  ${apErfkritWerte}
  ${tpopber}
  ${tpopmassnTypWerte}
  ${ziel}
  ${zielber}
  ${zielTypWerte}
`
