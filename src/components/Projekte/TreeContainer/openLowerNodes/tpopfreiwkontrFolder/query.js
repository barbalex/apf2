import { gql } from '@apollo/client'

export const query = gql`
  query ekfFolderOpenLowerNodesQuery($id: UUID!) {
    tpopById(id: $id) {
      id
      tpopkontrsByTpopId(
        filter: { typ: { equalTo: "Freiwilligen-Erfolgskontrolle" } }
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
