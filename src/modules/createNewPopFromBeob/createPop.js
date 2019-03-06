import gql from 'graphql-tag'

import { pop } from '../../components/shared/fragments'

export default gql`
  mutation ceatePop($apId: UUID, $bekanntSeit: Int, $x: Int, $y: Int) {
    createPop(
      input: { pop: { apId: $apId, bekanntSeit: $bekanntSeit, x: $x, y: $y } }
    ) {
      pop {
        ...PopFields
      }
    }
  }
  ${pop}
`
