import gql from 'graphql-tag'

export default gql`
  query erfkritsForExportQuery {
    allErfkrits {
      nodes {
        id
        apId
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
        apErfkritWerteByErfolg {
          id
          text
        }
        kriterien
        changed
        changedBy
      }
    }
  }
`
