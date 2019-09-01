import gql from 'graphql-tag'

export default gql`
  query viewZielbers {
    allVZielbers {
      nodes {
        ap_id: apId
        artname
        ap_bearbeitung: apBearbeitung
        ap_start_jahr: apStartJahr
        ap_umsetzung: apUmsetzung
        ap_bearbeiter: apBearbeiter
        ziel_id: zielId
        ziel_jahr: zielJahr
        ziel_typ: zielTyp
        ziel_bezeichnung: zielBezeichnung
        id
        jahr
        erreichung
        bemerkungen
        changed
        changed_by: changedBy
      }
    }
  }
`
