import gql from 'graphql-tag'

export default gql`
  query popberById($id: UUID!) {
    popberById(id: $id) {
      id
      popId
      jahr
      entwicklung
      bemerkungen
    }
  }
`
