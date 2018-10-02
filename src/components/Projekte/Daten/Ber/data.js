import gql from 'graphql-tag'

export default gql`
  query berByIdQuery($id: UUID!) {
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
