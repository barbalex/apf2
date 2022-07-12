import { gql } from '@apollo/client'

import { tpop } from '../../../../shared/fragments'

export default gql`
  query TpopForMapQuery($tpopFilter: TpopFilter!) {
    allTpops(filter: $tpopFilter) {
      nodes {
        id
        __typename
        nr
        status
        wgs84Lat
        wgs84Long
        lv95X
        lv95Y
        flurname
        popStatusWerteByStatus {
          id
          __typename
          text
        }
        popByPopId {
          id
          __typename
          nr
          name
          apByApId {
            id
            __typename
            aeTaxonomyByArtId {
              id
              __typename
              artname
            }
          }
        }
      }
    }
  }
`
