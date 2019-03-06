import gql from 'graphql-tag'

import { erfkrit } from '../../shared/fragments'

export default gql`
  mutation createErfkrit(
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
