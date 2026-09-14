import { graphql } from '../../../../gql'

export const queryEkplans = graphql(`
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
`)
