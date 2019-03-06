import gql from 'graphql-tag'

import { pop } from '../../components/shared/fragments'

export default gql`
  mutation createPop(
    $apId: UUID
    $nr: Int
    $name: String
    $status: Int
    $statusUnklar: Boolean
    $statusUnklarBegruendung: String
    $bekanntSeit: Int
    $x: Int
    $y: Int
  ) {
    createPop(
      input: {
        pop: {
          apId: $apId
          nr: $nr
          name: $name
          status: $status
          statusUnklar: $statusUnklar
          statusUnklarBegruendung: $statusUnklarBegruendung
          bekanntSeit: $bekanntSeit
          x: $x
          y: $y
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
