import { gql } from '@apollo/client'

export default gql`
  query popPopberUndMassnberQuery {
    allPops(filter: { vPopPopberundmassnbersByPopIdExist: true }) {
      nodes {
        id
        vPopPopberundmassnbersByPopId {
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
            jahr
            popberId
            popberJahr
            popberEntwicklung
            popberBemerkungen
            popberChanged
            popberChangedBy
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
