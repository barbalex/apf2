import { gql } from '@apollo/client'

export const updateTpopById = gql`
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
`
