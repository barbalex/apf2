import { gql } from '@apollo/client'

import { erfkrit } from '../../../shared/fragments'

export default gql`
  mutation createErfkritForUndelete(
    $id: UUID
    $apId: UUID
    $erfolg: Int
    $kriterien: String
  ) {
    createErfkrit(
      input: {
        erfkrit: {
          id: $id
          apId: $apId
          erfolg: $erfolg
          kriterien: $kriterien
        }
      }
    ) {
      erfkrit {
        ...ErfkritFields
      }
    }
  }
  ${erfkrit}
`
