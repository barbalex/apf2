import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { pop } from '../../../shared/fragments.ts'

export default dynamicGql`
  mutation createPopForUndelete(
    $id: UUID
    $apId: UUID
    $nr: Int
    $name: String
    $status: Int
    $statusUnklar: Boolean
    $statusUnklarBegruendung: String
    $bekanntSeit: Int
    $geomPoint: GeoJSON
  ) {
    createPop(
      input: {
        pop: {
          id: $id
          apId: $apId
          nr: $nr
          name: $name
          status: $status
          statusUnklar: $statusUnklar
          statusUnklarBegruendung: $statusUnklarBegruendung
          bekanntSeit: $bekanntSeit
          geomPoint: $geomPoint
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
