import { gql } from '@apollo/client'

export const queryTpop = gql`
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
