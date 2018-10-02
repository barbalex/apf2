import gql from 'graphql-tag'

export default gql`
  query popberByIdQuery($id: UUID!) {
    popberById(id: $id) {
      id
      popId
      jahr
      entwicklung
      tpopEntwicklungWerteByEntwicklung {
        id
        code
        text
        sort
      }
      bemerkungen
      popByPopId {
        id
        apId
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
