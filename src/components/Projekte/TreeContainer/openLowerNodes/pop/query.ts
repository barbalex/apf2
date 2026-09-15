import { graphql } from '../../../../../gql/index.ts'

export const query = graphql(`
  query popForLowerNodesQuery($id: UUID!) {
    popById(id: $id) {
      id
      tpopsByPopId {
        nodes {
          id
        }
      }
      popbersByPopId {
        nodes {
          id
        }
      }
      popmassnbersByPopId {
        nodes {
          id
        }
      }
    }
  }
`)
