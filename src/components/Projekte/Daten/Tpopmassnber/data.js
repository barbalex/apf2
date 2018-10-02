import gql from 'graphql-tag'

export default gql`
  query tpopmassnberByIdQuery($id: UUID!) {
    tpopmassnberById(id: $id) {
      id
      tpopId
      jahr
      beurteilung
      bemerkungen
      tpopByTpopId {
        id
        popByPopId {
          id
          apId
        }
      }
    }
  }
`
