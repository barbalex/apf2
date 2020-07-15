import { gql } from '@apollo/client'

import { tpop } from '../../../shared/fragments'

export default gql`
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
