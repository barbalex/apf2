import { gql } from '@apollo/client'

export const query = gql`
  query PopForMapQuery($popFilter: PopFilter!) {
    allPops(filter: $popFilter) {
      nodes {
        id
        nr
        name
        status
        wgs84Lat
        wgs84Long
        lv95X
        lv95Y
        popStatusWerteByStatus {
          id
          text
        }
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
`
