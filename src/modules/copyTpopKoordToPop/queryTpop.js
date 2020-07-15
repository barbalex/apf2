import { gql } from '@apollo/client'

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
