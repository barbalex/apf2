import gql from 'graphql-tag'

import { pop } from '../../../shared/fragments'

export default gql`
  mutation updatePop(
    $id: UUID!
    $apId: UUID
    $nr: Int
    $name: String
    $status: Int
    $statusUnklar: Boolean
    $statusUnklarBegruendung: String
    $bekanntSeit: Int
    $x: Int
    $y: Int
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
          x: $x
          y: $y
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
