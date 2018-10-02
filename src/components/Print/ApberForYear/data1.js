import gql from 'graphql-tag'

export default gql`
  query apberuebersichtById($apberuebersichtId: UUID!) {
    apberuebersichtById(id: $apberuebersichtId) {
      id
      jahr
      bemerkungen
      projId
      projektByProjId {
        id
        name
      }
    }
  }
`
