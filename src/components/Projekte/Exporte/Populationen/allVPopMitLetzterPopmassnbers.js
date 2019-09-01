import gql from 'graphql-tag'

export default gql`
  query viewPopMitLetzterPopmassnbers {
    allVPopMitLetzterPopmassnbers {
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
        popmassnber_id: popmassnberId
        popmassnber_jahr: popmassnberJahr
        popmassnber_entwicklung: popmassnberEntwicklung
        popmassnber_bemerkungen: popmassnberBemerkungen
        popmassnber_changed: popmassnberChanged
        popmassnber_changed_by: popmassnberChangedBy
      }
    }
  }
`
