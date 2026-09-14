import { graphql } from '../../../../../gql'

export const query = graphql(`
  query ekfFolderOpenLowerNodesQuery($id: UUID!) {
    tpopById(id: $id) {
      id
      tpopkontrsByTpopId(
        filter: { typ: { equalTo: "Freiwilligen-Kontrolle" } }
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
`)
