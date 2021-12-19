import { gql } from '@apollo/client'

export default gql`
  query assozartsForExportQuery {
    allAssozarts(
      orderBy: [AP_BY_AP_ID__LABEL_ASC, AE_TAXONOMY_BY_AE_ID__ARTNAME_ASC]
    ) {
      nodes {
        id
        apId
        aeTaxonomyByAeId {
          id
          artname
        }
        apByApId {
          id
          label
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
        createdAt
        updatedAt
        changedBy
      }
    }
  }
`
