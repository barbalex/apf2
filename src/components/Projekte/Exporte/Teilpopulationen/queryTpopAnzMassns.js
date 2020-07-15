import { gql } from '@apollo/client'

export default gql`
  query tpopAnzMassnQuery {
    allTpops(filter: { vTpopAnzmassnsByIdExist: true }) {
      totalCount
      nodes {
        id
        vTpopAnzmassnsById {
          nodes {
            apId
            familie
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
            id
            nr
            gemeinde
            flurname
            status
            bekanntSeit
            statusUnklar
            statusUnklarGrund
            x
            y
            radius
            hoehe
            exposition
            klima
            neigung
            beschreibung
            katasterNr
            apberRelevant
            apberRelevantGrund
            eigentuemer
            kontakt
            nutzungszone
            bewirtschafter
            ekfrequenz
            ekfrequenzAbweichend
            anzahlMassnahmen
          }
        }
      }
    }
  }
`
