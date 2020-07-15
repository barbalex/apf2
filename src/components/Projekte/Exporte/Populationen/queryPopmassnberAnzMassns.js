import { gql } from '@apollo/client'

export default gql`
  query popmassnberAnzMassnQuery {
    allPopmassnbers(filter: { vPopmassnberAnzmassnsByIdExist: true }) {
      nodes {
        id
        vPopmassnberAnzmassnsById {
          nodes {
            apId
            artname
            apBearbeitung
            apStartJahr
            apUmsetzung
            popId
            popNr
            popName
            popStatus
            popBekanntSeit
            popStatusUnklar
            popStatusUnklarBegruendung
            popX
            popY
            popChanged
            popChangedBy
            id
            jahr
            entwicklung
            bemerkungen
            changed
            changedBy
            anzahlMassnahmen
          }
        }
      }
    }
  }
`
