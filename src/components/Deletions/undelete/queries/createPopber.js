import { gql } from '@apollo/client'

import { popber } from '../../../shared/fragments'

export default gql`
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
