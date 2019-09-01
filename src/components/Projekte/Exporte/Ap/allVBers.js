import gql from 'graphql-tag'

export default gql`
  query viewBers {
    allVBers {
      nodes {
        ap_id: apId
        artname
        ap_bearbeitung: apBearbeitung
        ap_start_jahr: apStartJahr
        ap_umsetzung: apUmsetzung
        ap_bearbeiter: apBearbeiter
        id
        autor
        jahr
        titel
        url
        changed
        changed_by: changedBy
      }
    }
  }
`
