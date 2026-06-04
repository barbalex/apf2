import { gql } from '@apollo/client'

export const queryTpopkontr = gql`
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
`
