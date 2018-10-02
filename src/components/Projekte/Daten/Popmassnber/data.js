import gql from 'graphql-tag'

export default gql`
  query popmassnberByIdQuery($id: UUID!) {
    popmassnberById(id: $id) {
      id
      popId
      jahr
      beurteilung
      tpopmassnErfbeurtWerteByBeurteilung {
        id
        text
      }
      bemerkungen
      popByPopId {
        id
        apId
      }
    }
  }
`
