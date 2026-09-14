import { graphql } from '../../../../gql'

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
