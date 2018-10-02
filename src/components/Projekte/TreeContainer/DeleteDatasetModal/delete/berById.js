import gql from 'graphql-tag'

export default gql`
  query berById($id: UUID!) {
    berById(id: $id) {
      id
      apId
      autor
      jahr
      titel
      url
    }
  }
`
