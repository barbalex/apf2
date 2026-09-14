import { graphql } from '../../../../../gql'

export const query = graphql(`
  query ekOpenLowerNodesQuery($id: UUID!) {
    tpopById(id: $id) {
      id
      tpopkontrsByTpopId(
        filter: { typ: { notEqualTo: "Freiwilligen-Kontrolle" } }
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
