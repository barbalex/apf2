import { graphql } from '../../gql'

export const updateTpopById = graphql(`
  mutation updateTpopByIdForCopyBeobZugeordnetToTpop(
    $id: UUID!
    $geomPoint: GeoJSON
  ) {
    updateTpopById(input: { id: $id, tpopPatch: { geomPoint: $geomPoint } }) {
      tpop {
        id
        lv95X
        lv95Y
      }
    }
  }
`)
