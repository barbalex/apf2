import gql from 'graphql-tag'

export default gql`
  query assozartsForExportQuery {
    allAssozarts {
      nodes {
        id
        apId
        aeTaxonomyByAeId {
          id
          artname
        }
        apByApId {
          id
          aeTaxonomyByArtId {
            id
            artname
          }
          apBearbstandWerteByBearbeitung {
            id
            text
          }
          startJahr
          apUmsetzungWerteByUmsetzung {
            id
            text
          }
          adresseByBearbeiter {
            id
            name
          }
        }
        bemerkungen
        changed
        changedBy
      }
    }
  }
`
