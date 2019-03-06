import gql from 'graphql-tag'

export default gql`
  query popmassnberByIdQuery($id: UUID!) {
    popmassnberById(id: $id) {
      id
      popId
      jahr
      beurteilung
      bemerkungen
      tpopmassnErfbeurtWerteByBeurteilung {
        id
        text
      }
      popByPopId {
        id
        apId
      }
    }
  }
`
