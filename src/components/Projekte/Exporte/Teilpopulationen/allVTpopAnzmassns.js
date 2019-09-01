import gql from 'graphql-tag'

export default gql`
  query viewTpopAnzmassns {
    allVTpopAnzmassns {
      nodes {
        ap_id: apId
        familie
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
        id
        nr
        gemeinde
        flurname
        status
        bekannt_seit: bekanntSeit
        status_unklar: statusUnklar
        status_unklar_grund: statusUnklarGrund
        lv95X: x
        lv95Y: y
        radius
        hoehe
        exposition
        klima
        neigung
        beschreibung
        kataster_nr: katasterNr
        apber_relevant: apberRelevant
        apber_relevant_grund: apberRelevantGrund
        eigentuemer
        kontakt
        nutzungszone
        bewirtschafter
        ekfrequenz
        ekfrequenz_abweichend: ekfrequenzAbweichend
        anzahlMassnahmen
      }
    }
  }
`
