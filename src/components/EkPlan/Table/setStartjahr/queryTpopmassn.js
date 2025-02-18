import { gql } from '@apollo/client'

export const queryTpopmassn = gql`
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
`
