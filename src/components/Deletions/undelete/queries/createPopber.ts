import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { popber } from '../../../shared/fragments.ts'

export default dynamicGql`
  mutation createPopberForUndelete(
    $id: UUID
    $popId: UUID
    $jahr: Int
    $entwicklung: Int
    $bemerkungen: String
  ) {
    createPopber(
      input: {
        popber: {
          id: $id
          popId: $popId
          jahr: $jahr
          entwicklung: $entwicklung
          bemerkungen: $bemerkungen
        }
      }
    ) {
      popber {
        ...PopberFields
      }
    }
  }
  ${popber}
`
