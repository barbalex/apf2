import { gql } from '@apollo/client'

import { pop } from '../../components/shared/fragments.js'

export const updatePopById = gql`
  mutation updatePopByIdForCopyTpopKoordToPop($id: UUID!, $geomPoint: GeoJSON) {
    updatePopById(input: { id: $id, popPatch: { geomPoint: $geomPoint } }) {
      pop {
        ...PopFields
      }
    }
  }
  ${pop}
`
