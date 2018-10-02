import gql from 'graphql-tag'

export default gql`
  query tpopberByIdQuery($id: UUID!) {
    tpopberById(id: $id) {
      id
      tpopId
      jahr
      entwicklung
      tpopEntwicklungWerteByEntwicklung {
        id
        code
        text
        sort
      }
      bemerkungen
      tpopByTpopId {
        id
        popByPopId {
          id
          apId
        }
      }
    }
    allTpopEntwicklungWertes {
      nodes {
        id
        code
        text
        sort
      }
    }
  }
`
