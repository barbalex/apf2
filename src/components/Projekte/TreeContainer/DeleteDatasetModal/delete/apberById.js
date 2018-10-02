import gql from 'graphql-tag'

export default gql`
  query apberById($id: UUID!) {
    apberById(id: $id) {
      id
      jahr
      situation
      vergleichVorjahrGesamtziel
      beurteilung
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
    }
  }
`
