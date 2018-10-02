import gql from 'graphql-tag'

export default gql`
  query ekfzaehleinheitById($id: UUID!) {
    ekfzaehleinheitById(id: $id) {
      id
      bemerkungen
      zaehleinheitId
      apId
    }
  }
`
