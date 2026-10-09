import { graphql } from '../../../../../gql/index.ts'

export const query = graphql(`
  query KarteBeobNichtZuzuordnenQuery($beobFilter: BeobFilter!) {
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
      }
    }
  }
`)
