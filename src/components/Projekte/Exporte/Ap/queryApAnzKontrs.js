import { gql } from '@apollo/client'

export default gql`
  query apAnzkontrsForExportQuery {
    allAps(orderBy: AE_TAXONOMY_BY_ART_ID__ARTNAME_ASC) {
      nodes {
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
        vApAnzkontrsById {
          nodes {
            id
            anzahlKontrollen
          }
        }
      }
    }
  }
`
