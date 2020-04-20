import gql from 'graphql-tag'

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
