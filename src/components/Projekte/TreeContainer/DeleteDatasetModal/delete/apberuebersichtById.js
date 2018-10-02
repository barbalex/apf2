import gql from 'graphql-tag'

export default gql`
  query apberuebersichtById($id: UUID!) {
    apberuebersichtById(id: $id) {
      id
      projId
      jahr
      bemerkungen
    }
  }
`
