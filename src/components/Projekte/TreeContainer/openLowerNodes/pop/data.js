import gql from 'graphql-tag'

export default gql`
  query Query($id: UUID!) {
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
