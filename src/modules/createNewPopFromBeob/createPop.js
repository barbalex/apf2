import { gql } from '@apollo/client'

import { pop } from '../../components/shared/fragments.js'

export const createPop = gql`
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
