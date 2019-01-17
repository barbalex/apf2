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
          }
          adresseByBearbeiter {
            id
            name
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
    }
  }
`
