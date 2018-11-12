import gql from 'graphql-tag'

export default gql`
  query apByIdQuery($id: UUID!) {
    apById(id: $id) {
      id
      bearbeitung
      startJahr
      umsetzung
      artId
      bearbeiter
      ekfBeobachtungszeitpunkt
      adresseByBearbeiter {
        id
        name
      }
      projId
      aeEigenschaftenByArtId {
        id
        artname
        artwert
      }
    }
    allApBearbstandWertes {
      nodes {
        id
        code
        text
        sort
      }
    }
    allApUmsetzungWertes {
      nodes {
        id
        code
        text
        sort
      }
    }
  }
`
