import gql from 'graphql-tag'

export default gql`
  query ApApberUndMassnsForExportQuery {
    allAps(orderBy: AE_TAXONOMY_BY_ART_ID__ARTNAME_ASC) {
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
        vApApberundmassnsById {
          nodes {
            id
            massnJahr
            massnAnzahl
            massnAnzahlBisher
            berichtErstellt
          }
        }
        changed
        changedBy
      }
    }
  }
`
