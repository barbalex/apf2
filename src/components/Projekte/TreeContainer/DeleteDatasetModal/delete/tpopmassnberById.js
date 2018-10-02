import gql from 'graphql-tag'

export default gql`
  query tpopmassnberById($id: UUID!) {
    tpopmassnberById(id: $id) {
      id
      tpopId
      jahr
      beurteilung
      bemerkungen
    }
  }
`
