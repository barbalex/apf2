import { gql } from '@apollo/client'

import { pop } from '../../../shared/fragments'

export default gql`
  mutation updatePopForPop(
    $id: UUID!
    $apId: UUID
    $nr: Int
    $name: String
    $status: Int
    $statusUnklar: Boolean
    $statusUnklarBegruendung: String
    $bekanntSeit: Int
    $geomPoint: GeoJSON
    $changedBy: String
  ) {
    updatePopById(
      input: {
        id: $id
        popPatch: {
          id: $id
          apId: $apId
          nr: $nr
          name: $name
          status: $status
          statusUnklar: $statusUnklar
          statusUnklarBegruendung: $statusUnklarBegruendung
          bekanntSeit: $bekanntSeit
          geomPoint: $geomPoint
          changedBy: $changedBy
        }
      }
    ) {
      pop {
        ...PopFields
      }
    }
  }
  ${pop}
`
