import gql from 'graphql-tag'

export default gql`
  query view {
    allVPopOhnekoords {
      nodes {
        ap_id: apId
        artname
        ap_bearbeitung: apBearbeitung
        ap_start_jahr: apStartJahr
        ap_umsetzung: apUmsetzung
        id
        nr
        name
        status
        bekannt_seit: bekanntSeit
        status_unklar: statusUnklar
        status_unklar_begruendung: statusUnklarBegruendung
        lv95X: x
        lv95Y: y
        changed
        changed_by: changedBy
      }
    }
  }
`
