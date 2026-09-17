import { graphql } from '../../../../gql/index.ts'

export const queryTpopkontr = graphql(`
  query TpopkontrQueryForSetStartjahr($tpopId: UUID!) {
    tpopById(id: $tpopId) {
      id
      tpopkontrsByTpopId {
        nodes {
          id
          jahr
        }
      }
    }
  }
`)
