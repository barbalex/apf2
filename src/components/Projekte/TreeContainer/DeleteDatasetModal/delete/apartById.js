import gql from 'graphql-tag'

export default gql`
  query apartById($id: UUID!) {
    apartById(id: $id) {
      id
      apId
      artId
    }
  }
`
