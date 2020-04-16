import gql from 'graphql-tag'

export default gql`
  query zielsForExportQuery {
    allZiels(
      orderBy: [
        AP_BY_AP_ID__ART_ID_ASC
        JAHR_ASC
        ZIEL_TYP_WERTE_BY_TYP__TEXT_ASC
        ZIEL_TYP_WERTE_BY_TYP__TEXT_ASC
      ]
    ) {
      nodes {
        id
        jahr
        typ
        zielTypWerteByTyp {
          id
          text
        }
        bezeichnung
        apByApId {
          id
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
          aeTaxonomyByArtId {
            id
            artname
          }
        }
      }
    }
  }
`
