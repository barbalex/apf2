import gql from 'graphql-tag'

export default gql`
  query apById($id: UUID!) {
    apById(id: $id) {
      id
      bearbeitung
      startJahr
      umsetzung
      artId
      bearbeiter
      projId
    }
  }
`
