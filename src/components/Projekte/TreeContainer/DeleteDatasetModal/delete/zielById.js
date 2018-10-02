import gql from 'graphql-tag'

export default gql`
  query zielById($id: UUID!) {
    zielById(id: $id) {
      id
      apId
      typ
      jahr
      bezeichnung
    }
  }
`
