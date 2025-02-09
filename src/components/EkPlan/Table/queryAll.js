import { gql } from '@apollo/client'

export const queryAll = gql`
  query EkplanTpopQuery($tpopFilter: TpopFilter!) {
    allTpops(
      filter: $tpopFilter
      orderBy: [AP_NAME_ASC, POP_BY_POP_ID__NR_ASC, NR_ASC]
    ) {
      nodes {
        id
      }
    }
  }
`
