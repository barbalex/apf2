import gql from 'graphql-tag'

export default gql`
  query zielberByIdQuery($id: UUID!) {
    zielberById(id: $id) {
      id
      zielId
      jahr
      erreichung
      bemerkungen
      zielByZielId {
        id
        apId
      }
    }
  }
`
