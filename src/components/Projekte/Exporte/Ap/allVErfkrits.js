import gql from 'graphql-tag'

export default gql`
  query viewErfkrits {
    allVErfkrits {
      nodes {
        ap_id: apId
        artname
        ap_bearbeitung: apBearbeitung
        ap_start_jahr: apStartJahr
        ap_umsetzung: apUmsetzung
        ap_bearbeiter: apBearbeiter
        id
        beurteilung
        kriterien
        changed
        changed_by: changedBy
      }
    }
  }
`
