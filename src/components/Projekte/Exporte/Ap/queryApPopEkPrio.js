import { gql } from '@apollo/client'

export default gql`
  query apPopEkPrioForExportQuery {
    allAps(
      orderBy: AE_TAXONOMY_BY_ART_ID__ARTNAME_ASC
      filter: { bearbeitung: { lessThan: 4 } }
    ) {
      nodes {
        id
        aeTaxonomyByArtId {
          id
          artname
          artwert
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
        vApPopEkPriosByApId {
          nodes {
            id: apId
            jahrZuvor
            jahrZuletzt
            anzPopUrsprZuvor
            anzPopAngesZuvor
            anzPopAktuellZuvor
            anzPopUrsprZuletzt
            anzPopAngesZuletzt
            anzPopAktuellZuletzt
            diffPopUrspr
            diffPopAnges
            diffPopAktuell
            beurteilungZuletzt
          }
        }
      }
    }
  }
`
