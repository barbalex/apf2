import gql from 'graphql-tag'

export default gql`
  query viewAssozarts {
    allVAssozarts {
      nodes {
        ap_id: apId
        artname
        ap_bearbeitung: apBearbeitung
        ap_start_jahr: apStartJahr
        ap_umsetzung: apUmsetzung
        ap_bearbeiter: apBearbeiter
        id
        artname_assoziiert: artnameAssoziiert
        bemerkungen
        changed
        changed_by: changedBy
      }
    }
  }
`
