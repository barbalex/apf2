import { graphql } from '../../../../gql/index.ts'

export const queryTpopmassn = graphql(`
  query TpopmassnQueryForSetStartjahr($tpopId: UUID!) {
    tpopById(id: $tpopId) {
      id
      tpopmassnsByTpopId {
        nodes {
          id
          jahr
        }
      }
    }
  }
`)
