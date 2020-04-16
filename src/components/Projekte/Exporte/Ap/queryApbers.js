import gql from 'graphql-tag'

export default gql`
  query apbersForExportQuery {
    allApbers {
      nodes {
        apByApId {
          id
          aeTaxonomyByArtId {
            id
            artname
          }
        }
        id
        apId
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
        changed
        changedBy
        massnahmenApBearb
        massnahmenPlanungVsAusfuehrung
        datum
        bearbeiter
        adresseByBearbeiter {
          id
          name
        }
      }
    }
  }
`
