import { gql } from '@apollo/client'

export const queryEkplans = gql`
  query EkplansQuery($jahr: Int!, $tpopId: UUID!) {
    allEkplans(
      filter: {
        jahr: { greaterThanOrEqualTo: $jahr }
        tpopId: { equalTo: $tpopId }
      }
    ) {
      nodes {
        id
      }
    }
  }
`
