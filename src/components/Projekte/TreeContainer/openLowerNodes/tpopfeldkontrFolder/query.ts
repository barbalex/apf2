import { gql } from '@apollo/client'

export const query = gql`
  query ekOpenLowerNodesQuery($id: UUID!) {
    tpopById(id: $id) {
      id
      tpopkontrsByTpopId(
        filter: { typ: { notEqualTo: "Freiwilligen-Erfolgskontrolle" } }
      ) {
        nodes {
          id
          tpopkontrzaehlsByTpopkontrId {
            nodes {
              id
            }
          }
        }
      }
    }
  }
`
