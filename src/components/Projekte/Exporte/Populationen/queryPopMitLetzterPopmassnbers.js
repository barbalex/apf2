import { gql } from '@apollo/client'

export default gql`
  query popMitLetzterPopmassnbersQuery {
    allPops(filter: { vPopMitLetzterPopmassnbersByPopIdExist: true }) {
      nodes {
        id
        vPopMitLetzterPopmassnbersByPopId {
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
            popmassnberId
            popmassnberJahr
            popmassnberEntwicklung
            popmassnberBemerkungen
            popmassnberChanged
            popmassnberChangedBy
          }
        }
      }
    }
  }
`
