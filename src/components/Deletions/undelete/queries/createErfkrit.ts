import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { erfkrit } from '../../../shared/fragments.ts'

export default dynamicGql`
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
