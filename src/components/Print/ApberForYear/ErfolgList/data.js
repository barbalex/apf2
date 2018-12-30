import gql from 'graphql-tag'

export default gql`
  query projektById($projektId: UUID!, $jahr: Int!) {
    projektById(id: $projektId) {
      id
      name
      apsByProjId(filter: { bearbeitung: { in: [1, 2, 3] } }) {
        nodes {
          id
          startJahr
          aeEigenschaftenByArtId {
            id
            artname
            kefart
            kefkontrolljahr
          }
          popsByApId {
            nodes {
              id
              status
              tpopsByPopId(filter: { apberRelevant: { equalTo: 1 } }) {
                totalCount
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
                  tpopmassnsByTpopId(filter: { jahr: { equalTo: $jahr } }) {
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
                      id
                      jahr
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
          zielsByApId(filter: { jahr: { equalTo: $jahr } }) {
            nodes {
              id
              bezeichnung
              zielTypWerteByTyp {
                id
                text
                sort
              }
            }
          }
          apbersByApId(filter: { jahr: { equalTo: $jahr } }) {
            nodes {
              id
              jahr
              situation
              vergleichVorjahrGesamtziel
              beurteilung
              apErfkritWerteByBeurteilung {
                id
                text
              }
              veraenderungZumVorjahr
              apberAnalyse
              konsequenzenUmsetzung
              konsequenzenErfolgskontrolle
              biotopeNeue
              biotopeOptimieren
              massnahmenOptimieren
              wirkungAufArt
              datum
              massnahmenApBearb
              massnahmenPlanungVsAusfuehrung
              apId
              bearbeiter
              adresseByBearbeiter {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`
