import { graphql } from '../../../../../gql'

export const query = graphql(`
  query BeobZugeordnetForMapQuery($beobFilter: BeobFilter!) {
    allBeobs(filter: $beobFilter) {
      nodes {
        id
        wgs84Lat
        wgs84Long
        lv95X
        lv95Y
        datum
        autor
        quelle
        absenz
        aeTaxonomyByArtId {
          id
          artname
        }
        tpopByTpopId {
          id
          popId
          nr
          flurname
          popByPopId {
            id
            label
          }
        }
      }
    }
  }
`)
