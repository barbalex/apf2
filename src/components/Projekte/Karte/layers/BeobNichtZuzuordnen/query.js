import { gql } from '@apollo/client'

export default gql`
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
        aeTaxonomyByArtId {
          id
          artname
        }
      }
    }
  }
`
