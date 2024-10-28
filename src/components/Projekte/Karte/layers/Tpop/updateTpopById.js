import { gql } from '@apollo/client'

import { tpop } from '../../../../shared/fragments.js'

export const updateTpopById = gql`
  mutation updateTpopByIdForKarte($id: UUID!, $geomPoint: GeoJSON) {
    updateTpopById(input: { id: $id, tpopPatch: { geomPoint: $geomPoint } }) {
      tpop {
        ...TpopFields
      }
    }
  }
  ${tpop}
`
