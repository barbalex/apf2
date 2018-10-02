import gql from 'graphql-tag'

export default gql`
  query view {
    allVPopAnzmassns {
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
        x
        y
        anzahl_massnahmen: anzahlMassnahmen
      }
    }
  }
`
