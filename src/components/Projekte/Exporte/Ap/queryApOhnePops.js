import gql from 'graphql-tag'

export default gql`
  query apOhnepopForExportQuery {
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
        popsByApId {
          totalCount
        }
      }
    }
  }
`
