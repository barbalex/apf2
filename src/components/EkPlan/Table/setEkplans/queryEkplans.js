import { gql } from '@apollo/client'

export default gql`
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
