import gql from 'graphql-tag'

import { pop } from '../../components/shared/fragments'

export default gql`
  mutation createPop($apId: UUID, $bekanntSeit: Int, $geomPoint: String) {
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
