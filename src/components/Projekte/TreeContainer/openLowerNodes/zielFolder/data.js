import gql from 'graphql-tag'

export default gql`
  query Query($id: UUID!) {
    apById(id: $id) {
      id
      zielsByApId {
        nodes {
          id
          jahr
          zielbersByZielId {
            nodes {
              id
            }
          }
        }
      }
    }
  }
`
