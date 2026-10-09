import { graphql } from '../../../../../gql/index.ts'

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
