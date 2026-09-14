import { graphql } from '../../../../../gql'

export const query = graphql(`
  query popFolderQuery($id: UUID!) {
    apById(id: $id) {
      id
      popsByApId {
        nodes {
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
    }
  }
`)
