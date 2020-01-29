import gql from 'graphql-tag'

import { pop } from '../../components/shared/fragments'

export default gql`
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
