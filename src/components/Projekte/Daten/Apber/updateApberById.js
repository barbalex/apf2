import gql from 'graphql-tag'

export default gql`
  mutation updateApber(
    $id: UUID!
    $jahr: Int
    $situation: String
    $vergleichVorjahrGesamtziel: String
    $beurteilung: Int
    $veraenderungZumVorjahr: String
    $apberAnalyse: String
    $konsequenzenUmsetzung: String
    $konsequenzenErfolgskontrolle: String
    $biotopeNeue: String
    $biotopeOptimieren: String
    $massnahmenOptimieren: String
    $wirkungAufArt: String
    $datum: Date
    $massnahmenApBearb: String
    $massnahmenPlanungVsAusfuehrung: String
    $apId: UUID
    $bearbeiter: UUID
  ) {
    updateApberById(
      input: {
        id: $id
        apberPatch: {
          id: $id
          jahr: $jahr
          situation: $situation
          vergleichVorjahrGesamtziel: $vergleichVorjahrGesamtziel
          beurteilung: $beurteilung
          veraenderungZumVorjahr: $veraenderungZumVorjahr
          apberAnalyse: $apberAnalyse
          konsequenzenUmsetzung: $konsequenzenUmsetzung
          konsequenzenErfolgskontrolle: $konsequenzenErfolgskontrolle
          biotopeNeue: $biotopeNeue
          biotopeOptimieren: $biotopeOptimieren
          massnahmenOptimieren: $massnahmenOptimieren
          wirkungAufArt: $wirkungAufArt
          datum: $datum
          massnahmenApBearb: $massnahmenApBearb
          massnahmenPlanungVsAusfuehrung: $massnahmenPlanungVsAusfuehrung
          apId: $apId
          bearbeiter: $bearbeiter
        }
      }
    ) {
      apber {
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
        apErfkritWerteByBeurteilung {
          id
          code
          text
          sort
        }
        adresseByBearbeiter {
          id
          name
        }
      }
    }
  }
`
