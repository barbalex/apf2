import gql from 'graphql-tag'

export default gql`
  query zielbersForExportQuery {
    allZielbers(
      orderBy: [ZIEL_BY_ZIEL_ID__JAHR_ASC, ZIEL_BY_ZIEL_ID__TYP_ASC, JAHR_ASC]
    ) {
      nodes {
        zielByZielId {
          id
          jahr
          zielTypWerteByTyp {
            id
            text
          }
          bezeichnung
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
        }
        id
        jahr
        erreichung
        bemerkungen
        changed
        changedBy
      }
    }
  }
`
