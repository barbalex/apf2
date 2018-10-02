import gql from 'graphql-tag'

export default gql`
  query assozartById($id: UUID!) {
    assozartById(id: $id) {
      id
      bemerkungen
      aeId
      apId
    }
  }
`
