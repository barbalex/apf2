import gql from 'graphql-tag'

export default gql`
  query popmassnberById($id: UUID!) {
    popmassnberById(id: $id) {
      id
      popId
      jahr
      beurteilung
      bemerkungen
    }
  }
`
