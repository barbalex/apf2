import gql from 'graphql-tag'

export default gql`
  query view {
    allVZiels {
      nodes {
        ap_id: apId
        artname
        ap_bearbeitung: apBearbeitung
        ap_start_jahr: apStartJahr
        ap_umsetzung: apUmsetzung
        ap_bearbeiter: apBearbeiter
        id
        jahr
        typ
        bezeichnung
      }
    }
  }
`
