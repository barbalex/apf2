import gql from 'graphql-tag'

import { ekplan } from '../../../../shared/fragments'

export default gql`
  mutation createEkplan(
    $tpopId: UUID
    $jahr: Int
    $typ: EkType
    $changedBy: String
  ) {
    createEkplan(
      input: {
        ekplan: {
          tpopId: $tpopId
          jahr: $jahr
          typ: $typ
          changedBy: $changedBy
        }
      }
    ) {
      ekplan {
        ...EkplanFields
      }
    }
  }
  ${ekplan}
`
