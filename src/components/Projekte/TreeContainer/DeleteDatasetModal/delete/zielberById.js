import gql from 'graphql-tag'

export default gql`
  query zielberById($id: UUID!) {
    zielberById(id: $id) {
      id
      zielId
      jahr
      erreichung
      bemerkungen
    }
  }
`
