import gql from 'graphql-tag'

export default gql`
  query zielByIdQuery($id: UUID!) {
    zielById(id: $id) {
      id
      apId
      typ
      jahr
      bezeichnung
    }
    allZielTypWertes {
      nodes {
        id
        code
        text
        sort
      }
    }
  }
`
