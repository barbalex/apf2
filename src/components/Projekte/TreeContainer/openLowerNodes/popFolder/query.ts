import { gql } from '@apollo/client'

export const query = gql`
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
`
