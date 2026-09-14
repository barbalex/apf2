import { gql as dynamicGql } from '../../apolloGql.ts'

import { pop } from '../../components/shared/fragments.ts'

export const updatePopById = dynamicGql`
  mutation updatePopByIdForCopyTpopKoordToPop($id: UUID!, $geomPoint: GeoJSON) {
    updatePopById(input: { id: $id, popPatch: { geomPoint: $geomPoint } }) {
      pop {
        ...PopFields
      }
    }
  }
  ${pop}
`
