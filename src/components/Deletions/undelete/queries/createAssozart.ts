import { gql } from '@apollo/client'

import { assozart } from '../../../shared/fragments.ts'

export default gql`
  mutation createAssozartForUndelete(
    $id: UUID
    $bemerkungen: String
    $aeId: UUID
    $apId: UUID
  ) {
    createAssozart(
      input: {
        assozart: {
          id: $id
          bemerkungen: $bemerkungen
          aeId: $aeId
          apId: $apId
        }
      }
    ) {
      assozart {
        ...AssozartFields
      }
    }
  }
  ${assozart}
`
