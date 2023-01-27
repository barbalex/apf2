import { gql } from '@apollo/client'

export default gql`
  query TpopForMapQuery($tpopFilter: TpopFilter!) {
    allTpops(filter: $tpopFilter) {
      nodes {
        id
        nr
        status
        wgs84Lat
        wgs84Long
        lv95X
        lv95Y
        flurname
        popStatusWerteByStatus {
          id
          text
        }
        popByPopId {
          id
          nr
          name
          apByApId {
            id
            aeTaxonomyByArtId {
              id
              artname
            }
          }
        }
      }
    }
  }
`
