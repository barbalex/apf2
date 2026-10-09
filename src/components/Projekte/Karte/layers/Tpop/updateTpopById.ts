import { gql as dynamicGql } from '../../../../../apolloGql.ts'

import { tpop } from '../../../../shared/fragments.ts'

export const updateTpopById = dynamicGql`
  mutation updateTpopByIdForKarte($id: UUID!, $geomPoint: GeoJSON) {
    updateTpopById(input: { id: $id, tpopPatch: { geomPoint: $geomPoint } }) {
      tpop {
        ...TpopFields
      }
    }
  }
  ${tpop}
`
