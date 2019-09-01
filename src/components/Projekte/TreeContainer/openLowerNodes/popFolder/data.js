import gql from 'graphql-tag'

export default gql`
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
