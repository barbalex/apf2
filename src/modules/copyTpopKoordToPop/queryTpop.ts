import { graphql } from '../../gql/index.ts'

export const queryTpop = graphql(`
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
`)
