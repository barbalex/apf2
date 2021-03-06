import { gql } from '@apollo/client'

export default gql`
  query popMitLetzterPopbersQuery {
    allPops(filter: { vPopMitLetzterPopbersByPopIdExist: true }) {
      nodes {
        id
        vPopMitLetzterPopbersByPopId {
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
            popberId
            popberJahr
            popberEntwicklung
            popberBemerkungen
            popberChanged
            popberChangedBy
          }
        }
      }
    }
  }
`
