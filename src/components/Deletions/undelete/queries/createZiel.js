import { gql } from '@apollo/client'

import { ziel } from '../../../shared/fragments.js'

export default gql`
  mutation createZielForUndelete(
    $id: UUID
    $apId: UUID
    $typ: Int
    $jahr: Int
    $bezeichnung: String
  ) {
    createZiel(
      input: {
        ziel: {
          id: $id
          apId: $apId
          typ: $typ
          jahr: $jahr
          bezeichnung: $bezeichnung
        }
      }
    ) {
      ziel {
        ...ZielFields
      }
    }
  }
  ${ziel}
`
