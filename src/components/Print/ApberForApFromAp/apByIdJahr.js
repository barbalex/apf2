// @flow
import gql from 'graphql-tag'

export default gql`
  query apByIdJahr($apId: UUID!, $jahr: Int!) {
    apById(id: $apId) {
      id
      startJahr
      aeEigenschaftenByArtId {
        id
        artname
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
      zielsByApId(condition: { jahr: $jahr }) {
        nodes {
          id
          bezeichnung
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
`
