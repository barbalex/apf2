import { graphql } from '../../../../gql/index.ts'

export const queryEkplansOfTpop = graphql(`
  query EkplansOfTpopQuery($tpopId: UUID!, $jahr: Int) {
    allEkplans(
      filter: { tpopId: { equalTo: $tpopId }, jahr: { equalTo: $jahr } }
    ) {
      nodes {
        id
        typ
      }
    }
  }
`)
