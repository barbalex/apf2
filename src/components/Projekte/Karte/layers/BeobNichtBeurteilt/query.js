import { gql } from '@apollo/client'

export const query = gql`
  query BeobNichtBeurteiltForMapQuery($beobFilter: BeobFilter!) {
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
      }
    }
  }
`
