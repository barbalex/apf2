import { gql as dynamicGql } from '../../apolloGql.ts'

import { pop } from '../../components/shared/fragments.ts'

export const createPop = dynamicGql`
  mutation createPopForCreateNewPopFromBeob(
    $apId: UUID
    $bekanntSeit: Int
    $geomPoint: GeoJSON
  ) {
    createPop(
      input: {
        pop: { apId: $apId, bekanntSeit: $bekanntSeit, geomPoint: $geomPoint }
      }
    ) {
      pop {
        ...PopFields
      }
    }
  }
  ${pop}
`
