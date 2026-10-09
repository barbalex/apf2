import { graphql } from '../../../../../gql/index.ts'

export const query = graphql(`
  query BeobAssignLinesQuery($beobFilter: BeobFilter!) {
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
        aeTaxonomyByArtId {
          id
          artname
        }
        tpopByTpopId {
          id
          popId
          nr
          flurname
          wgs84Lat
          wgs84Long
        }
      }
    }
  }
`)
