import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { tpop } from '../../../shared/fragments.ts'

export const mutationUpdateTpop = dynamicGql`
  mutation updateTpopForStartjahr(
    $id: UUID!
    $ekfrequenzStartjahr: Int
    $changedBy: String
  ) {
    updateTpopById(
      input: {
        id: $id
        tpopPatch: {
          ekfrequenzStartjahr: $ekfrequenzStartjahr
          changedBy: $changedBy
        }
      }
    ) {
      tpop {
        ...TpopFields
      }
    }
  }
  ${tpop}
`
