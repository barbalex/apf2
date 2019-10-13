import gql from 'graphql-tag'

export default gql`
  query viewTpops {
    allVTpops {
      nodes {
        id
        nr
        gemeinde
        flurname
        status
        status_decodiert: statusDecodiert
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
        bewirtschaftung
        ekfrequenz
        ekfrequenz_abweichend: ekfrequenzAbweichend
        changed
        changed_by: changedBy
      }
    }
  }
`
