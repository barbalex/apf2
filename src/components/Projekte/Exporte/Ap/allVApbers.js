import gql from 'graphql-tag'

export default gql`
  query viewApbers {
    allVApbers {
      nodes {
        id
        ap_id: apId
        artname
        jahr
        situation
        vergleich_vorjahr_gesamtziel: vergleichVorjahrGesamtziel
        beurteilung
        beurteilung_decodiert: beurteilungDecodiert
        veraenderung_zum_vorjahr: veraenderungZumVorjahr
        apber_analyse: apberAnalyse
        konsequenzen_umsetzung: konsequenzenUmsetzung
        konsequenzen_erfolgskontrolle: konsequenzenErfolgskontrolle
        biotope_neue: biotopeNeue
        biotope_optimieren: biotopeOptimieren
        massnahmen_optimieren: massnahmenOptimieren
        wirkung_auf_art: wirkungAufArt
        changed
        changed_by: changedBy
        massnahmen_ap_bearb: massnahmenApBearb
        massnahmen_planung_vs_ausfuehrung: massnahmenPlanungVsAusfuehrung
        datum
        bearbeiter
        bearbeiter_decodiert: bearbeiterDecodiert
      }
    }
  }
`
