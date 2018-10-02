import gql from 'graphql-tag'

export default gql`
  query apberuebersichtByIdQuery($id: UUID!) {
    apberuebersichtById(id: $id) {
      id
      projId
      jahr
      bemerkungen
    }
  }
`
