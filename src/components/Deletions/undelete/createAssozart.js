import gql from 'graphql-tag'

import { assozart } from '../../shared/fragments'

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
