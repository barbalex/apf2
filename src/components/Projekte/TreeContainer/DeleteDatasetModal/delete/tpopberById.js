import gql from 'graphql-tag'

export default gql`
  query tpopberById($id: UUID!) {
    tpopberById(id: $id) {
      id
      tpopId
      jahr
      entwicklung
      bemerkungen
    }
  }
`
