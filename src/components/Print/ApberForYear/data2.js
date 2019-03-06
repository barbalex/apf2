import gql from 'graphql-tag'

import {
  adresse,
  aeEigenschaften,
  apber,
  projekt,
  tpopber,
  ziel,
  apErfkritWerte,
} from '../../shared/fragments'

export default gql`
  query projektById($projektId: UUID!, $jahr: Int!) {
    projektById(id: $projektId) {
      ...ProjektFields
      apsByProjId(filter: { bearbeitung: { in: [1, 2, 3] } }) {
        nodes {
          id
          startJahr
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
                  firstTpopmassn: tpopmassnsByTpopId(
                    orderBy: DATUM_ASC
                    first: 1
                  ) {
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
                ...ApErfkritWerteFields
              }
            }
          }
          zielsByApId(filter: { jahr: { equalTo: $jahr } }) {
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
    }
  }
  ${adresse}
  ${aeEigenschaften}
  ${apber}
  ${projekt}
  ${tpopber}
  ${ziel}
  ${apErfkritWerte}
`
