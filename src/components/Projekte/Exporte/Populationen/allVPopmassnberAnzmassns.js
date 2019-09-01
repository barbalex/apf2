import gql from 'graphql-tag'

export default gql`
  query viewPopmassnberAnzmassns {
    allVPopmassnberAnzmassns {
      nodes {
        ap_id: apId
        artname
        ap_bearbeitung: apBearbeitung
        ap_start_jahr: apStartJahr
        ap_umsetzung: apUmsetzung
        pop_id: popId
        pop_nr: popNr
        pop_name: popName
        pop_status: popStatus
        pop_bekannt_seit: popBekanntSeit
        pop_status_unklar: popStatusUnklar
        pop_status_unklar_begruendung: popStatusUnklarBegruendung
        pop_x: popX
        pop_y: popY
        pop_changed: popChanged
        pop_changed_by: popChangedBy
        id
        jahr
        entwicklung
        bemerkungen
        changed
        changed_by: changedBy
        anzahl_massnahmen: anzahlMassnahmen
      }
    }
  }
`
