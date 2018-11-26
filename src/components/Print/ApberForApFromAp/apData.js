// @flow
import { graphql } from 'react-apollo'
import get from 'lodash/get'
import gql from 'graphql-tag'

export default graphql(
  gql`
    query apById($apId: UUID!, $jahr: Int!) {
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
  `,
  {
    options: ({
      apberData,
      activeNodeArray,
      activeNodes,
      apId: apIdPassed,
    }: {
      apberData: Object,
      activeNodeArray: Array<String>,
      activeNodes: Array<Array<String>>,
      apId: String,
    }) => {
      let apId
      if (apIdPassed) {
        apId = apIdPassed
      } else {
        const { ap: apIdFromActiveNodes } = activeNodes
        apId = apIdFromActiveNodes
      }
      const jahr = get(apberData, 'apberById.jahr', 0)
      const variables = { apId, jahr }
      return { variables }
    },
    name: 'apData',
  },
)
