import gql from 'graphql-tag'

export default gql`
  query copyTpopKoordToPopQuery($id: UUID!) {
    tpopById(id: $id) {
      id
      popId
      geomPoint {
        geojson
        #srid
        x
        y
      }
    }
  }
`
