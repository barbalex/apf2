import { gql } from '@apollo/client'

export default gql`
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
`
