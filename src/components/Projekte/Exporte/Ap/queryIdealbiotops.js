import gql from 'graphql-tag'

export default gql`
  query idealbiotopsForExportQuery {
    allIdealbiotops {
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
        erstelldatum
        hoehenlage
        region
        exposition
        besonnung
        hangneigung
        bodenTyp
        bodenKalkgehalt
        bodenDurchlaessigkeit
        bodenHumus
        bodenNaehrstoffgehalt
        wasserhaushalt
        konkurrenz
        moosschicht
        krautschicht
        strauchschicht
        baumschicht
        bemerkungen
        changed
        changedBy
      }
    }
  }
`
